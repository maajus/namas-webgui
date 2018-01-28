export default function recucer (state={
    status: {},
    fetching: false,
    fetched: false,
    error: null,
}, action) {

    //console.log(action.type)
    switch (action.type) {
        case "FETCH_RXSTATUS": {
            return {...state, fetching: true}
        }
        case "FETCH_RXSTATUS_FAILED": {
            return {...state, fetching:false, error: action.payload}
        }
        case "FETCH_RXSTATUS_COMPLETED": {
            return {
                ...state,
                fetching:false,
                fetched: true,
                data: action.payload,
            }
        }

        default:
                return state;
    }
}
