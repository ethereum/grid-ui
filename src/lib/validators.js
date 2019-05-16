import web3 from 'web3'

const keccak256 = web3.utils.keccak256

export const ethValidators = {
  isHex(value) {
    const v = String(value)
    if (v.length < 2) {
      return false
    }
    const prefix = v.slice(0, 2).toLowerCase()
    if (prefix !== '0x') {
      return false
    }
    const hex = v.slice(2)
    if (!/^[0-9a-f]*$/i.test(hex)) {
      return false
    }
    return true
  },
  isAddr(value) {
    if (!ethValidators.isHex(value)) {
      return false
    }
    const hex = String(value).slice(2)
    if (!/^[0-9a-f]{40}$/i.test(hex)) {
      return false
    }
    return true
  },
  isChecksummed(value) {
    if (!ethValidators.isAddr(value)) {
      return false
    }
    var address = String(value).slice(2)
    var addrLC = address.toLowerCase()
    var addrUC = address.toUpperCase()
    var addrHash = keccak256(addrLC).replace(/^0x/i, '')
    for (var i = 0; i < 40; i++) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if (parseInt(addrHash[i], 16) > 7) {
        if (addrUC[i] !== address[i]) {
          return false
        }
      } else {
        if (addrLC[i] !== address[i]) {
          return false
        }
      }
    }
    return true
  }
}

export function validateTx(tx) {
  let errors = []

  // Validate: from
  if (!ethValidators.isHex(tx.from)) {
    errors.push('From is not valid hex')
  }
  if (!ethValidators.isAddr(tx.from)) {
    errors.push('From is not an Ethereum address')
  }
  if (!ethValidators.isChecksummed(tx.from)) {
    errors.push('From has an incorrect checksum')
  }

  // Validate: to
  if (tx.to) {
    if (!ethValidators.isHex(tx.to)) {
      errors.push('To is not valid hex')
    }
    if (!ethValidators.isAddr(tx.to)) {
      errors.push('To is not an Ethereum address')
    }
    if (!ethValidators.isChecksummed(tx.to)) {
      errors.push('To has an incorrect checksum')
    }
  }

  // Validate: value
  if (!ethValidators.isHex(tx.value)) {
    errors.push('Value is not valid hex')
  }

  // Validate: gas
  if (!ethValidators.isHex(tx.gas)) {
    errors.push('Gas is not valid hex')
  }

  // Validate: gasPrice
  if (!ethValidators.isHex(tx.gasPrice)) {
    errors.push('Gas Price is not valid hex')
  }

  // Validate: nonce
  if (!ethValidators.isHex(tx.nonce)) {
    errors.push('Nonce is not valid hex')
  }

  // Validate: data
  if (tx.data) {
    if (!ethValidators.isHex(tx.data)) {
      errors.push('Data is not valid hex')
    }
  }

  return errors
}
