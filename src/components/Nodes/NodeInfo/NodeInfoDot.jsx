import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled, { css, keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'
import PieChart from 'react-minimal-pie-chart'

class NodeInfoDot extends Component {
  static propTypes = {
    client: PropTypes.object,
    /** If component is stickied to apply drop shadow on dot */
    sticky: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      pulseColor: '',
      diffTimestamp: moment().unix()
    }
  }

  componentDidMount() {
    // NOTE: This component should update diff every second
    this.diffInterval = setInterval(() => {
      this.setState({ diffTimestamp: moment().unix() })
    }, 1000)
  }

  componentDidUpdate(prevProps) {
    const { client } = this.props

    if ((prevProps.client.blockNumber || 0) !== (client.blockNumber || 0)) {
      this.pulseForNewBlock()
    }
  }

  componentWillUnmount() {
    clearInterval(this.diffInterval)
  }

  pulseForNewBlock() {
    const { client } = this.props
    const { config } = client
    const { network } = config

    const pulseColor = network === 'main' ? 'green' : 'blue'

    this.setState({ pulseColor }, () => {
      setTimeout(() => {
        this.setState({ pulseColor: '' })
      }, 2000)
    })
  }

  secondsSinceLastBlock() {
    const { diffTimestamp } = this.state
    const { client } = this.props
    const { timestamp } = client
    const lastBlock = moment.unix(timestamp) // eslint-disable-line
    return moment.unix(diffTimestamp).diff(lastBlock, 'seconds')
  }

  render() {
    const { sticky, client } = this.props
    const { pulseColor } = this.state
    const { config, blockNumber, sync, state } = client
    const { network } = config

    let dotColor

    const colorMainnet = '#7ed321'
    const colorTestnet = '#00aafa'
    const colorRed = '#e81e1e'
    const colorOrange = 'orange'

    if (network === 'main') {
      dotColor = colorMainnet
    } else {
      dotColor = colorTestnet
    }
    if (this.secondsSinceLastBlock() > 60 || !blockNumber) {
      dotColor = colorOrange
    }
    if (state === 'STOPPED') {
      dotColor = colorRed
    }

    const { highestBlock, currentBlock, startingBlock } = sync
    const progress =
      ((currentBlock - startingBlock) / (highestBlock - startingBlock)) * 100

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

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(NodeInfoDot)

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
