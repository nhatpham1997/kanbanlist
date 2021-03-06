import constants from './constants'
import columnConstants from "../Column/constants";
import api from '../../api/api'
import Errors from '../utils/errors'
import { getHistory } from '../configStore';
import Message from "../AuthPage/message";
const actions = {
    list: (values) => async (dispatch) => {
        try {
            // call api
            const res = await api.get(`/board`);
            dispatch({
                type: constants.BOARD_GET_LIST_SUCCESS,
                payload: res.data.boards,
            });
        } catch (error) {
            console.log(error)
        }
    },

    doCreate: (values) => async (dispatch) => {
        try {
            dispatch({ type: constants.BOARD_CREATE_START });

            // call api
            const res = await api.post(`/board`, values);

            dispatch({
                type: constants.BOARD_CREATE_SUCCESS,
                payload: res.data,
            });

            getHistory().push(`/b/${res.data.shortid}`);
        } catch (error) {
            dispatch({ type: constants.BOARD_CREATE_ERROR });
            Errors.handle(error);
        }
    },

    doFind: (id) => async (dispatch) => {
        try {
            dispatch({ type: constants.BOARD_FIND_START });

            // call api
            const res = await api.get(`/board/${id}`);

            dispatch({
                type: constants.BOARD_FIND_SUCCESS,
                payload: res.data.board,
            });

            dispatch({
                type: columnConstants.COLUMN_FIND_SUCCESS,
                payload: res.data.columns,
            });

            getHistory().push(`/b/${res.data.board.shortid}`);
        } catch (error) {
            dispatch({ type: constants.BOARD_FIND_ERROR });
            Errors.handle(error);
        }
    },
    doAddMember: (id, member) => async (dispatch) => {
        try {
            dispatch({ type: constants.BOARD_ADD_MEMBER_START });

            //call api
            const res = await api.post(`/board/${id}/member?email=${member}`);
            if(res.data === "Member duplicate"){
                Message.error("Invited email false. Member exist on board!");
            }else{
                dispatch({
                    type: constants.BOARD_ADD_MEMBER_SUCCESS,
                    payload: res.data,
                })
                Message.success("Invited email sent. Add member success!");
            }
        } catch (error) {
            dispatch({ type: constants.BOARD_ADD_MEMBER_ERROR});
            Errors.handle(error);
        }
    }
};

export default actions;
