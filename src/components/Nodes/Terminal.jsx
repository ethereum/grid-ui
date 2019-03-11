import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '../shared/Button'
import { Mist } from '../../API'

const { geth } = Mist

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
        logs: [...gethLogs]
      },
      () => {
        if (scrollToBottom && gethLogs.length > logs.length) {
          this.scrollToBottom()
        }
      }
    )
  }

  scrollToBottom = () => {
    this.logsEnd.current.scrollIntoView({ behavior: 'smooth' })
  }

  render() {
    const { logs, scrollToBottom } = this.state

    return (
      <div style={{ maxWidth: 600, padding: 5 }}>
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
                fontSize: '11px',
                background: '#111',
                color: '#eee',
                maxHeight: 350,
                maxWidth: 600,
                overflowY: 'scroll',
                padding: '6px',
                position: 'relative',
                whiteSpace: 'nowrap'
              }}
            >
              {logs.map((l, index) => (
                <div key={index}>{l}</div>
              ))}
              <div ref={this.logsEnd} />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}
