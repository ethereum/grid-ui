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
import NodeInfo from '../NodeInfo'
import PluginView from '../PluginView'
import { clearError, selectTab } from '../../../store/plugin/actions'
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

class PluginConfig extends Component {
  static propTypes = {
    plugin: PropTypes.object,
    pluginConfigChanged: PropTypes.func,
    pluginStatus: PropTypes.string,
    dispatch: PropTypes.func,
    isActivePlugin: PropTypes.bool,
    handleReleaseSelect: PropTypes.func,
    handlePluginConfigChanged: PropTypes.func,
    errors: PropTypes.array,
    selectedTab: PropTypes.number
  }

  componentDidUpdate(prevProps) {
    const { plugin, pluginStatus } = this.props

    // On plugin start, show Terminal
    if (prevProps.pluginStatus === 'STOPPED' && pluginStatus !== 'STOPPED') {
      this.handleTabChange(null, 2)
    }

    // If switching plugins, reset tab to VersionList
    if (prevProps.plugin.name !== plugin.name) {
      this.handleTabChange(null, 0)
    }
  }

  handleTabChange = (event, tab) => {
    const { dispatch } = this.props
    dispatch(selectTab(tab))
  }

  handlePluginConfigChanged = (key, value) => {
    const { handlePluginConfigChanged } = this.props
    handlePluginConfigChanged(key, value)
  }

  dismissError = index => {
    const { dispatch, plugin } = this.props
    dispatch(clearError(plugin.name, index))
  }

  renderErrors() {
    const { errors } = this.props
    const renderErrors = []
    errors.forEach((error, index) => {
      const renderError = (
        <Notification
          key={index}
          type="error"
          message={error}
          onDismiss={() => {
            this.dismissError(index)
          }}
        />
      )
      renderErrors.push(renderError)
    })

    return renderErrors
  }

  render() {
    const {
      plugin,
      pluginConfigChanged,
      pluginStatus,
      isActivePlugin,
      handleReleaseSelect,
      selectedTab
    } = this.props
    const { displayName: pluginName } = plugin || {}
    const isRunning = ['STARTING', 'STARTED', 'CONNECTED'].includes(
      plugin.state
    )

    return (
      <StyledMain>
        <Typography variant="h5">
          {pluginName}
          {plugin.type === 'client' && <NodeInfo />}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <StyledState data-test-id="node-state">
            {isActivePlugin ? pluginStatus : 'STOPPED'}
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
            plugin={plugin}
            handleReleaseSelect={handleReleaseSelect}
          />
        </TabContainer>

        {/* NOTE: MUI requires generating the ConfigForm from state each render */}
        {selectedTab === 1 && (
          <TabContainer>
            <ErrorBoundary>
              <DynamicConfigForm
                pluginName={plugin.name}
                settings={getPluginSettingsConfig(plugin)}
                handlePluginConfigChanged={this.handlePluginConfigChanged}
                isPluginRunning={isRunning}
                pluginConfigChanged={pluginConfigChanged}
              />
            </ErrorBoundary>
          </TabContainer>
        )}

        <TabContainer style={{ display: selectedTab === 2 ? 'block' : 'none' }}>
          <Terminal plugin={plugin} />
        </TabContainer>

        {selectedTab === 3 && (
          <TabContainer>
            <PluginView plugin={plugin} />
          </TabContainer>
        )}
      </StyledMain>
    )
  }
}

function mapStateToProps(state) {
  const selectedPlugin = state.plugin.selected

  return {
    pluginStatus: state.plugin[selectedPlugin].active.status,
    errors: state.plugin[selectedPlugin].errors,
    isActivePlugin: state.plugin[selectedPlugin].active.name !== 'STOPPED',
    selectedTab: state.plugin.selectedTab
  }
}

export default connect(mapStateToProps)(PluginConfig)

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
