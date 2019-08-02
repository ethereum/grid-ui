import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Tooltip from '@material-ui/core/Tooltip'

const styles = () => ({
  serviceName: {
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

class ServicesNavListItem extends Component {
  static displayName = 'ServicesNavListItem'

  static propTypes = {
    classes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    handleToggle: PropTypes.func.isRequired,
    handleSelectClient: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    isRunning: PropTypes.bool,
    isSelected: PropTypes.bool,
    secondaryText: PropTypes.string
  }

  render() {
    const {
      classes,
      handleToggle,
      handleSelectClient,
      isDisabled,
      isRunning,
      isSelected,
      secondaryText,
      client
    } = this.props

    return (
      <ListItem
        key={client.name}
        selected={isSelected}
        onClick={() => handleSelectClient(client)}
        classes={{
          root: classes.hoverableListItem,
          selected: classes.selected
        }}
        button
        data-test-id={`node-${client.name}`}
      >
        <ListItemText
          primary={client.displayName}
          secondary={secondaryText}
          primaryTypographyProps={{
            inline: true,
            classes: { root: classes.serviceName }
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
                onChange={() => handleToggle(client)}
                checked={isRunning}
                disabled={isDisabled}
                data-test-id={`switch-${client.name}`}
              />
            </span>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default withStyles(styles)(ServicesNavListItem)
