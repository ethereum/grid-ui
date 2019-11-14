import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'
import Switch from '@material-ui/core/Switch'

const styles = () => ({
  pluginName: {
    marginRight: 5,
    textTransform: 'capitalize',
    fontSize: '85%'
  },
  hoverableListItem: {
    '&:hover $versionInfo': {
      visibility: 'visible'
    }
  },
  versionInfo: {
    fontSize: '80%',
    visibility: 'hidden'
  }
})

class PluginsNavListItem extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    plugin: PropTypes.object.isRequired,
    handleToggle: PropTypes.func.isRequired,
    handleSelectPlugin: PropTypes.func.isRequired,
    isRunning: PropTypes.bool,
    isSelected: PropTypes.bool,
    secondaryText: PropTypes.string,
    appBadges: PropTypes.object
  }

  state = {
    isToggled: false
  }

  badgeContent = () => {
    const { appBadges } = this.props
    return Object.values(appBadges).reduce((a, b) => a + b, 0)
  }

  toggleOff = plugin => newState => {
    if (['started', 'connected', 'stopped'].includes(newState)) {
      this.setState({ isToggled: false })
      plugin.off('newState', this.toggleOff)
    }
  }

  handleSwitch = plugin => {
    const { handleToggle } = this.props
    this.setState({ isToggled: true }, () => {
      plugin.on('newState', this.toggleOff(plugin))
    })
    handleToggle(plugin)
  }

  render() {
    const { isToggled } = this.state
    const {
      classes,
      handleSelectPlugin,
      isRunning,
      isSelected,
      secondaryText,
      plugin
    } = this.props

    return (
      <ListItem
        key={plugin.name}
        selected={isSelected}
        onClick={() => handleSelectPlugin(plugin)}
        classes={{
          root: classes.hoverableListItem,
          selected: classes.selected
        }}
        button
        data-test-id={`node-${plugin.name}`}
      >
        <ListItemText
          primary={
            <Badge color="secondary" badgeContent={this.badgeContent()}>
              {plugin.displayName}
            </Badge>
          }
          secondary={secondaryText}
          primaryTypographyProps={{
            inline: true,
            classes: { root: classes.pluginName }
          }}
          secondaryTypographyProps={{
            inline: true,
            classes: { root: classes.versionInfo }
          }}
        />
        <ListItemSecondaryAction>
          <span>
            <Switch
              color="primary"
              onChange={() => this.handleSwitch(plugin)}
              checked={isRunning}
              disabled={isToggled}
              data-test-id={`switch-${plugin.name}`}
            />
          </span>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    appBadges: state.plugin[ownProps.plugin.name].appBadges
  }
}

export default connect(mapStateToProps)(withStyles(styles)(PluginsNavListItem))
