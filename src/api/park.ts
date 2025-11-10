import { BASE_API, apiRequest } from "./baseApi";

export const parkAction = (action: string, payload: any = {}) => {
    const url = `${BASE_API.park}?action=${action}`;
    return apiRequest(url, payload);
};
