import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = () => ({
  stackTrace: {
    fontFamily: 'monospace',
    padding: '12px'
  }
})

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  state = { error: null }

  render() {
    const { children, classes } = this.props
    const { error } = this.state

    if (error) {
      return (
        <StyledWrapper>
          <Typography variant="h6">Whoops, something went wrong!</Typography>
          <Typography>
            If you would like to report this issue on GitHub, please include the
            following stack trace:
          </Typography>
          <Typography classes={{ root: classes.stackTrace }}>
            {error && error.stack}
          </Typography>
        </StyledWrapper>
      )
    }

    return children
  }
}

export default withStyles(styles)(ErrorBoundary)

const StyledWrapper = styled.div`
  padding: 12px;
`
