import React, { Component } from 'react'
import styled, { css, keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'
import PieChart from 'react-minimal-pie-chart'

const colorMainnet = '#7ed321'
const colorTestnet = '#00aafa'
const colorRed = '#de3232'
const colorOrange = 'orange'

class NodeInfoDot extends Component {
  static propTypes = {
    plugin: PropTypes.object,
    diffTimestamp: PropTypes.number,
    isStopped: PropTypes.bool,
    /** If component is stickied, apply drop shadow on dot */
    sticky: PropTypes.bool
  }

  state = {
    pulseColor: ''
  }

  componentDidUpdate(prevProps) {
    const { plugin } = this.props

    if ((prevProps.plugin.blockNumber || 0) !== (plugin.blockNumber || 0)) {
      this.pulseForNewBlock()
    }
  }

  determineDotColor = () => {
    const { plugin, isStopped } = this.props
    const { config, active } = plugin
    const { network } = config
    const { blockNumber } = active

    let dotColor
    dotColor = network === 'main' ? colorMainnet : colorTestnet
    if (this.secondsSinceLastBlock() > 120 || !blockNumber) {
      dotColor = colorOrange
    }
    if (isStopped) {
      dotColor = colorRed
    }
    return dotColor
  }

  pulseForNewBlock = () => {
    const { plugin } = this.props
    const { config } = plugin
    const { network } = config

    const pulseColor = network === 'main' ? 'green' : 'blue'
    console.log('∆∆∆ pulse!', pulseColor)

    this.setState({ pulseColor }, () => {
      setTimeout(() => {
        this.setState({ pulseColor: '' })
      }, 2000)
    })
  }

  secondsSinceLastBlock = () => {
    const { plugin, diffTimestamp } = this.props
    const { timestamp } = plugin
    const lastBlock = moment.unix(timestamp) // eslint-disable-line
    return moment.unix(diffTimestamp).diff(lastBlock, 'seconds')
  }

  render() {
    const { plugin, sticky } = this.props
    const { pulseColor } = this.state
    const { active, config } = plugin
    const { blockNumber } = active
    const { network } = config

    const { sync } = active
    const { highestBlock, currentBlock, startingBlock } = sync
    const progress =
      ((currentBlock - startingBlock) / (highestBlock - startingBlock)) * 100

    const dotColor = this.determineDotColor()

    return (
      <div className="pie-container">
        <StyledLight
          pulseColor={pulseColor}
          sticky={sticky}
          style={{
            backgroundColor: dotColor
          }}
        >
          {currentBlock > 0 && dotColor !== colorRed && (
            <PieChart
              startAngle={-90}
              data={[
                {
                  value: progress || 0,
                  key: 1,
                  color: network === 'main' ? colorMainnet : colorTestnet
                },
                {
                  value: 100 - (progress || 1),
                  key: 2,
                  color: blockNumber > 100 ? 'orange' : 'red'
                }
              ]}
            />
          )}
        </StyledLight>
      </div>
    )
  }
}

export default NodeInfoDot

const beaconOrange = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 165, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0);
  }
`

const beaconGreen = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(36, 195, 58, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(36, 195, 58, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(36, 195, 58, 0);
  }
`

const beaconBlue = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 170, 250, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 170, 250, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 170, 250, 0);
  }
`

const StyledLight = styled.div`
  position: relative;
  z-index: 1;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  transition: background-color ease-in-out 2s;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    height: 16px;
  }

  ${props =>
    props.sticky &&
    css`
      box-shadow: inset rgba(0, 0, 0, 0.3) 0 1px 3px;
    `}

  ${props =>
    props.pulseColor === 'orange' &&
    css`
      animation: ${beaconOrange} ease-in-out;
      animation-duration: 2s;
    `}

  ${props =>
    props.pulseColor === 'green' &&
    css`
      animation: ${beaconGreen} ease-in-out;
      animation-duration: 2s;
    `}

  ${props =>
    props.pulseColor === 'blue' &&
    css`
      animation: ${beaconBlue} ease-in-out;
      animation-duration: 2s;
    `}
`
