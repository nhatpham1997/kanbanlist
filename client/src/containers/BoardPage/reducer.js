
import produce from 'immer'
import constants from './constants'
const initstate = {
    createLoading: false,
    findLoading: false,
    error: null,
    board: null,
    boards: [],
    owners: [],
};

const boardReducer = (state=initstate, {type, payload})=>
    produce(state, draft=>{
        switch (type) {
            case constants.BOARD_GET_LIST_SUCCESS:
                draft.boards = payload;
                break;
            case constants.BOARD_CREATE_START:
                draft.createLoading = true;
                draft.error = null;
                break;
            case constants.BOARD_CREATE_SUCCESS:
                draft.createLoading = false;
                break;
            case constants.BOARD_CREATE_ERROR:
                draft.createLoading = false;
                draft.error = payload || null;
                break;
            case constants.BOARD_FIND_START:
                draft.findLoading = true;
                draft.error = null;
                break;
            case constants.BOARD_FIND_SUCCESS:
                draft.findLoading = false;
                draft.board = payload;
                break;
            case constants.BOARD_FIND_ERROR:
                draft.findLoading = false;
                draft.error = payload;
                break;
            case constants.BOARD_ADD_MEMBER_START:
                draft.error = null;
                break;
            case constants.BOARD_ADD_MEMBER_SUCCESS:
                draft.owners = payload;
                break;
            case constants.BOARD_ADD_MEMBER_ERROR:
                draft.error = payload;
                break;
            default:
                break;
        }
    })


export default boardReducer;
