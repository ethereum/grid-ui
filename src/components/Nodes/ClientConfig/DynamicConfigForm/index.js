import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import FormItem from './FormItem'
import FlagPreview from './FlagPreview'

class DynamicConfigForm extends Component {
  static propTypes = {
    settings: PropTypes.array,
    clientName: PropTypes.string,
    client: PropTypes.object,
    isClientRunning: PropTypes.bool,
    handleClientConfigChanged: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      editGeneratedFlags: false
    }
  }

  toggleEditGeneratedFlags = checked => {
    this.setState({ editGeneratedFlags: checked })
  }

  wrapGridItem = (el, index) => {
    return (
      <Grid item xs={6} key={index}>
        {el}
      </Grid>
    )
  }

  wrapFormItem = item => {
    const {
      client,
      clientName,
      isClientRunning,
      handleClientConfigChanged
    } = this.props
    const { editGeneratedFlags } = this.state
    return (
      <FormItem
        key={item.id}
        itemKey={item.id}
        item={item}
        client={client}
        clientName={clientName}
        isClientRunning={isClientRunning}
        handleClientConfigChanged={handleClientConfigChanged}
        editGeneratedFlags={editGeneratedFlags}
      />
    )
  }

  render() {
    const { settings, client, isClientRunning } = this.props
    const { editGeneratedFlags } = this.state
    const { flags } = client[client.selected]

    if (!settings) return <h4>No configuration settings found</h4>

    const formItems = settings.map(this.wrapFormItem).map(this.wrapGridItem)

    return (
      <div>
        <Grid
          container
          style={{ paddingTop: 15, paddingBottom: 15 }}
          spacing={24}
        >
          {formItems}
        </Grid>
        <hr />
        <div style={{ marginTop: 25 }}>
          <FlagPreview
            flags={flags}
            client={client}
            editGeneratedFlags={editGeneratedFlags}
            toggleEditGeneratedFlags={this.toggleEditGeneratedFlags}
            isClientRunning={isClientRunning}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(DynamicConfigForm)
