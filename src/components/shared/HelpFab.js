import React from 'react'
import Fab from '@material-ui/core/Fab'
import styled from 'styled-components'
import FeedbackIcon from '@material-ui/icons/Feedback'
import { primary, primary2, primary3 } from '../../theme'

const StyledButton = styled(Fab)`
  background-color: #fad961;
  background-image: linear-gradient(
    45deg,
    ${primary3} 0%,
    ${primary2} 50%,
    ${primary} 100%
  );
`

class HelpFab extends React.Component {
  handleButtonClick = () => {
    // Feedback form
    window.location.href = 'https://forms.gle/bjkphVS8ca1JzwL46'
  }

  render() {
    return (
      <StyledButton
        onClick={this.handleButtonClick}
        color="primary"
        style={{
          position: 'fixed',
          left: 20,
          bottom: 20,
          transform: 'translate3d(0, 0, 0)',
          zIndex: 9999
        }}
      >
        <FeedbackIcon />
      </StyledButton>
    )
  }
}
export default HelpFab
