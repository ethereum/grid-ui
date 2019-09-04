import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'
import VersionList from './VersionList'
import DynamicConfigForm from './DynamicConfigForm'
import AboutPlugin from './AboutPlugin'
import Terminal from '../Terminal'
import NodeInfo from '../NodeInfo'
import PluginView from '../PluginView'
import {
  clearError,
  selectTab,
  setAppBadges
} from '../../../store/plugin/actions'
import Notification from '../../shared/Notification'
import ErrorBoundary from '../../GenericErrorBoundary'
import { getPluginSettingsConfig } from '../../../lib/utils'

function TabContainer(props) {
  const { children, style } = props
  return (
    <Typography
      component="div"
      className="scroll-container"
      style={{
        padding: '0 10px',
        ...style,
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: '100%',
        maxWidth: '100%'
      }}
    >
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
    pluginErrors: PropTypes.array,
    appBadges: PropTypes.object,
    selectedTab: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.getAppBadges()
  }

  componentDidUpdate(prevProps) {
    const { plugin, pluginStatus } = this.props

    // On plugin start, show Terminal
    if (prevProps.pluginStatus === 'STOPPED' && pluginStatus === 'STARTING') {
      this.handleTabChange(null, 3)
    }

    // If switching plugins, reset tab to About
    if (prevProps.plugin.name !== plugin.name) {
      this.handleTabChange(null, 0)
      this.getAppBadges()
    }
  }

  getAppBadges = () => {
    const { plugin, dispatch } = this.props
    if (plugin.api && plugin.api.getAppBadges) {
      const appBadges = plugin.api.getAppBadges()
      dispatch(setAppBadges(plugin, appBadges))
    }
  }

  handleTabChange = (event, tab) => {
    const { dispatch } = this.props
    dispatch(selectTab(tab))
    // Clear errors if going to Terminal tab
    if (tab === 3) {
      this.clearPluginErrors()
    }
  }

  handlePluginConfigChanged = (key, value) => {
    const { handlePluginConfigChanged } = this.props
    handlePluginConfigChanged(key, value)
  }

  dismissError = index => {
    const { dispatch, plugin } = this.props
    dispatch(clearError(plugin.name, index))
    this.clearPluginErrors()
  }

  clearPluginErrors = () => {
    // Clear errors in nano
    const { plugin, pluginErrors } = this.props
    if (pluginErrors.length > 0) {
      plugin.emit('clearPluginErrors')
    }
  }

  appBadgesCount() {
    const { appBadges } = this.props
    return Object.values(appBadges).reduce((a, b) => a + b, 0)
  }

  renderErrors() {
    const { pluginErrors } = this.props
    const renderErrors = []
    pluginErrors.forEach((error, index) => {
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
      selectedTab,
      pluginErrors
    } = this.props
    const { displayName: pluginName } = plugin || {}
    const isRunning = ['STARTING', 'STARTED', 'CONNECTED'].includes(
      plugin.state
    )

    return (
      <Fragment>
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
            <Tab
              label={
                <Badge color="secondary" badgeContent={this.appBadgesCount()}>
                  About
                </Badge>
              }
              data-test-id="navbar-item-about"
            />
            <Tab label="Version" data-test-id="navbar-item-version" />
            <Tab label="Settings" data-test-id="navbar-item-settings" />
            <Tab
              label={
                <Badge color="error" badgeContent={pluginErrors.length}>
                  Terminal
                </Badge>
              }
              data-test-id="navbar-item-terminal"
            />
            <Tab label="Metadata" data-test-id="navbar-item-metadata" />
          </Tabs>
        </StyledAppBar>

        <TabContainer style={{ display: selectedTab === 0 ? 'block' : 'none' }}>
          <AboutPlugin plugin={plugin} />
        </TabContainer>

        <TabContainer style={{ display: selectedTab === 1 ? 'block' : 'none' }}>
          <VersionList
            plugin={plugin}
            handleReleaseSelect={handleReleaseSelect}
          />
        </TabContainer>
        {/* NOTE: MUI requires generating the ConfigForm from state each render */}
        {selectedTab === 2 && (
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
        <TabContainer style={{ display: selectedTab === 3 ? 'block' : 'none' }}>
          <Terminal plugin={plugin} />
        </TabContainer>
        {selectedTab === 4 && (
          <TabContainer>
            <PluginView plugin={plugin} />
          </TabContainer>
        )}
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { selected } = state.plugin

  return {
    pluginStatus: state.plugin[selected].active.status,
    pluginErrors: state.plugin[selected].errors,
    appBadges: state.plugin[selected].appBadges,
    isActivePlugin: state.plugin[selected].active.name !== 'STOPPED',
    selectedTab: state.plugin.selectedTab
  }
}

export default connect(mapStateToProps)(PluginConfig)

const StyledAppBar = styled(AppBar)`
  margin: 20px 0;
`

const StyledState = styled.div`
  opacity: 0.25;
  font-size: 13px;
  font-weight: bold;
`
