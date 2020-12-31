import { createSelector } from "reselect";

const selectRaw = (state) => state.task;

const selectFileList = createSelector([selectRaw], (task) => task.fileList);
const selectImageList = createSelector([selectRaw], (task) => task.imageList);
const selectTaskId = createSelector([selectRaw], (task) => task.taskId);
const selectTask = createSelector([selectRaw], (task) => task.task);
const selectComments = createSelector([selectRaw], (task) => task.comments);
const selectGetImageListLoading = createSelector([selectRaw], (task) => task.getImageListLoading);
const selectGetFileListLoading = createSelector([selectRaw], (task) => task.getFileListLoading);
const selectDestroyLoading = createSelector([selectRaw], (task) => task.destroyLoading);
const selectGetCommentLoading = createSelector([selectRaw], (task) => task.getCommentLoading);

const selector = {
    selectTaskId,
    selectTask,
    selectFileList,
    selectImageList,
    selectComments,
    selectGetImageListLoading,
    selectGetFileListLoading,
    selectDestroyLoading,
    selectGetCommentLoading
};

export default selector;
