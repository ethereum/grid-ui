import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = () => ({
  controls: { marginTop: 15 },
  approve: { backgroundColor: 'green' },
  reject: { backgroundColor: 'red', marginRight: 10 }
})

class RequestActions extends Component {
  static propTypes = {
    approve: PropTypes.func,
    reject: PropTypes.func,
    classes: PropTypes.object
  }

  render() {
    const { classes, approve, reject } = this.props
    return (
      <div classes={{ root: classes.controls }}>
        <Button
          onClick={() => {
            reject()
          }}
          classes={{ root: classes.reject }}
        >
          Reject
        </Button>
        <Button
          onClick={() => {
            approve()
          }}
          classes={{ root: classes.approve }}
        >
          Approve
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(RequestActions)
