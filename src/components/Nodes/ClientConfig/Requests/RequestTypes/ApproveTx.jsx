import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { AddressInput } from 'ethereum-react-components'
import Notification from '../../../../shared/Notification'
import RequestInfo from './RequestInfo'
import RequestActions from './RequestActions'

const styles = () => ({
  formGroup: { marginBottom: 15 }
})

class ApproveListing extends Component {
  static propTypes = {
    request: PropTypes.object,
    send: PropTypes.func,
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

  handleAddressInputChange = field => value => {
    // ethereum-react-components passes `value` instead of `event`
    // TODO: fix in ethereum-react-components to be consistent with MUI TextField
    const { tx: oldTx } = this.state
    const tx = { ...oldTx, [field]: value }
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
    const { request, send } = this.props
    const { tx } = this.state
    const { id } = request
    const result = { approved, transaction: tx }
    send(null, [], id, result)
  }

  renderCallInfo() {
    const { request } = this.props
    const { call_info: callInfo } = request.params[0]
    if (!callInfo) {
      return null
    }
    const render = []
    callInfo.forEach((call, index) => {
      const thisRender = (
        <Notification key={index} type={call.type} message={call.message} />
      )
      render.push(thisRender)
    })
    return render
  }

  renderFrom() {
    const { classes } = this.props
    const { tx, edit } = this.state
    const { from } = tx
    return (
      <FormGroup classes={{ root: classes.formGroup }} row>
        <AddressInput
          label="From"
          value={from}
          onChange={this.handleAddressInputChange('from')}
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
    const { classes } = this.props
    const { tx, edit } = this.state
    const { to } = tx
    return (
      <FormGroup classes={{ root: classes.formGroup }} row>
        <AddressInput
          label="To"
          value={to}
          onChange={this.handleAddressInputChange('from')}
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
    const { classes } = this.props
    const { tx, edit } = this.state
    const { gas } = tx
    return (
      <FormGroup classes={{ root: classes.formGroup }} row>
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
    const { classes } = this.props
    const { tx, edit } = this.state
    const { gasPrice } = tx
    return (
      <FormGroup classes={{ root: classes.formGroup }} row>
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
    const { classes } = this.props
    const { tx, edit } = this.state
    const { value } = tx
    return (
      <FormGroup classes={{ root: classes.formGroup }} row>
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
    const { classes } = this.props
    const { tx, edit } = this.state
    const { nonce } = tx
    return (
      <FormGroup classes={{ root: classes.formGroup }} row>
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
    const { classes } = this.props
    const { tx, edit } = this.state
    const { data } = tx
    return (
      <FormGroup classes={{ root: classes.formGroup }} row>
        <TextField
          variant="outlined"
          label="Data"
          value={data}
          onChange={this.handleChange('data')}
          disabled={!edit.data}
          rowsMax={10}
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
        {this.renderCallInfo()}
        {this.renderFrom()}
        {this.renderTo()}
        {this.renderGas()}
        {this.renderGasPrice()}
        {this.renderValue()}
        {this.renderNonce()}
        {this.renderData()}
        <RequestActions
          approve={() => this.submit(true)}
          reject={() => this.submit(false)}
        />
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(withStyles(styles)(ApproveListing))
