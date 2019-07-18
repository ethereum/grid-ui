import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import VersionList from './VersionList'
import DynamicConfigForm from './DynamicConfigForm'
import Terminal from '../Terminal'
// import NodeInfo from '../NodeInfo'
import PluginView from '../PluginView'
import { clearError, selectTab } from '../../../store/client/actions'
import Notification from '../../shared/Notification'
import ErrorBoundary from '../../GenericErrorBoundary'
import { getPluginSettingsConfig } from '../../../lib/utils'

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
    clientError: PropTypes.string,
    selectedTab: PropTypes.number
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

  handleTabChange = (event, tab) => {
    const { dispatch } = this.props
    dispatch(selectTab(tab))
  }

  handleClientConfigChanged = (key, value) => {
    const { handleClientConfigChanged } = this.props
    handleClientConfigChanged(key, value)
  }

  dismissClientError = () => {
    const { dispatch, client } = this.props
    dispatch(clearError(client.name))
  }

  renderErrors() {
    const { clientError } = this.props
    if (clientError) {
      return (
        <Notification
          type="error"
          message={clientError}
          onDismiss={this.dismissClientError}
        />
      )
    }
    return null
  }

  render() {
    const {
      client,
      clientConfigChanged,
      clientStatus,
      isActiveClient,
      handleReleaseSelect,
      selectedTab
    } = this.props
    const { displayName: clientName } = client || {}
    const isRunning = ['STARTING', 'STARTED', 'CONNECTED'].includes(
      client.state
    )

    return (
      <StyledMain>
        <Typography variant="h5">
          {clientName}
          {/* clientName === 'Geth' && <NodeInfo /> */}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <StyledState data-test-id="node-state">
            {isActiveClient ? clientStatus : 'STOPPED'}
          </StyledState>
        </Typography>
        {this.renderErrors()}
        <StyledAppBar position="static">
          <Tabs
            value={selectedTab}
            onChange={this.handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Version" data-test-id="navbar-item-version" />
            <Tab label="Settings" data-test-id="navbar-item-settings" />
            <Tab label="Terminal" data-test-id="navbar-item-terminal" />
            <Tab label="Details" data-test-id="navbar-item-terminal" />
          </Tabs>
        </StyledAppBar>

        <TabContainer style={{ display: selectedTab === 0 ? 'block' : 'none' }}>
          <VersionList
            client={client}
            handleReleaseSelect={handleReleaseSelect}
          />
        </TabContainer>

        {/* NOTE: MUI requires generating the ConfigForm from state each render */}
        {selectedTab === 1 && (
          <TabContainer>
            <ErrorBoundary>
              <DynamicConfigForm
                clientName={client.name}
                settings={getPluginSettingsConfig(client)}
                handleClientConfigChanged={this.handleClientConfigChanged}
                isClientRunning={isRunning}
                clientConfigChanged={clientConfigChanged}
              />
            </ErrorBoundary>
          </TabContainer>
        )}

        <TabContainer style={{ display: selectedTab === 2 ? 'block' : 'none' }}>
          <Terminal client={client} />
        </TabContainer>

        {selectedTab === 3 && (
          <TabContainer>
            <PluginView plugin={client} />
          </TabContainer>
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
    selectedTab: state.client.selectedTab
  }
}

export default connect(mapStateToProps)(ClientConfig)

const StyledMain = styled.main`
  position: relative;
  min-width: 500px;
`

const StyledAppBar = styled(AppBar)`
  margin: 20px 0;
`

const StyledState = styled.div`
  opacity: 0.25;
  font-size: 13px;
  font-weight: bold;
`
