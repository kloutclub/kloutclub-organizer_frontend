import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchTotalAttendee = async (token: string | null) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/api/totalattendeesOrganizer`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addAttendee = async (attendeeData: FormData, token: string | null) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/api/attendees`, attendeeData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        console.log(response);
        console.log("The response data for attendees is: ", response);
        return response.data;
    } catch (error) {
        throw error;
    }
};