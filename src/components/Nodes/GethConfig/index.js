import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ErrorIcon from '@material-ui/icons/Error'
import CloseIcon from '@material-ui/icons/Close'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import VersionList from './VersionList'
import ConfigForm from './ConfigForm'
import Terminal from '../Terminal'
import NodeInfo from '../NodeInfo'
import { Mist } from '../../../API'
import { clearError } from '../../../store/client/actions'

const { geth } = Mist

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    verticalAlign: 'middle',
    marginBottom: 1
  },
  errorIcon: {
    marginRight: theme.spacing.unit
  },
  closeIcon: {
    opacity: 0.9
  }
})

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

class GethConfig extends Component {
  state = {
    activeTab: 0,
    downloadError: null
  }

  propTypes = {
    classes: PropTypes.object,
    client: PropTypes.object,
    dispatch: PropTypes.function
  }

  constructor(props) {
    super(props)
    geth.on('started', this.handleGethStarted)
  }

  componentWillUnmount() {
    geth.removeListener('started', this.handleGethStarted)
  }

  handleTabChange = (event, activeTab) => {
    this.setState({ activeTab })
  }

  handleGethStarted = () => {
    // Update activeTab to Terminal
    this.setState({ activeTab: 2 })
  }

  onCloseError = () => {
    const { dispatch } = this.props
    dispatch(clearError())
  }

  renderErrors() {
    const { downloadError } = this.state
    const { classes, client } = this.props
    const { error } = client

    const errorMessage = (error && error.toString()) || downloadError

    if (!errorMessage) {
      return null
    }

    return (
      <SnackbarContent
        classes={{ root: classes.error }}
        message={
          <span>
            <ErrorIcon
              classes={{ root: classNames(classes.icon, classes.errorIcon) }}
            />
            {errorMessage}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.onCloseError}
          >
            <CloseIcon
              classes={{ root: classNames(classes.icon, classes.closeIcon) }}
            />
          </IconButton>
        ]}
      />
    )
  }

  render() {
    const { client } = this.props
    const { activeTab } = this.state
    const { state } = client

    return (
      <StyledMain>
        <Typography variant="h5">Geth</Typography>
        <NodeInfo />
        <Typography variant="subtitle1" gutterBottom>
          <StyledState>{state}</StyledState>
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
        <TabContainer style={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <div>
            <VersionList />
          </div>
        </TabContainer>
        <TabContainer style={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Terminal />
        </TabContainer>
        {activeTab === 1 && (
          <TabContainer>
            <ConfigForm />
          </TabContainer>
        )}
      </StyledMain>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(withStyles(styles)(GethConfig))

const StyledMain = styled.main`
  position: relative;
  min-width: 500px;
`

const StyledAppBar = styled(AppBar)`
  margin: 20px 0;
`

const StyledState = styled.div`
  color: rgba(0, 0, 0, 0.25);
  font-size: 13px;
  font-weight: bold;
`
