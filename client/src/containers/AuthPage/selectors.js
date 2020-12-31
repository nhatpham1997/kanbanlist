import { createSelector } from 'reselect'

const selectRaw = state => state.auth;

const selectSignupLoading = createSelector(
    [selectRaw],
    auth => auth.signupLoading
);
const selectSignupErrorMessage = createSelector(
    [selectRaw],
    auth => auth.signupErrorMessage
);
const selectSigninLoading = createSelector(
    [selectRaw],
    auth => auth.signinLoading
);

const selectSigninErrorMessage = createSelector(
    [selectRaw],
    auth => auth.signinErrorMessage
);

const selectSendResetPasswordLoading = createSelector(
    [selectRaw],
    (auth) => auth.sendResetPasswordLoading
);
const selectSendResetPasswordError = createSelector(
    [selectRaw],
    (auth) => auth.sendResetPasswordError
);

const selectChangePasswordLoading = createSelector(
    [selectRaw],
    (auth) => auth.changePasswordLoading
);
const selectChangePasswordError = createSelector(
    [selectRaw],
    (auth) => auth.changePasswordError
);

const selectors = {
    selectSignupLoading,
    selectSigninLoading,
    selectSigninErrorMessage,
    selectSignupErrorMessage,
    selectSendResetPasswordLoading,
    selectSendResetPasswordError,
    selectChangePasswordLoading,
    selectChangePasswordError
};

export default selectors;
