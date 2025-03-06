import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', time: 0 },
  reducers: {
    setNotification(state, action) {
      state.message = action.payload.message;
      state.time = action.payload.time;
    },
    clearNotification(state) {
      state.message = '';
      state.time = 0;
    },
  },
});

export const setTimedNotification = (message, time) => {
  return (dispatch) => {
    dispatch(setNotification({ message, time }));

    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000); 
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
