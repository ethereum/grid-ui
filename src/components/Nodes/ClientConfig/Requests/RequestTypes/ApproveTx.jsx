import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { AddressInput } from 'ethereum-react-components'
import web3 from 'web3'
import Notification from '../../../../shared/Notification'
import RequestInfo from './RequestInfo'
import RequestActions from './RequestActions'
import { ethValidators, validateTx } from '../../../../../lib/validators'

const styles = () => ({
  formGroup: {}
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

  validateField = field => {
    const { tx } = this.state
    const isRequired = value => {
      return value ? null : 'Required.'
    }
    const isHex = value => {
      return ethValidators.isHex(value) ? null : 'Not valid hex.'
    }
    const isAddress = value => {
      return ethValidators.isAddr(value) ? null : 'Not an ethereum address.'
    }
    const isChecksummed = value => {
      return ethValidators.isChecksummed(value) ? null : 'Incorrect checksum.'
    }
    let validators = []
    switch (field) {
      case 'from': {
        const value = tx.from
        validators = [
          isRequired(value),
          isHex(value),
          isAddress(value),
          isChecksummed(value)
        ]
        break
      }
      case 'to': {
        const value = tx.to
        validators = [isHex(value), isAddress(value), isChecksummed(value)]
        break
      }
      case 'value': {
        const { value } = tx
        validators = [isRequired(value), isHex(value)]
        break
      }
      case 'gas': {
        const value = tx.gas
        validators = [isRequired(value), isHex(value)]
        break
      }
      case 'gasPrice': {
        const value = tx.gasPrice
        validators = [isRequired(value), isHex(value)]
        break
      }
      case 'nonce': {
        const value = tx.nonce
        validators = [isRequired(value), isHex(value)]
        break
      }
      case 'data': {
        const value = tx.data
        validators = [isHex(value)]
        break
      }
      default:
        break
    }
    return validators.find(v => v != null) || null
  }

  hexHelperText = field => {
    const { tx } = this.state
    let output
    switch (field) {
      case 'gas': {
        const value = tx.gas
        output = web3.utils.hexToNumberString(value)
        break
      }
      case 'gasPrice': {
        const value = tx.gasPrice
        output = web3.utils.hexToNumberString(value)
        break
      }
      case 'nonce': {
        const value = tx.nonce
        output = web3.utils.hexToNumberString(value)
        break
      }
      case 'value': {
        const { value } = tx
        output = web3.utils.hexToNumberString(value)
        break
      }
      default:
        break
    }

    return `Value: ${output}`
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

  isTxValid = () => {
    const { tx } = this.state
    return validateTx(tx).length === 0
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
          error={!!this.validateField('from')}
          helperText={this.validateField('from')}
          onChange={this.handleAddressInputChange('from')}
          disabled={!edit.from}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.from}
              onChange={this.toggleEdit('from')}
              style={{ marginLeft: 10 }}
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
          error={!!this.validateField('to')}
          helperText={this.validateField('to')}
          onChange={this.handleAddressInputChange('to')}
          disabled={!edit.to}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.to}
              onChange={this.toggleEdit('to')}
              style={{ marginLeft: 10 }}
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
          error={!!this.validateField('gas')}
          helperText={this.validateField('gas') || this.hexHelperText('gas')}
          onChange={this.handleChange('gas')}
          disabled={!edit.gas}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.gas}
              onChange={this.toggleEdit('gas')}
              style={{ marginLeft: 10 }}
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
          error={!!this.validateField('gasPrice')}
          helperText={
            this.validateField('gasPrice') || this.hexHelperText('gasPrice')
          }
          onChange={this.handleChange('gasPrice')}
          disabled={!edit.gasPrice}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.gasPrice}
              onChange={this.toggleEdit('gasPrice')}
              style={{ marginLeft: 10 }}
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
          error={!!this.validateField('value')}
          helperText={
            this.validateField('value') || this.hexHelperText('value')
          }
          onChange={this.handleChange('value')}
          disabled={!edit.value}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.value}
              onChange={this.toggleEdit('value')}
              style={{ marginLeft: 10 }}
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
          error={!!this.validateField('nonce')}
          helperText={
            this.validateField('nonce') || this.hexHelperText('nonce')
          }
          onChange={this.handleChange('nonce')}
          disabled={!edit.nonce}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.nonce}
              onChange={this.toggleEdit('nonce')}
              style={{ marginLeft: 10 }}
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
          error={!!this.validateField('data')}
          helperText={this.validateField('data')}
          onChange={this.handleChange('data')}
          disabled={!edit.data}
          rowsMax={10}
          fullWidth
          multiline
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={edit.data}
              onChange={this.toggleEdit('data')}
              style={{ marginLeft: 10 }}
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
        <Typography variant="h5" style={{ marginTop: 20 }}>
          Approve Transaction
        </Typography>
        <RequestInfo request={request} />
        {this.renderCallInfo()}
        <Grid
          container
          spacing={24}
          style={{ margin: '10px 0', paddingRight: 20 }}
        >
          <Grid item xs={6}>
            {this.renderFrom()}
          </Grid>
          <Grid item xs={6}>
            {this.renderTo()}
          </Grid>
          <Grid item xs={6}>
            {this.renderGas()}
          </Grid>
          <Grid item xs={6}>
            {this.renderGasPrice()}
          </Grid>
          <Grid item xs={6}>
            {this.renderValue()}
          </Grid>
          <Grid item xs={6}>
            {this.renderNonce()}
          </Grid>
          <Grid item xs={12}>
            {this.renderData()}
          </Grid>
        </Grid>
        <RequestActions
          approve={() => this.submit(true)}
          approveDisabled={!this.isTxValid()}
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
