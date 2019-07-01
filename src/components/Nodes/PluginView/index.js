import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import moment from 'moment'

require('codemirror/mode/javascript/javascript')

const styles = () => ({
  terminalWrapper: {
    background: '#111',
    color: '#eee',
    fontFamily:
      'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
    fontSize: '11px',
    padding: 10,

    // Fluid width and height with support to scrolling
    width: 'calc(100vw - 310px)',
    height: 'calc(100vh - 274px)',

    // Scroll config
    overflowX: 'auto',
    overflowY: 'scroll',
    whiteSpace: 'nowrap'
  }
})

class PluginView extends Component {
  static propTypes = {
    classes: PropTypes.object,
    plugin: PropTypes.object.isRequired
  }

  renderPluginMetadata = metadata => {
    const { classes } = this.props
    const {
      // name,
      // displayName,
      // repository,
      fileName,
      // commit,
      publishedDate,
      version,
      // channel,
      size,
      // tag,
      location,
      // remote,
      verificationResult
    } = metadata
    const { signers, isTrusted, isValid } = verificationResult

    return (
      <Fragment>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Author"
            defaultValue="<Unknown>" // TODO needs to be generated from signature certs
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Version"
            value={version}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Published"
            value={moment(publishedDate).format('MMMM Do YYYY')}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Signed By"
            value={signers.map(s => s.address).join(',')}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Valid Signature"
            value={isValid}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Trusted Author"
            value={isTrusted}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Size"
            value={size}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="File Name"
            value={fileName}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            id="standard-disabled"
            label="Location"
            value={location}
            className={classes.textField}
            margin="normal"
          />
        </Grid>
      </Fragment>
    )
  }

  render() {
    const { plugin } = this.props
    const { metadata } = plugin

    return (
      <div>
        {metadata && (
          <React.Fragment>
            <h3 style={{ color: 'grey' }}>Plugin Details</h3>
            <Grid container spacing={8}>
              {this.renderPluginMetadata(metadata)}
            </Grid>
          </React.Fragment>
        )}
        <h3 style={{ color: 'grey' }}>Plugin Code</h3>
        <CodeMirror
          value={plugin.source}
          options={{
            mode: 'javascript',
            theme: 'material',
            lineNumbers: true
          }}
          onChange={(editor, data, value) => {
            console.log(editor, data, value)
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles)(PluginView)
