import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iconPath from '../icons/icon2x.png';

const divStyle = {
  margin: '40px',
  border: '5px solid pink'
};

class SidebarTab extends Component {
  constructor(props) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = { 
      submenu: {
        'visibility': 'hidden',
        'opacity': 0
      }
    }
    this.badge = 'http://via.placeholder.com/15x15'
    this._id = '1'
  }
  handleMouseLeave(){
    this.setState({
      submenu: {
        'visibility': 'hidden',
        'opacity': 0
      }
    })
  }
  handleMouseEnter(){
    console.log('mouse enter on sidebar tab')
    let el = ReactDOM.findDOMNode(this)
    this.setState({
      submenu: {
        'visibility': 'visible',
        'opacity': 1,
        'top': el.offsetTop + 'px'
      }
    })
    /*
    var $this = $(e.currentTarget);
    var tabTopOffset = $this.offset().top;
    var $submenuContainer = $this.find('.submenu-container');
    var $submenu = $this.find('.sub-menu');
    var submenuHeaderHeight = $this.find('header').outerHeight();
    var windowHeight = $(window).outerHeight();

    $submenuContainer.css('top', tabTopOffset + 'px');
    $submenu.css(
      'max-height',
      windowHeight - tabTopOffset - submenuHeaderHeight - 30 + 'px'
    );
    */
  }
  handleClick(){
    console.log('sidebar element clicked')
  }
  render() {
    let button
    let icon = this._id === 'browser' ? iconPath : iconPath
    let isLoggedIn = true
    if (isLoggedIn) {
      button = <img src={icon} draggable="false" />
    } else {
      button = <i class="icon-globe">hi</i>
    }

    let nameFull = "foo"

    return (
    <li data-tab-id={this._id} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleClick}>
      <header>
        <button className={"main " + (this.badge && 'has-badge')}>
          {button}
        </button>
      </header>
      <section className="submenu-container" style={this.state.submenu}>
        <section>
          <header>
            <span title={nameFull}>{this.props.tab.name}</span>
            {this.badge && <div className="badge">{this.badge}</div>}
          </header>
        </section>
      </section>
    </li>
    );
  }
}

export default SidebarTab;