import React, { Component } from 'react'
import iconPath from '../icons/icon2x.png';

class SidebarTab extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
    this.badge = 'http://via.placeholder.com/15x15'
    this._id = '1'
  }
  render() {
    let button
    let icon = iconPath
    let isLoggedIn = true
    if (isLoggedIn) {
      button = <img src={icon} draggable="false" />
    } else {
      button = <i class="icon-globe">hi</i>
    }

    let nameFull = "foo"
    let name = "bar"

    return (
    <li data-tab-id={this._id}>
      <header>
        <button className={"main " + (this.badge && 'has-badge')}>
          {button}
        </button>
      </header>
      <section className="submenu-container">
        <section>
          <header>
            <span title={nameFull}>{name}</span>
            {this.badge && <div className="badge">{this.badge}</div>}
          </header>
        </section>
      </section>
    </li>
    );
  }
}

export default SidebarTab;