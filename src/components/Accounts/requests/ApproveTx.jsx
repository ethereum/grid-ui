import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Clef from '../../../store/signer/clefService'
import RequestInfo from './RequestInfo'

const styles = () => ({
  controls: { marginTop: 15 },
  approve: { backgroundColor: 'green' },
  reject: { backgroundColor: 'red', marginRight: 10 }
})

class ApproveListing extends Component {
  static propTypes = {
    request: PropTypes.object,
    dispatch: PropTypes.func,
    classes: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { request } = this.props
    const { transaction: tx } = request.params[0]
    this.state = {
      tx,
      edit: {
        from: false,
        to: false,
        gas: false,
        gasPrice: false,
        value: false,
        nonce: false,
        data: false
      }
    }
  }

  handleChange = field => event => {
    const { tx: oldTx } = this.state
    const tx = { ...oldTx, [field]: event.target.value }
    this.setState({ tx })
  }

  toggleEdit = field => event => {
    const { edit: oldEdit } = this.state
    const edit = { ...oldEdit, [field]: event.target.checked }
    this.setState({ edit })
    if (!event.target.checked) {
      // Restore original value from request
      const { request } = this.props
      const { transaction } = request.params[0]
      const { tx: oldTx } = this.state
      const tx = { ...oldTx, [field]: transaction[field] }
      this.setState({ tx })
    }
  }

  submit(approved) {
    const { request, dispatch } = this.props
    const { tx } = this.state
    const { id } = request
    const result = { approved, transaction: tx }
    const message = { id, result }
    Clef.sendClef(message, dispatch)
  }

  renderControls() {
    const { classes } = this.props
    return (
      <div classes={{ root: classes.controls }}>
        <Button
          onClick={() => {
            this.submit(false)
          }}
          classes={{ root: classes.reject }}
        >
          Reject
        </Button>
        <Button
          onClick={() => {
            this.submit(true)
          }}
          classes={{ root: classes.approve }}
        >
          Approve
        </Button>
      </div>
    )
  }

  renderFrom() {
    const { tx, edit } = this.state
    const { from } = tx
    return (
      <FormGroup row>
        <TextField
          variant="outlined"
          label="From"
          value={from}
          onChange={this.handleChange('from')}
          disabled={!edit.from}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.from}
              onChange={this.toggleEdit('from')}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }

  renderTo() {
    const { tx, edit } = this.state
    const { to } = tx
    return (
      <FormGroup row>
        <TextField
          variant="outlined"
          label="To"
          value={to}
          onChange={this.handleChange('from')}
          disabled={!edit.to}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.to}
              onChange={this.toggleEdit('to')}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }

  renderGas() {
    const { tx, edit } = this.state
    const { gas } = tx
    return (
      <FormGroup row>
        <TextField
          variant="outlined"
          label="Gas"
          value={gas}
          onChange={this.handleChange('gas')}
          disabled={!edit.gas}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.gas}
              onChange={this.toggleEdit('gas')}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }

  renderGasPrice() {
    const { tx, edit } = this.state
    const { gasPrice } = tx
    return (
      <FormGroup row>
        <TextField
          variant="outlined"
          label="Gas Price"
          value={gasPrice}
          onChange={this.handleChange('gasPrice')}
          disabled={!edit.gasPrice}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.gasPrice}
              onChange={this.toggleEdit('gasPrice')}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }

  renderValue() {
    const { tx, edit } = this.state
    const { value } = tx
    return (
      <FormGroup row>
        <TextField
          variant="outlined"
          label="Value"
          value={value}
          onChange={this.handleChange('value')}
          disabled={!edit.value}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.value}
              onChange={this.toggleEdit('value')}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }

  renderNonce() {
    const { tx, edit } = this.state
    const { nonce } = tx
    return (
      <FormGroup row>
        <TextField
          variant="outlined"
          label="Nonce"
          value={nonce}
          onChange={this.handleChange('nonce')}
          disabled={!edit.nonce}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.nonce}
              onChange={this.toggleEdit('nonce')}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }

  renderData() {
    const { tx, edit } = this.state
    const { data } = tx
    return (
      <FormGroup row>
        <TextField
          variant="outlined"
          label="Data"
          value={data}
          onChange={this.handleChange('data')}
          disabled={!edit.data}
          multiline
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.data}
              onChange={this.toggleEdit('data')}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }

  render() {
    const { request } = this.props
    return (
      <div>
        <Typography variant="h2">Approve Transaction</Typography>
        <RequestInfo request={request} />
        {this.renderFrom()}
        {this.renderTo()}
        {this.renderGas()}
        {this.renderGasPrice()}
        {this.renderValue()}
        {this.renderNonce()}
        {this.renderData()}
        {this.renderControls()}
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(withStyles(styles)(ApproveListing))
