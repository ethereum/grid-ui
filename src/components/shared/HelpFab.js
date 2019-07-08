import React from 'react'
import Fab from '@material-ui/core/Fab'
import styled from 'styled-components'
import FeedbackIcon from '@material-ui/icons/Feedback'

const StyledButton = styled(Fab)`
  background-color: #fad961;
  background-image: linear-gradient(
    45deg,
    #5d63b3 0%,
    #78aac7 50%,
    #4fb783 100%
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
