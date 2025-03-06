import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [], 
  reducers: {
    setAnecdotes(state, action) {
      return action.payload; 
    },
    voteAnecdote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((n) => n.id === id);
      if (anecdoteToChange) {
        anecdoteToChange.votes += 1;
      }
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setAnecdotes, voteAnecdote, addAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll();
  dispatch(setAnecdotes(anecdotes));
};

export const createAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await anecdoteService.create(content);
  dispatch(addAnecdote(newAnecdote));
};

export default anecdoteSlice.reducer;
