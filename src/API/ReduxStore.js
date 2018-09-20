import {Helpers} from './Helpers'
export default Helpers.isMist() ? window.store.getState().nodes : window.store
