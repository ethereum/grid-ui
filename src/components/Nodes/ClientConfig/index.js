import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import VersionList from './VersionList'
import DynamicConfigForm from './DynamicConfigForm'
import Terminal from '../Terminal'
// import NodeInfo from '../NodeInfo'
import { clearError } from '../../../store/client/actions'
import Notification from '../../shared/Notification'
import Requests from './Requests'
import Notifications from './Requests/Notifications'

function TabContainer(props) {
  const { children, style } = props
  return (
    <Typography component="div" style={{ padding: '0 10px', ...style }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object
}

class ClientConfig extends Component {
  static propTypes = {
    client: PropTypes.object,
    clientConfigChanged: PropTypes.func,
    clientStatus: PropTypes.string,
    dispatch: PropTypes.func,
    isActiveClient: PropTypes.bool,
    handleReleaseSelect: PropTypes.func,
    handleClientConfigChanged: PropTypes.func,
    requestsQueue: PropTypes.array,
    clientError: PropTypes.string
  }

  state = {
    activeTab: 0,
    downloadError: null
  }

  componentDidUpdate(prevProps) {
    const { client, clientStatus } = this.props

    // On client start, show Terminal
    if (prevProps.clientStatus === 'STOPPED' && clientStatus !== 'STOPPED') {
      this.handleTabChange(null, 2)
    }

    // If switching clients, reset tab to VersionList
    if (prevProps.client.name !== client.name) {
      this.handleTabChange(null, 0)
    }
  }

  badgeContent = client => {
    const { requestsQueue } = this.props
    const requests = requestsQueue.filter(r => r.client === client.name)
    return requests.length.toString()
  }

  handleTabChange = (event, activeTab) => {
    this.setState({ activeTab })
  }

  handleClientConfigChanged = (key, value) => {
    const { handleClientConfigChanged } = this.props
    handleClientConfigChanged(key, value)
  }

  onDismissClientError = () => {
    const { dispatch, client } = this.props
    dispatch(clearError(client.name))
  }

  onDismissDownloadError = () => {
    this.setState({ downloadError: null })
  }

  getClientSettings = client => {
    return ((client.plugin || {}).config || {}).settings
  }

  renderPluginNotifications() {
    const { client } = this.props
    return <Notifications clientName={client.name} />
  }

  renderErrors() {
    const { downloadError } = this.state
    const { clientError } = this.props

    const renderErrors = []

    if (clientError) {
      renderErrors.push(
        <Notification
          key={1}
          type="error"
          message={clientError}
          onDismiss={this.onDismissClientError}
        />
      )
    }

    if (downloadError) {
      renderErrors.push(
        <Notification
          key={2}
          type="error"
          message={downloadError}
          onDismiss={this.onDismissDownloadError}
        />
      )
    }

    return renderErrors
  }

  render() {
    const {
      client,
      clientConfigChanged,
      clientStatus,
      isActiveClient,
      handleReleaseSelect
    } = this.props
    const { activeTab } = this.state
    const { displayName } = client || {}
    const isRunning = ['STARTING', 'STARTED', 'CONNECTED'].includes(
      client.state
    )
    const settings = this.getClientSettings(client)
    const clientHasRequestFunctionality = client.plugin.config.requestMethods

    return (
      <StyledMain>
        <Typography variant="h5">
          {displayName}
          {/* <NodeInfo /> */}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <StyledState data-test-id="node-state">
            {isActiveClient ? clientStatus : 'STOPPED'}
          </StyledState>
        </Typography>
        {this.renderErrors()}
        {this.renderPluginNotifications()}
        <AppBar style={{ marginTop: 15, marginBottom: 15 }} position="static">
          <Tabs
            value={activeTab}
            onChange={this.handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Version" />
            <Tab label="Settings" />
            <Tab label="Terminal" />
            <Tab
              style={{
                display: clientHasRequestFunctionality ? 'block' : 'none'
              }}
              label=<Badge
                badgeContent={this.badgeContent(client)}
                color="primary"
              >
                Requests
              </Badge>
            />
          </Tabs>
        </AppBar>
        <TabContainer style={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <VersionList
            client={client}
            handleReleaseSelect={handleReleaseSelect}
          />
        </TabContainer>
        {activeTab === 1 && (
          <TabContainer>
            <DynamicConfigForm
              clientName={client.name}
              settings={settings}
              handleClientConfigChanged={this.handleClientConfigChanged}
              isClientRunning={isRunning}
              clientConfigChanged={clientConfigChanged}
            />
          </TabContainer>
        )}
        <TabContainer style={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Terminal client={client} />
        </TabContainer>
        {activeTab === 3 && (
          <div
            style={{
              display: clientHasRequestFunctionality ? 'block' : 'none'
            }}
          >
            <Requests clientName={client.name} />
          </div>
        )}
      </StyledMain>
    )
  }
}

function mapStateToProps(state) {
  const selectedClient = state.client.selected

  return {
    clientStatus: state.client[selectedClient].active.status,
    clientError: state.client[selectedClient].error,
    isActiveClient: state.client[selectedClient].active.name !== 'STOPPED',
    requestsQueue: state.requests.queue
  }
}

export default connect(mapStateToProps)(ClientConfig)

const StyledMain = styled.main`
  position: relative;
  min-width: 500px;
`

const StyledState = styled.div`
  color: rgba(0, 0, 0, 0.25);
  font-size: 13px;
  font-weight: bold;
`
