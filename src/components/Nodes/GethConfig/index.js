import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import VersionList from './VersionList'
import ConfigForm from './ConfigForm'
import Terminal from '../Terminal'
import NodeInfo from '../NodeInfo'
import { Mist } from '../../../API'

const { geth } = Mist

const capitalizeStr = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

function TabContainer(props) {
  const { children } = props
  return (
    <Typography component="div" style={{ paddingTop: 20, paddingLeft: 10 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

class GethConfig extends Component {
  state = {
    activeTab: 0,
    downloadError: null
  }

  constructor(props) {
    super(props)
    geth.on('started', this.handleGethStarted)
  }

  handleGethStarted = () => {
    // Update activeTab to Terminal
    this.setState({ activeTab: 2 })
  }

  handleTabChange = (event, activeTab) => {
    this.setState({ activeTab })
  }

  componentDidUnmount() {
    geth.removeListener('started', this.handleGethStarted)
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
    const { activeTab } = this.state
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
        {this.renderErrors()}
        <StyledAppBar position="static">
          <Tabs
            value={activeTab}
            onChange={this.handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Version" />
            <Tab label="Settings" />
            <Tab label="Terminal" disabled={!geth.getLogs().length} />
          </Tabs>
        </StyledAppBar>
        <VisibleTab visible={activeTab === 0}>
          <TabContainer>
            <VersionList />
          </TabContainer>
        </VisibleTab>
        <VisibleTab visible={activeTab === 1}>
          <TabContainer>
            <ConfigForm />
          </TabContainer>
        </VisibleTab>
        <VisibleTab visible={activeTab === 2}>
          <TabContainer>
            <Terminal />
          </TabContainer>
        </VisibleTab>
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

const StyledAppBar = styled(AppBar)`
  margin-top: 20px;
`

const VisibleTab = styled.div`
  ${props =>
    !props.visible &&
    css`
      display: none;
    `}
`
