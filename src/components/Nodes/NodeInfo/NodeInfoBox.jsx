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

  localStatsStopped = () => {
    return (
      <div>
        <div className="connecting row-icon">
          <LinearScaleIcon {...defaultIconProps} />
          Stopped
        </div>
      </div>
    )
  }

  localStatsConnecting = () => {
    return (
      <div>
        <div className="connecting row-icon">
          <LinearScaleIcon {...defaultIconProps} />
          Connecting...
        </div>
      </div>
    )
  }

  localStatsFindingPeers = () => {
    return (
      <div>
        <div className="looking-for-peers row-icon">
          <SettingsInputAntennaIcon {...defaultIconProps} />
          Looking for peers...
        </div>
      </div>
    )
  }

  localStatsStartSync = () => {
    const { client } = this.props
    const { peerCount } = client

    return (
      <div>
        <div className="peer-count row-icon">
          <PeopleIcon {...defaultIconProps} />
          {`${peerCount} peers`}
        </div>
        <div className="sync-starting row-icon">
          <OfflineBoltIcon {...defaultIconProps} />
          Sync starting...
        </div>
      </div>
    )
  }

  localStatsSyncProgress() {
    const { client } = this.props
    const { sync, network, peerCount } = client
    const { highestBlock, currentBlock, startingBlock } = sync

    const formattedCurrentBlock = numberWithCommas(currentBlock)

    const progress =
      ((currentBlock - startingBlock) / (highestBlock - startingBlock)) * 100

    return (
      <div>
        <div className="block-number row-icon">
          <LayersIcon {...defaultIconProps} />
          {formattedCurrentBlock}
        </div>
        <div className="peer-count row-icon">
          <PeopleIcon {...defaultIconProps} />
          {`${peerCount} peers`}
        </div>
        <div className="sync-progress row-icon">
          <CloudDownloadIcon {...defaultIconProps} />
          <StyledProgress
            testnet={network !== 'main'}
            max="100"
            value={progress || 0}
          />
        </div>
      </div>
    )
  }

  localStatsSynced() {
    const { client } = this.props
    const { diffTimestamp } = this.state
    const { blockNumber, timestamp, peerCount, network } = client

    const formattedBlockNumber = numberWithCommas(blockNumber)

    const timeSince = moment.unix(timestamp)
    const diff = moment.unix(diffTimestamp).diff(timeSince, 'seconds')

    return (
      <div>
        <div className="block-number row-icon" title="Block Number">
          <LayersIcon {...defaultIconProps} />
          {formattedBlockNumber}
        </div>
        {network !== 'private' && (
          <div className="peer-count row-icon">
            <PeopleIcon {...defaultIconProps} />
            {peerCount} peers
          </div>
        )}
        <div
          className={
            diff > 60 ? 'block-diff row-icon red' : 'block-diff row-icon'
          }
        >
          {
            // TODO: make this i8n compatible
          }
          <AvTimerIcon {...defaultIconProps} />
          {diff < 120 ? `${diff} seconds` : `${Math.floor(diff / 60)} minutes`}
        </div>{' '}
      </div>
    )
  }

  renderLocalStats() {
    const { client } = this.props
    const { syncMode, sync, blockNumber, network, peerCount, state } = client
    const { highestBlock, startingBlock } = sync

    let localStats

    if (state === 'STARTED') {
      // Case: connecting
      localStats = this.localStatsConnecting()
    }
    if (state === 'CONNECTED') {
      if (peerCount === 0) {
        // case: no peers yet
        localStats = this.localStatsFindingPeers()
      } else {
        // Case: connected to peers, but no blocks yet
        localStats = this.localStatsStartSync()
      }
    }
    if (blockNumber > 0 && blockNumber - 50 > highestBlock) {
      // case: all sync'd up
      localStats = this.localStatsSynced()
    } else if (startingBlock > 0) {
      // Case: show progress
      localStats = this.localStatsSyncProgress()
    }
    if (state === 'STOPPED') {
      // case: node stopped
      localStats = this.localStatsStopped()
    }

    return (
      <StyledSection>
        <StyledTitle network="local" testnet={network !== 'main'}>
          <strong>Local</strong> Node
          <StyledPill>{syncMode}</StyledPill>
        </StyledTitle>

        {localStats}
      </StyledSection>
    )
  }

  render() {
    const { client } = this.props
    const { network } = client
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
            {this.renderLocalStats()}
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
  left: 40px;
  top: 0px;

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

  .row-icon {
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
  }

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
