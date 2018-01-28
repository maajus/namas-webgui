import { combineReducers } from "redux"

import { 
    Status, 
    Log, 
    Settings,
    Login,
    userAlreadyConnected,
    IOstate,

} from "./fetchReducer"
//import TxStatus from "./TxStatusReducer"

export default combineReducers({
    Status,
    Log,
    Settings,
    Login,
    userAlreadyConnected,
    IOstate,
})
