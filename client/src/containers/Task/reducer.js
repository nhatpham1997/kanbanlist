import produce from "immer";
import constants from "./constants";
const initstate = {
    taskId: null, 
    error: null,
    findLoading: false,
    updateLoading: false,
    destroyLoading: false,
    getImageListLoading: false,
    getFileListLoading: false,
    getCommentLoading: false,
    task: null,
    imageList: [],
    fileList: [],
    comments: [],
};

const boardReducer = (state = initstate, { type, payload }) =>
    produce(state, (draft) => {
        switch (type) {
            case constants.TASK_ON_SELECT:
                draft.task = null;
                draft.imageList = [];
                draft.fileList = [];
                draft.comments = [];
                draft.taskId = payload;
                break;
            case constants.TASK_FIND_START:
                draft.findLoading = true;
                break;
            case constants.TASK_FIND_SUCCESS:
                draft.task = payload;
                draft.findLoading = false;
                break;
            case constants.TASK_FIND_ERROR:
                draft.findLoading = false;
                draft.taskId = null;
                draft.task = null;
                break;
            case constants.TASK_UPDATE_START:
                draft.updateLoading = true;
                break;
            case constants.TASK_UPDATE_SUCCESS:
                draft.task = payload;
                draft.updateLoading = false;
                break;
            case constants.TASK_UPDATE_ERROR:
                draft.updateLoading = false;
                break;
            case constants.TASK_DESTROY_START:
                draft.destroyLoading = true;
                break;
            case constants.TASK_DESTROY_SUCCESS:
                draft.taskId = null;
                draft.destroyLoading = false;
                break;
            case constants.TASK_DESTROY_ERROR:
                draft.destroyLoading = false;
                break;
            case constants.INPUT_FILE_LIST_CHANGE:
                draft.fileList = state.fileList.concat(payload);
                break;
            case constants.INPUT_IMAGE_LIST_CHANGE:
                draft.imageList = state.imageList.concat(payload);
                break;
            case constants.TASK_GET_IMAGE_LIST_START:
                draft.getImageListLoading = true;
                break;
            case constants.TASK_GET_IMAGE_LIST_SUCCESS:
                draft.getImageListLoading = false;
                draft.imageList = payload.images;
                break;
            case constants.TASK_GET_IMAGE_LIST_ERROR:
                draft.getImageListLoading = false;
                break;
            case constants.TASK_GET_FILE_LIST_START:
                draft.getFileListLoading = true;
                break;
            case constants.TASK_GET_FILE_LIST_SUCCESS:
                draft.getFileListLoading = false;
                draft.fileList = payload.files;
                break;
            case constants.TASK_GET_FILE_LIST_ERROR:
                draft.getFileListLoading = false;
                break;
            case constants.TASK_DESTROY_FILE_START:
                draft.destroyLoading = true;
                break
            case constants.TASK_DESTROY_FILE_SUCCESS:
                if(payload.type === "file"){
                    draft.fileList = state.fileList.filter(item=>item._id !== payload.fileId)
                }else{
                    draft.imageList = state.imageList.filter(item=>item._id !== payload.fileId)
                }
                draft.destroyLoading = false;
                break;
            case constants.TASK_DESTROY_FILE_ERROR:
                draft.destroyLoading = false;
                break;
            case constants.TASK_GET_COMMENT_START:
                draft.getCommentLoading = true;
                break;
            case constants.TASK_GET_COMMENT_SUCCESS:
                draft.getCommentLoading = false;
                draft.comments = payload.comments;
                break;
            case constants.TASK_GET_COMMENT_ERROR:
                draft.getCommentLoading = false;
                break;
            case constants.TASK_LIST_COMMENT_CHANGE:
                draft.comments = state.comments.concat(payload);
                break;
            case constants.TASK_DESTROY_COMMENT_START:
                break;
            case constants.TASK_DESTROY_COMMENT_SUCCESS:
                draft.comments = state.comments.filter(item=>item.id != payload)
                break;
            case constants.TASK_GET_COMMENT_ERROR:
                break;
            default:
                break;
        }
    });

export default boardReducer;
