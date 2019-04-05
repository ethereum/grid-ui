import Clef from './clefService'

export const clefStarted = () => {
  return { type: '[SIGNER]:CLEF:STARTED' }
}

export const clefStopped = () => {
  return { type: '[SIGNER]:CLEF:STOPPED' }
}
