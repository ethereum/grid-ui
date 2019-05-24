import React from 'react'
import Fab from '@material-ui/core/Fab'
import FeedbackIcon from '@material-ui/icons/Feedback'

class HelpFab extends React.Component {
  handleButtonClick = () => {
    // Feedback form
    window.location.href = 'https://forms.gle/bjkphVS8ca1JzwL46'
  }

  render() {
    return (
      <Fab
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
      </Fab>
    )
  }
}
export default HelpFab
