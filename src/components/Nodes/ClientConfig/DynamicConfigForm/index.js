import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import FormItem from './FormItem'

class DynamicConfigForm extends Component {
  static propTypes = {
    settings: PropTypes.object,
    clientName: PropTypes.string,
    client: PropTypes.object,
    isClientRunning: PropTypes.bool,
    handleClientConfigChanged: PropTypes.func
  }

  wrapGridItem = (el, index) => {
    return (
      <Grid item xs={6} key={index}>
        {el}
      </Grid>
    )
  }

  render() {
    const {
      settings,
      client,
      clientName,
      isClientRunning,
      handleClientConfigChanged
    } = this.props
    if (!settings) return <h4>No configuration settings found</h4>

    const formItems = Object.entries(settings)
      .map(entry => {
        const [key, item] = entry
        return (
          <FormItem
            key={key}
            itemKey={key}
            item={item}
            client={client}
            clientName={clientName}
            isClientRunning={isClientRunning}
            handleClientConfigChanged={handleClientConfigChanged}
          />
        )
      })
      .map(this.wrapGridItem)

    return (
      <Grid container style={{ paddingTop: 15 }} spacing={24}>
        {formItems}
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(DynamicConfigForm)
