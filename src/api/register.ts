import { BASE_API, apiRequest } from "./baseApi";

export const registerUser = (username: string, email: string, licence_plat: string) => {
    return apiRequest(BASE_API.register, { username, email, licence_plat });
};
