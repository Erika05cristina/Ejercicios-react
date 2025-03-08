import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";   

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    }
  }
});

export const { setUsers } = usersSlice.actions;

export const initializeUsers = () => {
    return async (dispatch) => {
      try {
        console.log("Fetching users...");  
        const users = await usersService.getAll();
        console.log("Fetched users:", users);  
        dispatch(setUsers(users));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  };
  

export default usersSlice.reducer;
