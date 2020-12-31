import constants from "./constants";
// import Message from "../shared/message";
import Errors from "../shared/error/errors";
import services from "./service";
import api from "../../api/api";

const messageUpdateSuccess = "Update successfully";
const actions = {

    doFind: (id) => async (dispatch) => {
        try {
            dispatch({
                type: constants.USER_FIND_START,
            });

            const response = await services.findFn(id);
            dispatch({
                type: constants.USER_FIND_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            Errors.handle(error);
            dispatch({
                type: constants.USER_FIND_ERROR,
            });
        }
    },

    doUpdatePassword: (userInfo) => async (dispatch) => {
        try {
            dispatch({ 
                type: constants.USER_UPDATE_START,
            });

            await services.updatePasswordFn(userInfo);

            dispatch({
                type: constants.USER_UPDATE_SUCCESS
            });

            // Message.success(messageUpdateSuccess);

            // getHistory().push("/constants.USER");
        } catch (error) {
            // Errors.handle(error);

            dispatch({
                type: constants.USER_UPDATE_ERROR,
            });
        }
    },

    doChangeAvatar: (picture) => async (dispatch) => {
        console.log(picture);
    }
};
export default actions;
