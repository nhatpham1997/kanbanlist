import api from "../../api/api";

export const fetchSignin = async ({ email, password }) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });
    return response;
};

export const fetchSignup = async ({ firstname, lastname, email, password }) => {
    const response = await api.post("/auth/register", {
        firstname,
        lastname,
        email,
        password,
    });
    return response;
};

export const fetchSendResetPassword = async (email) => {
    const response = await api.post("/auth/send-password-reset", email);
    return response;
};

export const fetchChangePassword = async (data) => {
    const response = await api.post("/auth/reset-password", data);
    return response;
};

export const fetchRefreshToken = async (data)=>{
    const response = await api.post("/auth/refresh-token", data);
    return response;
}
