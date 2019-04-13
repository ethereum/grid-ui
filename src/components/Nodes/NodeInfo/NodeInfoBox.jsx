import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import styled, { css } from 'styled-components'
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna'
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt'
import AvTimerIcon from '@material-ui/icons/AvTimer'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import LayersIcon from '@material-ui/icons/Layers'
import PeopleIcon from '@material-ui/icons/People'
import LinearScaleIcon from '@material-ui/icons/LinearScale'

const numberWithCommas = val => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const defaultIconProps = {
  fontSize: 'inherit'
}

class NodeInfoBox extends Component {
  constructor(props) {
    super(props)
    this.state = { diffTimestamp: moment().unix() }
  }

  componentDidMount() {
    // NOTE: this component should update diff every second
    this.diffInterval = setInterval(() => {
      this.setState({ diffTimestamp: moment().unix() })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.diffInterval)
  }

  renderStopped = () => {
    return (
      <StyledIconRow>
        <LinearScaleIcon {...defaultIconProps} />
        Stopped
      </StyledIconRow>
    )
  }

  renderConnecting = () => {
    return (
      <StyledIconRow>
        <LinearScaleIcon {...defaultIconProps} />
        Connecting...
      </StyledIconRow>
    )
  }

  renderFindingPeers = () => {
    return (
      <StyledIconRow>
        <SettingsInputAntennaIcon {...defaultIconProps} />
        Looking for peers...
      </StyledIconRow>
    )
  }

  renderSyncStarting = () => {
    const { client } = this.props
    const { peerCount } = client

    return (
      <div>
        <StyledIconRow>
          <PeopleIcon {...defaultIconProps} />
          {`${peerCount} peers`}
        </StyledIconRow>
        <StyledIconRow>
          <OfflineBoltIcon {...defaultIconProps} />
          Sync starting...
        </StyledIconRow>
      </div>
    )
  }

  renderSyncProgress() {
    const { client } = this.props
    const { sync, config, peerCount } = client
    const { network } = config
    const { highestBlock, currentBlock, startingBlock } = sync

    const formattedCurrentBlock = numberWithCommas(currentBlock)

    const progress =
      ((currentBlock - startingBlock) / (highestBlock - startingBlock)) * 100

    return (
      <div>
        <StyledIconRow>
          <LayersIcon {...defaultIconProps} />
          {formattedCurrentBlock}
        </StyledIconRow>
        <StyledIconRow>
          <PeopleIcon {...defaultIconProps} />
          {`${peerCount} peers`}
        </StyledIconRow>
        <StyledIconRow>
          <CloudDownloadIcon {...defaultIconProps} />
          <StyledProgress
            testnet={network !== 'main'}
            max="100"
            value={progress || 0}
          />
        </StyledIconRow>
      </div>
    )
  }

  renderSynced() {
    const { client } = this.props
    const { diffTimestamp } = this.state
    const { blockNumber, timestamp, peerCount, config } = client
    const { network } = config

    const formattedBlockNumber = numberWithCommas(blockNumber)

    const timeSince = moment.unix(timestamp)
    const diff = moment.unix(diffTimestamp).diff(timeSince, 'seconds')

    return (
      <div>
        <StyledIconRow title="Block Number">
          <LayersIcon {...defaultIconProps} />
          {formattedBlockNumber}
        </StyledIconRow>
        {network !== 'private' && (
          <StyledIconRow>
            <PeopleIcon {...defaultIconProps} />
            {peerCount} peers
          </StyledIconRow>
        )}
        <StyledIconRow
          className={diff > 60 ? 'block-diff orange' : 'block-diff'}
        >
          {
            // TODO: make this i8n compatible
          }
          <AvTimerIcon {...defaultIconProps} />
          {diff < 120 ? `${diff} seconds` : `${Math.floor(diff / 60)} minutes`}
        </StyledIconRow>
      </div>
    )
  }

  renderStats() {
    const { client } = this.props
    const { sync, blockNumber, config, peerCount, state } = client
    const { syncMode, network } = config
    const { highestBlock, startingBlock } = sync

    let stats

    if (state === 'STARTED') {
      // Case: connecting
      stats = this.renderConnecting()
    }
    if (state === 'CONNECTED') {
      if (peerCount === 0) {
        // Case: no peers yet
        stats = this.renderFindingPeers()
      } else {
        // Case: connected to peers, but no blocks yet
        stats = this.renderSyncStarting()
      }
    }
    if (blockNumber > 0 && blockNumber - 50 > highestBlock) {
      // Case: all sync'd up
      stats = this.renderSynced()
    } else if (startingBlock > 0) {
      // Case: show progress
      stats = this.renderSyncProgress()
    }
    if (state === 'STOPPED') {
      // Case: node stopped
      stats = this.renderStopped()
    }

    return (
      <StyledSection>
        <StyledTitle testnet={network !== 'main'}>
          <strong>Local</strong> Node
          <StyledPill>{syncMode} sync</StyledPill>
        </StyledTitle>
        {stats}
      </StyledSection>
    )
  }

  render() {
    const { client } = this.props
    const { config } = client
    const { network } = config
    return (
      <StyledBox>
        <StyledSubmenuContainer>
          <section>
            <StyledSection>
              <StyledNetworkTitle>{network}</StyledNetworkTitle>
              <StyledSubtitle>
                {network !== 'main' && 'Test Network'}
                {network === 'main' && 'Network'}
              </StyledSubtitle>
            </StyledSection>
            {this.renderStats()}
          </section>
        </StyledSubmenuContainer>
      </StyledBox>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(NodeInfoBox)

const StyledSubmenuContainer = styled.div`
  width: 220px;
  border-radius: 5px;
  z-index: 1000;
  cursor: default;

  transition: 150ms linear all, 1ms linear top;
  transition-delay: 200ms;
  transform: translateY(-11px);

  section {
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(2px);
    width: 100%;
    border-radius: 5px;
    color: #fff;
    position: relative;
  }

  /* Apply css arrow to topLeft of box */
  position: absolute;
  left: 85px;
  top: 6px;

  &::before {
    content: '';
    margin-left: -8px;
    top: 0;
    margin-top: 12px;
    display: block;
    position: absolute;
    width: 0px;
    height: 8px * 2.25;
    border: 0px solid transparent;
    border-width: 8px;
    border-left: 0;
    border-right-color: rgba(0, 0, 0, 0.78);
  }
`

const StyledSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding: 11px;
  &:first-of-type {
    border-top: none;
  }
`

const StyledNetworkTitle = styled.div`
  font-weight: 300;
  font-size: 24px;
  text-transform: capitalize;
`

const StyledSubtitle = styled.div`
  margin-left: 1px;
  font-size: 10px;
  color: #aaa;
  text-transform: uppercase;
`

const StyledPill = styled.span`
  display: inline-block;
  margin-left: 5px;
  font-weight: 300;
  font-size: 11px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 2px 6px;
  vertical-align: middle;
  text-transform: none;
`

const colorMainnet = '#7ed321'
const colorTestnet = '#00aafa'

const StyledTitle = styled.div`
  font-size: 18px;
  font-weight: 200;
  margin-bottom: 6px;
  strong {
    font-weight: 400;
  }
  ${props =>
    !props.testnet &&
    css`
      color: ${colorMainnet};
    `}
  ${props =>
    props.testnet &&
    css`
      color: ${colorTestnet};
    `}
`

const StyledProgress = styled.progress`
  width: 100%;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5) inset;
  background: rgba(255, 255, 255, 0.1);
  height: 5px;

  ${props =>
    !props.testnet &&
    css`
      &::-webkit-progress-value {
        bakground-image: linear-gradient(left, transparent, ${colorMainnet});
        background: ${colorMainnet};
        background-size: cover;
      }
    `}

  ${props =>
    props.testnet &&
    css`
      &::-webkit-progress-value {
        background-image: linear-gradient(left, transparent, ${colorTestnet});
        background: ${colorTestnet};
        background-size: cover;
      }
    `}
`

const StyledBox = styled.div`
  font-family: sans-serif;
  ${props =>
    props.dotLocation &&
    css`
      position: relative;
      top: -17px;
    `}

  strong {
    font-weight: 500;
  }

  .orange {
    color: orange;
  }

  .red {
    color: #e81e1e;
  }
`

const StyledIconRow = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  font-size: 13px;
  svg {
    display: inline-block;
    margin-right: 6px;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
`
