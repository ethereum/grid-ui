import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ArrowIcon from '@material-ui/icons/ArrowForward'
import BuildIcon from '@material-ui/icons/Build'

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
}

class CustomizedInputBase extends React.Component {
  static propTypes = {
    onOpenDevTools: PropTypes.func,
    onNavigate: PropTypes.func.isRequired
  }

  state = {
    currentUrl: 'http://localhost:3000/'
  }

  handleUrlChange = event => {
    this.setState({ currentUrl: event.target.value })
  }

  handleKeyDown = e => {
    const { currentUrl } = this.state
    const { onNavigate } = this.props
    if (e.key === 'Enter') {
      onNavigate(currentUrl)
    }
  }

  navigate = newUrl => {
    const { onNavigate } = this.props
    this.setState({
      currentUrl: newUrl
    })
    onNavigate(newUrl)
  }

  render() {
    const { classes, onNavigate, onOpenDevTools } = this.props
    const { currentUrl } = this.state
    return (
      <Paper className={classes.root} elevation={1}>
        <InputBase
          className={classes.input}
          placeholder="enter url"
          value={currentUrl}
          name="currentUrl"
          onChange={this.handleUrlChange}
          onKeyDown={this.handleKeyDown}
        />
        <Divider className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="navigate"
          onClick={() => onNavigate(currentUrl)}
        >
          <ArrowIcon />
        </IconButton>
        <Divider className={classes.divider} />
        <Button
          onClick={() =>
            this.navigate('package://github.com/ethereum/remix-ide')
          }
        >
          Remix IDE
        </Button>
        <Divider className={classes.divider} />
        <IconButton onClick={() => onOpenDevTools()}>
          <BuildIcon />
        </IconButton>
      </Paper>
    )
  }
}

CustomizedInputBase.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CustomizedInputBase)
