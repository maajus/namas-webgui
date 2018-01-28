
export default function recucer (state={
    status: {},
    fetching: false,
    fetched: false,
    error: null,
}, action) {

    switch (action.type) {
        case "FETCH_TXSTATUS": {
            return {...state, fetching: true}
        }
        case "FETCH_TXSTATUS_FAILED": {
            return {...state, fetching:false, error: action.payload}
        }
        case "FETCH_TXSTATUS_COMPLETED": {
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
