import { BASE_API, apiRequest } from "./baseApi";

export const loginUser = (username: string, licence_plat: string) => {
    return apiRequest(BASE_API.login, { username, licence_plat });
};
