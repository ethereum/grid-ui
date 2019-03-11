import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import { Mist } from '../../../API'
import VersionList from './VersionList'
import ConfigForm from './ConfigForm'
import Terminal from '../Terminal'
import NodeInfo from '../NodeInfo'

const { geth } = Mist

const capitalizeStr = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

class GethConfig extends Component {
  state = {
    downloadError: null
  }

  renderErrors() {
    const { downloadError } = this.state
    const { client } = this.props
    const { error } = client

    const errorMessage = (error && error.toString()) || downloadError

    if (!errorMessage) {
      return null
    }

    return <StyledError>{errorMessage}</StyledError>
  }

  render() {
    const { client } = this.props
    const {
      network,
      syncMode,
      blockNumber,
      timestamp,
      sync,
      peerCount,
      state
    } = client
    const { highestBlock, currentBlock, startingBlock } = sync

    const capitalizedState = capitalizeStr(state)

    const nodeInfoProps = {
      active: 'local',
      network,
      local: {
        syncMode,
        blockNumber,
        timestamp,
        sync: {
          highestBlock,
          currentBlock,
          startingBlock,
          connectedPeers: peerCount
        }
      },
      remote: {
        blockNumber: null,
        timestamp: null
      }
    }

    return (
      <StyledMain>
        <Typography variant="h5">Geth</Typography>
        <NodeInfo {...nodeInfoProps} />
        <Typography variant="subtitle1" gutterBottom>
          {capitalizedState}
        </Typography>
        {!!geth.getLogs().length && <StyledTerminal />}
        <VersionList />
        <ConfigForm />
      </StyledMain>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(GethConfig)

const StyledMain = styled.main`
  position: relative;
`

const StyledError = styled.div`
  padding: 10px;
  color: red;
`

const StyledTerminal = styled(Terminal)`
  margin: 20px 0;
`
