import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Tooltip from '@material-ui/core/Tooltip'

const styles = () => ({
  pluginName: {
    marginRight: 5,
    textTransform: 'capitalize'
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
    isDisabled: PropTypes.bool,
    isRunning: PropTypes.bool,
    isSelected: PropTypes.bool,
    secondaryText: PropTypes.string
  }

  render() {
    const {
      classes,
      handleToggle,
      handleSelectPlugin,
      isDisabled,
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
          primary={plugin.displayName}
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
          <Tooltip
            title={isDisabled ? 'No version selected' : ''}
            placement="left"
          >
            <span>
              <Switch
                color="primary"
                onChange={() => handleToggle(plugin)}
                checked={isRunning}
                disabled={isDisabled}
                data-test-id={`switch-${plugin.name}`}
              />
            </span>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default withStyles(styles)(PluginsNavListItem)
