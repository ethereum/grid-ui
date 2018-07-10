import React, { Component } from 'react'
import blockies from 'ethereum-blockies'
import {i18n} from '../API'
import hqxConstructor from '../lib/hqx'

let mod = {
  Math: window.Math
}
hqxConstructor(mod) 
const {hqx} = mod

// copied from https://github.com/ethereum/blockies/blob/master/react-component.js
// see also https://github.com/alexvandesande/meteor-identicon/blob/master/lib/identicon.js
// https://github.com/ethereum/meteor-package-elements/blob/master/identicon.html
export default class DappIdenticon extends Component {
  constructor(props){
    super(props)
  }
  identiconData(identity){
    return hqx(
      hqx(
        blockies.create({
          seed: identity,
          size: 8,
          scale: 1
        }),
        4
      ),
      4
    ).toDataURL()
  }
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
    let classN = 'dapp-tiny'
    let styl = {
      'backgroundImage': `url('${this.identiconData(this.props.identity)}')` 
    }
    return (
    <span className={'dapp-identicon' + ' ' + classN} title={i18n.t('elements.identiconHelper')} style={styl}>
      <img src={this.identiconDataPixel(this.props.identity.toLowerCase())} className='identicon-pixel' />
    </span>
    )
  }
}