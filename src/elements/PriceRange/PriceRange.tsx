import React from "react"
import styled from "styled-components"
import { space, SpaceProps } from "styled-system"
import { Flex, Sans, Separator, Serif, Slider, SliderProps } from "../"

interface PriceRangeProps extends SliderProps {
  currency?: string
  disabled?: boolean
}

interface PriceRangeState {
  min: number
  max: number
}

export class PriceRange extends React.Component<
  PriceRangeProps,
  PriceRangeState
> {
  static defaultProps = {
    currency: "USD",
    disabled: false,
  }

  state = {
    min: this.props.defaultValue[0],
    max: this.props.defaultValue[1],
  }

  componentWillReceiveProps(newProps: PriceRangeProps) {
    const [min, max] = newProps.defaultValue
    this.setState({
      min,
      max,
    })
  }

  updateMinMax = ([min, max]) => {
    this.setState({ min, max })
  }

  toString() {
    const formatOptions = {
      style: "currency",
      currency: this.props.currency,
      minimumFractionDigits: 0,
    }

    const minPrice = this.state.min.toLocaleString("en-US", formatOptions)
    const maxPrice = this.state.max.toLocaleString("en-US", formatOptions)
    const isMaxIndicator = this.props.max === this.state.max ? "+" : ""

    return `${minPrice} - ${maxPrice}${isMaxIndicator}`
  }

  render() {
    return (
      <Flex width="100%" flexDirection="column">
        <Separator mb={2} />
        <Header mt="-6px">
          <Flex justifyContent="space-between">
            <Sans size="2" weight="medium" color="black100" mt={0.3}>
              Price
            </Sans>
            <Serif size="2" color="black60" mt={0.3}>
              {this.toString()}
            </Serif>
          </Flex>
        </Header>

        <Flex flexDirection="column" alignItems="left" mt={-1} mb={1}>
          <SliderContainer>
            <Slider
              disabled={this.props.disabled}
              my={1}
              mx={1}
              {...this.props}
              onChange={minMax => {
                this.updateMinMax(minMax)
              }}
            />
          </SliderContainer>
        </Flex>
      </Flex>
    )
  }
}

const Header = styled.div.attrs<SpaceProps>({})`
  cursor: pointer;
  padding-bottom: 16px;
  user-select: none;
  ${space};
`

const SliderContainer = styled.div`
  width: 100%;
`

Header.displayName = "Header"
