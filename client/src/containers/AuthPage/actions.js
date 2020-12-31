import api from "../../api/api";
import constants from "./constants";
import { getHistory } from "../configStore";
import Errors from "../utils/errors";
import Message from "./message";

const actions = {
    doSignup: values => async dispatch => {
        try {
            dispatch({ type: constants.SIGNUP_START });

            // call api
            const res = await api.post(`/auth/register`, values);
            window.localStorage.setItem("kauth", JSON.stringify(res.data));

            dispatch({ type: constants.SIGNUP_SUCCESS });
            getHistory().push("/");
        } catch (error) {
            const errorMessage = Errors.selectMessage(error);
            dispatch({ type: constants.SIGNUP_ERROR, payload: errorMessage });
        }
    },
    doSignin: values => async dispatch => {
        try {
            dispatch({ type: constants.SIGNIN_START });

            // call api
            const res = await api.post(`/auth/login`, values);
            window.localStorage.setItem("kauth", JSON.stringify(res.data));

            dispatch({ type: constants.SIGNIN_SUCCESS });
            getHistory().push("/");
        } catch (error) {
            const errorMessage = Errors.selectMessage(error);
            dispatch({ type: constants.SIGNIN_ERROR, payload: errorMessage });
        }
    },
    doSignout: () => (dispatch) => {
        window.localStorage.removeItem("kauth");
        
        getHistory().push("/signin");
        dispatch({ type: "RESET" });
    },
    doSendResetPassword: (email) => async (dispatch) => {
        try {
            dispatch({ type: constants.SEND_RESET_PASSWORD_START });

            // call api: signin
            let response = await api.post(`/auth/send-password-reset`,email);

            dispatch({
                type: constants.SEND_RESET_PASSWORD_SUCCESS,
                payload: response.data,
            });
            Message.success("Reset email sent. Please check your inbox!");
        } catch (error) {
            dispatch({
                type: constants.SEND_RESET_PASSWORD_ERROR,
                payload: Errors.selectMessage(error),
            });
        }
    },
    doChangePassword: (data) => async (dispatch) => {
        try {
            dispatch({ type: constants.CHANGE_PASSWORD_START });

            // call api: signin
            let response = await api.post('/auth/reset-password',data);

            dispatch({
                type: constants.CHANGE_PASSWORD_SUCCESS,
                payload: response.data,
            });
            Message.success("Your password has been changed successfully!");
            getHistory().push("/signin");
        } catch (error) {
            dispatch({
                type: constants.CHANGE_PASSWORD_ERROR,
                payload: Errors.selectMessage(error),
            });
        }
    }
};

export default actions;
