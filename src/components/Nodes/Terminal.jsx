import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '../shared/Button'
import { Mist } from '../../API'

const { geth } = Mist

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

export default class Terminal extends Component {
  state = {
    logs: [],
    scrollToBottom: true
  }

  logsEnd = React.createRef()

  componentDidMount = async () => {
    setInterval(this.refreshLogs, 1000)
  }

  refreshLogs = async () => {
    const { logs, scrollToBottom } = this.state

    const gethLogs = await geth.getLogs()

    this.setState(
      {
        logs: [...logs, ...gethLogs]
      },
      () => {
        if (scrollToBottom) {
          this.scrollToBottom()
        }
      }
    )
  }

  scrollToBottom = () => {
    this.logsEnd.current.scrollIntoView({ bahavior: 'smooth' })
  }

  render() {
    const { logs, scrollToBottom } = this.state

    return (
      <div style={{ marginTop: '20px', maxWidth: 600, padding: 5 }}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6">Terminal</Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Button
              size="small"
              color="secondary"
              style={{ marginBottom: '6px' }}
              onClick={() => this.setState({ scrollToBottom: !scrollToBottom })}
            >
              {scrollToBottom ? 'Unfollow Logs' : 'Follow Logs'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                fontFamily:
                  'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
                background: '#111',
                color: '#eee',
                maxHeight: 350,
                maxWidth: 600,
                overflowY: 'scroll',
                padding: 5,
                position: 'relative'
              }}
            >
              {logs.map(l => (
                <div key={getRandomArbitrary(0, 1000000000)}> &gt; {l}</div>
              ))}
              <div ref={this.logsEnd} />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}
