import produce from "immer";
import constants from "./constants";
const initstate = {
    createLoading: false,
    error: null,
    columns: [],
};

const boardReducer = (state = initstate, { type, payload }) =>
    produce(state, (draft) => {
        switch (type) {
            case constants.COLUMN_CREATE_START:
                draft.createLoading = true;
                draft.error = null;
                break;
            case constants.COLUMN_DESTROY_TASK:
                state.columns.forEach((col, index)=>{
                    if(col.shortid === payload.columnId){
                        draft.columns[index].tasks = state.columns[index].tasks.filter(task=>task.shortid !== payload.shortid)
                        /**
                         * tim cot
                         * su dung filter loc task da bi xoa dua vao payload
                         * => filter tra ve mang nhuwng task chua bi xoa
                         * => gan tasks vao cot hien tai 
                         */
                    }
                })
                break;
            case constants.COLUMN_CREATE_SUCCESS:
                state.columns.forEach((item, index) => {
                    // tìm id index column hiện tại và đẩy task mới tạo vào cuối mảng
                    if (item.shortid === payload.columnId) {
                        draft.columns[index].tasks.push(payload);
                    }
                });
                draft.createLoading = false;
                break;
            case constants.COLUMN_CREATE_ERROR:
                draft.createLoading = false;
                draft.error = payload || null;
                break;
            case constants.COLUMN_FIND_SUCCESS:
                draft.columns = payload;
                break;
            case constants.COLUMN_REORDER:
                draft.columns = payload;
                break;
            case constants.COLUMN_TASK_UPDATE_SUCCESS:
                state.columns.forEach((column, columnIndex) => {
                    if (column.shortid === payload.columnId) {
                        column.tasks.forEach((task, taskIndex) => {
                            if (task.shortid === payload.shortid) {
                                draft.columns[columnIndex].tasks[
                                    taskIndex
                                ] = payload;
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
    });

export default boardReducer;
