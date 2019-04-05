import React, { Component } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'

class Accounts extends Component {
  render() {
    return <Typography component="h6">Accounts</Typography>
  }
}

function mapStateToProps(state) {
  return {
    // clef: state.clef
  }
}

export default connect(mapStateToProps)(Accounts)
