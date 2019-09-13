import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withSnackbar } from 'notistack'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Button from '@material-ui/core/Button'
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
  setAppBadges,
  getPluginErrors
} from '../../../store/plugin/actions'

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
    selectedTab: PropTypes.number,
    enqueueSnackbar: PropTypes.func,
    closeSnackbar: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      displayedErrors: {},
      setupState: null
    }
    this.getAppBadges()
    this.enqueueErrors()
    const { plugin } = this.props
    this.subscribeSetupEvent(plugin)
  }

  componentDidUpdate(prevProps) {
    const { plugin, pluginStatus } = this.props

    // On plugin start, show Terminal
    if (prevProps.pluginStatus === 'STOPPED' && pluginStatus === 'STARTING') {
      this.handleTabChange(null, 3)
    }

    // If switching plugins:
    // 1. Reset tab to About
    // 2. Get app badges
    // 3. Subscribe to setup-event
    if (prevProps.plugin.name !== plugin.name) {
      this.handleTabChange(null, 0)
      this.getAppBadges()
      this.subscribeSetupEvent(prevProps.plugin, false)
      this.subscribeSetupEvent(plugin, true)
    }

    this.enqueueErrors()
  }

  componentWillUnmount() {
    const { plugin } = this.props
    this.subscribeSetupEvent(plugin, false)
  }

  subscribeSetupEvent = (plugin, subscribe = true) => {
    const { setupState } = this.state
    if (subscribe) {
      plugin.on('setup-event', this.setupHandler)
    } else {
      plugin.off('setup-event', this.setupHandler)
      // Reset setupState after 500ms
      if (setupState) {
        setTimeout(() => {
          this.setState({ setupState: null })
        }, 500)
      }
    }
  }

  setupHandler = event => {
    const { type } = event
    // let user know that a long running operation will be started
    if (type === 'fetch-release') {
      this.setState({ setupState: 'Fetching release' })
    }
    if (type === 'download-progress') {
      const { downloadProgress } = event
      this.setState({ setupState: `Downloading ${downloadProgress}%` })
    }
    if (type === 'extraction-progress') {
      const { extractionProgress } = event
      if (extractionProgress < 100) {
        this.setState({ setupState: `Extracting ${extractionProgress}%` })
      } else {
        this.setState({ setupState: null })
      }
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
  }

  handlePluginConfigChanged = (key, value) => {
    const { handlePluginConfigChanged } = this.props
    handlePluginConfigChanged(key, value)
  }

  dismissError = index => {
    const { dispatch, plugin } = this.props
    dispatch(clearError(plugin, index))
  }

  appBadgesCount() {
    const { appBadges } = this.props
    return Object.values(appBadges).reduce((a, b) => a + b, 0)
  }

  enqueueErrors() {
    const { displayedErrors } = this.state
    const {
      pluginErrors,
      plugin,
      enqueueSnackbar,
      dispatch,
      closeSnackbar
    } = this.props

    const onClose = (thisPlugin, key) => {
      dispatch(clearError(thisPlugin, key))
      delete displayedErrors[key]
    }

    dispatch(getPluginErrors(plugin))
    pluginErrors.forEach(error => {
      if (displayedErrors[error.key]) return
      enqueueSnackbar(error.message, {
        key: error.key,
        variant: 'error',
        onClose: (event, reason, key) => {
          onClose(plugin, key)
        },
        action: key => (
          <Fragment>
            <Button
              style={{ color: '#000' }}
              onClick={() => {
                closeSnackbar(key)
                onClose(plugin, key)
              }}
            >
              {'Dismiss'}
            </Button>
          </Fragment>
        )
      })
      displayedErrors[error.key] = true
    })
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
    const { setupState } = this.state
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
          {setupState && (
            <StyledSetupState data-test-id="node-setup-state">
              {setupState}
            </StyledSetupState>
          )}
          <StyledState data-test-id="node-state">
            {isActivePlugin ? pluginStatus : 'STOPPED'}
          </StyledState>
        </Typography>
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

export default connect(mapStateToProps)(withSnackbar(PluginConfig))

const StyledAppBar = styled(AppBar)`
  margin: 20px 0;
`

const StyledState = styled.div`
  opacity: 0.25;
  font-size: 13px;
  font-weight: bold;
`

const StyledSetupState = styled.div`
  opacity: 0.5;
  font-size: 15px;
  font-weight: bold;
  margin: 5px 0;
`
