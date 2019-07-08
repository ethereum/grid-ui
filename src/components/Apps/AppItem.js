import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import Button from '../shared/Button'
import Grid from '../../API/Grid'

const styles = {
  card: {
    minWidth: 275
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  title: {
    fontSize: 14
  }
}

class AppItem extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    app: PropTypes.object
  }

  state = {}

  handleAppLaunch = () => {
    const { app } = this.props
    Grid.AppManager.launch(app)
  }

  render() {
    const { classes, app } = this.props

    const { name, lastUpdated, description, screenshot } = app

    return (
      <Card className={classes.card}>
        <CardHeader
          title={name}
          subheader={moment(lastUpdated).format('MMMM Do YYYY')}
        />
        <CardMedia className={classes.media} image={screenshot} />
        <CardContent>
          <Typography component="p">{description}</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={this.handleAppLaunch}>Launch</Button>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(styles)(AppItem)
