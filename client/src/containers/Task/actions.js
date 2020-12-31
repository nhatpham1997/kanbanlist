import constants from "./constants";
import columnConstants from "../Column/constants";
import api from "../../api/api";
import Errors from "../utils/errors";
import { getHistory } from "../configStore";

const actions = {
    doReorder: async (data) => {
        const res = await api.post(`/task/${data.taskId}/merge`, data);
    },
   
    doSelectTask: (data) => ({ type: constants.TASK_ON_SELECT, payload: data }),
    doFind: (id) => async (dispatch) => {
        try {
            dispatch({ type: constants.TASK_FIND_START });

            // call api
            const res = await api.get(`/task/${id}`);

            dispatch({
                type: constants.TASK_FIND_SUCCESS,
                payload: res.data.task,
            });
        } catch (error) {
            dispatch({ type: constants.TASK_FIND_ERROR });
            Errors.handle(error);
        }
    },

    doUpdate: (data, id) => async (dispatch) => {
        try {
            dispatch({ type: constants.TASK_UPDATE_START });

            // call api
            const res = await api.put(`/task/${id}`, data);

            dispatch({
                type: constants.TASK_UPDATE_SUCCESS,
                payload: res.data,
            });
            dispatch({
                type: columnConstants.COLUMN_TASK_UPDATE_SUCCESS,
                payload: res.data,
            });
        } catch (error) {
            dispatch({ type: constants.TASK_UPDATE_ERROR });
            Errors.handle(error);
        }
    },

    doDestroy: (id) => async (dispatch) => {
        try {
            dispatch({ type: constants.TASK_DESTROY_START });

            // call api
            const res = await api.delete(`/task/${id}`)

            dispatch({
                type: constants.TASK_DESTROY_SUCCESS,
                payload: res.data,
            });
            dispatch({
                type: columnConstants.COLUMN_DESTROY_TASK,
                payload: res.data
            })
        } catch (error) {
            dispatch({ type: constants.TASK_DESTROY_ERROR });
            Errors.handle(error);
        }
    },

    listImage: (id) => async (dispatch) => {
        try {
            dispatch({
                type: constants.TASK_GET_IMAGE_LIST_START,
            });
            // call api
            const res = await api.get(`/task/${id}/images`);

            dispatch({
                type: constants.TASK_GET_IMAGE_LIST_SUCCESS,
                payload: {
                    images: res.data
                },
            });
        } catch (error) {
            Errors.handle(error);
            dispatch({
                type: constants.TASK_GET_IMAGE_LIST_ERROR,
            });
        }
    },

    listFile: (id) => async (dispatch) => {
        try {
            dispatch({
                type: constants.TASK_GET_FILE_LIST_START,
            });
            //call api
            const res = await api.get(`/task/${id}/files`)

            dispatch({
                type: constants.TASK_GET_FILE_LIST_SUCCESS,
                payload: {
                    files: res.data
                },
            });
        } catch (error) {
            Errors.handle(error);
            dispatch({
                type: constants.TASK_GET_FILE_LIST_ERROR,
            });
        }
    },
 
    doDestroyFile: (taskid, fileId, fileType) => async (dispatch) => {

        try {
            dispatch({ type: constants.TASK_DESTROY_FILE_START});

            const res = await api.delete(`/task/${taskid}/${fileId}?type=${fileType}`);

            dispatch({
                type: constants.TASK_DESTROY_FILE_SUCCESS,
                payload: {
                    fileId, fileType
                }
            })
        } catch (error) {
            console.log(error);
            dispatch({ type: constants.TASK_DESTROY_FILE_ERROR });
            Errors.handle(error);
        }
    },

    listComment: (taskid) => async (dispatch) => {
        try {
            dispatch({ type: constants.TASK_GET_COMMENT_START });

            //call api
            const res = await api.get(`/comment/${taskid}`);
            
            dispatch({
                type: constants.TASK_GET_COMMENT_SUCCESS,
                payload: {
                    comments: res.data.comments
                }
            })
        } catch (error) {
            // Errors.handle(error);
            dispatch({
                type: constants.TASK_GET_COMMENT_ERROR,
            });
        }
    },

    addComment: (taskid, data) => async () => {
        try {
            //call api
            const res = await api.put(`/comment/${taskid}`, data);
        } catch (error) {
            Errors.handle(error);
        }
    },

    doDestroyComment: (id) => async(dispatch) => {
        try {
            dispatch({ type: constants.TASK_DESTROY_COMMENT_START });

            //call api
            const res = await api.delete(`/comment/delete/${id}`);
            
            dispatch({
                type: constants.TASK_DESTROY_COMMENT_SUCCESS,
                payload: id,
             });
        } catch (error) {
            Errors.handle(error);
            dispatch({ type: constants.TASK_DESTROY_COMMENT_ERROR });
        }
    }
};

export default actions;
