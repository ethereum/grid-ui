import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import MuiButton from '@material-ui/core/Button'
import { primary, primary2 } from '../../theme'

const StyledButton = styled(MuiButton)`
  ${props =>
    props.color === 'primary' &&
    css`
      background-color: ${primary};
      background-image: linear-gradient(45deg, ${primary2} 0%, ${primary} 100%);
    `}
`

export default class Button extends Component {
  static displayName = 'Button'

  static propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.oneOf(['primary', 'secondary']),
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    secondary: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'reset', 'submit']),
    className: PropTypes.string,
    variant: PropTypes.oneOf([
      'text',
      'outlined',
      'contained',
      'fab',
      'extendedFab',
      'flat',
      'raised'
    ])
  }

  static defaultProps = {
    color: 'primary',
    disabled: false,
    type: 'button',
    variant: 'contained'
  }

  render() {
    const { children } = this.props

    return <StyledButton {...this.props}>{children}</StyledButton>
  }
}
