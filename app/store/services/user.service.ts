import axiosInstance from "../../context/axiosInstance";
import { IUser } from "../../interfaces";

class UserService {
    constructor() {

    }

    async getLoggedUser(): Promise<IUser | null> {

        try {

            const {data}: {data:any} = await axiosInstance.get("users/private/me");
            window.localStorage.setItem("user",JSON.stringify(data.data));
            return data.data as IUser
            
        } catch (error) {
            return null;
        }
    }
}


const userService: UserService = new UserService();

export { userService }
