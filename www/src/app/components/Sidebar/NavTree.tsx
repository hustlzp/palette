import { Box, Sans, SansSize } from "@artsy/palette"
import { StatusBadge } from "app/components/StatusBadge"
import { pathListToTree, TreeNode } from "app/utils/pathListToTree"
import { graphql, Link, StaticQuery } from "gatsby"
import { get, includes, reject, sortBy } from "lodash"
import React, { Fragment } from "react"
import { Subscribe } from "unstated"
import { NavState } from "./state"

export const NavTree = _props => {
  return (
    <StaticQuery
      query={graphql`
        query NavTreeQuery {
          allMdx {
            edges {
              node {
                fields {
                  route
                }
                frontmatter {
                  hideInNav
                  navSpacer {
                    mt
                  }
                  name
                  order
                  wip
                }
              }
            }
          }
        }
      `}
      render={data => {
        return renderNavTree(buildNavTree(data))
      }}
    />
  )
}

function renderNavTree(tree: TreeNode[], treeDepth: number = 0) {
  const getTreeLayout = () => {
    switch (treeDepth) {
      case 1: {
        return {
          ml: 2,
          py: 0.3,
          size: "2" as SansSize,
        }
      }
      default: {
        return {
          ml: 0,
          py: 0.2,
          size: "3" as SansSize,
        }
      }
    }
  }

  const { ml, py, size } = getTreeLayout()

  return (
    <Subscribe to={[NavState]}>
      {(navState: NavState) => (
        <Box ml={ml}>
          {tree.map(({ data, children, formattedName, path }: TreeNode) => {
            const hasChildren = Boolean(children.length)
            const isWIP = get(data, "wip", false)
            const navSpacer = get(data, "navSpacer", {})

            switch (hasChildren) {
              case true: {
                treeDepth++
                const expanded = includes(navState.state.expandedNavItems, path)

                return (
                  <Fragment key={path}>
                    <Sans size={size} py={py} {...navSpacer}>
                      <Link
                        to={path}
                        onClick={() => navState.toggleNavItem(path)}
                      >
                        {formattedName}
                        {isWIP && <StatusBadge status="WIP" />}
                      </Link>
                    </Sans>
                    {expanded && renderNavTree(children, treeDepth)}
                  </Fragment>
                )
              }
              case false: {
                return (
                  <Fragment key={path}>
                    <Sans size={size} py={py} {...navSpacer}>
                      <Link to={path}>{formattedName}</Link>
                    </Sans>
                  </Fragment>
                )
              }
            }
          })}
        </Box>
      )}
    </Subscribe>
  )
}

function buildNavTree(data) {
  const routes = data.allMdx.edges.reduce((acc, { node }) => {
    const { route } = node.fields
    if (route.length) {
      return [
        ...acc,
        {
          path: route,
          data: node.frontmatter,
        },
      ]
    } else {
      return acc
    }
  }, [])

  // Perform various operations depending on frontmatter
  const sorted = sortBy(routes, route => route.data.order)
  const visible = reject(sorted, route => route.data.hideInNav)
  const navTree = pathListToTree(visible).map(path => path.children)[0]
  return navTree
}
