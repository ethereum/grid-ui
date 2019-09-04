import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Button from '../../shared/Button'
import Grid from '../../../API/Grid'

// FIXME don't hotlink
const JAVA_LOGO =
  'https://upload.wikimedia.org/wikipedia/de/thumb/e/e1/Java-Logo.svg/364px-Java-Logo.svg.png'

const styles = {
  card: {
    maxWidth: 230,
    background: '#222428'
  },
  media: {
    height: 0,
    paddingTop: '75%', // 4:3
    padding: '10%'
  },
  title: {
    fontSize: 14
  }
}

class AppItem extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dependency: PropTypes.object.isRequired
  }

  state = {}

  handleAppLaunch = () => {
    Grid.openExternalLink(
      'http://www.oracle.com/technetwork/java/javase/downloads/index.html'
    )
  }

  render() {
    const { classes, dependency } = this.props
    const { name, type, version } = dependency
    const description = `Required version: ${type} ${version} 64Bit`
    const logo = name === 'Java' ? JAVA_LOGO : undefined
    return (
      <Card className={classes.card}>
        {logo ? (
          <CardMedia
            className={classes.media}
            image={logo}
            style={{ backgroundSize: 'contain' }}
          />
        ) : (
          <CardHeader title={name} />
        )}
        <CardContent>
          <Typography component="p">{description}</Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button onClick={this.handleAppLaunch}>Install {name}</Button>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(styles)(AppItem)
