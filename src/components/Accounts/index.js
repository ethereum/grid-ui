import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Switch from '@material-ui/core/Switch'
import CircularProgress from '@material-ui/core/CircularProgress'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import ConfigForm from './ConfigForm'
import RequestQueue from './RequestQueue'
import Terminal from '../shared/Terminal'
import { Grid } from '../../API'
import { clearError, clearNotification } from '../../store/signer/actions'
import Notification from '../shared/Notification'
import Clef from '../../store/signer/clefService'

const { clef } = Grid

const styles = () => ({
  status: {},
  statusIconDot: {
    verticalAlign: 'middle',
    color: 'red'
  },
  isRunning: {
    color: 'green'
  },
  appBar: {
    marginTop: 20,
    marginBottom: 20
  },
  downloadProgress: {
    marginTop: 15
  },
  progress: {
    marginRight: 5
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

class Accounts extends Component {
  static propTypes = {
    signer: PropTypes.object,
    classes: PropTypes.object,
    dispatch: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0,
      downloadProgress: null,
      release: null
    }
    clef.on('started', this.handleClefStarted)
    this.setClefRelease()
  }

  componentWillUnmount() {
    clef.removeListener('started', this.handleClefStarted)
  }

  setClefRelease = () => {
    const release = clef.getRelease()
    this.setState({ release })
  }

  handleClefStarted = () => {
    // Set release
    this.setClefRelease()
  }

  handleTabChange = (event, activeTab) => {
    this.setState({ activeTab })
  }

  onDismissError = () => {
    const { dispatch } = this.props
    dispatch(clearError())
  }

  clearNotification = index => {
    const { dispatch } = this.props
    dispatch(clearNotification(index))
  }

  clefIsRunning() {
    const { signer } = this.props
    const { state } = signer
    return Clef.isRunning(state)
  }

  handleStartStop() {
    const { dispatch } = this.props
    if (this.clefIsRunning()) {
      Clef.stop(dispatch)
    } else {
      Clef.start(dispatch)
    }
  }

  renderErrors() {
    const { signer } = this.props
    const { error } = signer

    const errorMessage = error && error.toString()

    if (!errorMessage) {
      return null
    }

    return (
      <Notification
        type="error"
        message={errorMessage}
        onDismiss={this.onDismissError}
      />
    )
  }

  renderStartStop() {
    return (
      <Button
        onClick={() => {
          this.handleStartStop()
        }}
      >
        {this.clefIsRunning() ? 'Stop' : 'Start'}
      </Button>
    )
  }

  renderStatus() {
    const { classes, signer } = this.props
    const { state } = signer
    const dotClasses = Clef.isRunning(state)
      ? classNames(classes.statusIconDot, classes.isRunning)
      : classes.statusIconDot

    return (
      <span>
        <Typography component="h5" classes={{ root: classes.status }}>
          <FiberManualRecordIcon classes={{ root: dotClasses }} />
          {state}
        </Typography>
      </span>
    )
  }

  renderDownloadProgress() {
    const { classes } = this.props
    const { downloadProgress } = this.state
    const onProgress = progress => {
      this.setState({ downloadProgress: progress })
    }
    clef.on('downloadProgress', onProgress)
    if (downloadProgress === 100) {
      this.setState({ downloadProgress: null })
    }
    if (downloadProgress) {
      return (
        <Typography component="h4" classes={{ root: classes.downloadProgress }}>
          <CircularProgress size={14} classes={{ root: classes.progress }} />{' '}
          Downloading Clef: {downloadProgress}%
        </Typography>
      )
    }
    return null
  }

  renderSwitch() {
    const { downloadProgress } = this.state
    return (
      <Switch
        color="primary"
        onChange={() => this.handleStartStop()}
        checked={this.clefIsRunning()}
        disabled={!!downloadProgress}
      />
    )
  }

  renderNotifications() {
    const { signer } = this.props
    const { notifications } = signer
    const renderNotifications = []
    notifications.forEach((notification, index) => {
      renderNotifications.push(
        <Notification
          key={index}
          type={notification.type}
          message={notification.text}
          onDismiss={() => {
            this.clearNotification(index)
          }}
        />
      )
    })
    return renderNotifications
  }

  renderButtons() {
    const { signer } = this.props
    const { state, accounts, config } = signer

    if (!Clef.isRunning(state)) {
      return null
    }

    let id = 0
    const jsonrpc = '2.0'
    const params = []

    const send = message => {
      Clef.sendSigner(message, config)
      id += 1
    }

    const sendList = () => {
      send({
        id,
        jsonrpc,
        method: 'account_list',
        params
      })
    }

    const newAccount = () => {
      send({
        id,
        jsonrpc,
        method: 'account_new',
        params
      })
    }

    const signData = () => {
      send({
        id,
        jsonrpc,
        method: 'account_signData',
        params: [
          'text/plain',
          '0x00a839de7922491683f547a67795204763ff8237',
          '0xdeadbeef'
        ]
      })
    }

    const signTx = () => {
      send({
        id,
        jsonrpc,
        method: 'account_signTransaction',
        params: [
          {
            from: '0x00a839de7922491683f547a67795204763ff8237',
            gas: '0x333',
            gasPrice: '0x123',
            nonce: '0x0',
            to: '0x07a565b7ed7d7a678680a4c162885bedbb695fe0',
            value: '0x10',
            data:
              '0x4401a6e40000000000000000000000000000000000000000000000000000000000000012'
          }
        ]
      })
    }

    return (
      <div>
        <Button
          onClick={() => {
            sendList()
          }}
        >
          {' '}
          List Accounts{' '}
        </Button>{' '}
        <Button
          onClick={() => {
            newAccount()
          }}
        >
          {' '}
          New Account{' '}
        </Button>{' '}
        <Button
          onClick={() => {
            signData()
          }}
        >
          Sign Data
        </Button>
        <Button
          onClick={() => {
            signTx()
          }}
        >
          Sign Tx
        </Button>
      </div>
    )
  }

  render() {
    const { classes } = this.props
    const { activeTab, release } = this.state

    return (
      <div>
        {this.renderStatus()}
        {this.renderDownloadProgress()}
        {this.renderSwitch()}
        {this.renderErrors()}
        {this.renderNotifications()}
        {this.renderButtons()}
        <AppBar position="static" classes={{ root: classes.appBar }}>
          <Tabs
            value={activeTab}
            onChange={this.handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Actions" />
            <Tab label="Settings" />
            <Tab label="Terminal" disabled={!clef.getLogs().length} />
          </Tabs>
        </AppBar>
        {activeTab === 0 && (
          <TabContainer>
            <RequestQueue />
          </TabContainer>
        )}
        {activeTab === 1 && (
          <TabContainer>
            <ConfigForm release={release} />
          </TabContainer>
        )}
        <TabContainer style={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Terminal type="clef" />
        </TabContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    signer: state.signer
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Accounts))
