import React, { Component } from 'react'
import blockies from 'ethereum-blockies'
import {i18n} from '../API'
import hqxConstructor from '../lib/hqx'

// window.blockies = blockies

let mod = {
  Math: window.Math
}
hqxConstructor(mod) 
const {hqx} = mod

// copied from https://github.com/ethereum/meteor-package-elements/blob/master/identicon.html
// see also https://github.com/ethereum/blockies/blob/master/react-component.js
// see also https://github.com/alexvandesande/meteor-identicon/blob/master/lib/identicon.js
export default class DappIdenticon extends Component {
  constructor(props){
    super(props)
    var identity = (' ' + this.props.identity).slice(1).toLowerCase()
    this.state = {
      imageData: this.identiconData(identity) // cache image data
    }
  }
  // uses hqx pixel scaling with max value 4 x 2 = factor 8
  identiconData(identity){
    return hqx( hqx(
        blockies.create({
          seed: identity,
          size: 8,
          scale: 1
        }),
      4),4)
      .toDataURL()
  }
  // uses blockie's factor 8 scaling
  identiconDataPixel(identity){
    return blockies
      .create({
        seed: identity,
        size: 8,
        scale: 8
      })
      .toDataURL()
  }
  renderLink(){
    /*
    return (
    <a href="{{link}}" class="dapp-identicon {{class}}" style="background-image: url('{{identiconData identity}}')" title={{i18nTextIcon}}>
      <img src="{{identiconDataPixel identity}}" class='identicon-pixel'>
    </a>
    )
    */
  }
  render() {
    if(!this.props.identity) { 
      return <span></span> 
    } 
    if(this.props.link){
      return this.renderLink()
    }
    let classN = this.props.class || 'dapp-identicon dapp-tiny'
    let style = {
      'backgroundImage': `url('${this.state.imageData}')` 
    }
    return (
    <span className={classN} title={i18n.t('elements.identiconHelper')} style={style}>
      <img src={this.state.imageData} className='identicon-pixel' />
    </span>
    )
  }
}