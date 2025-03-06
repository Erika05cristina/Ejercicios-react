import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [], 
  reducers: {
    setAnecdotes(state, action) {
      return action.payload; 
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setAnecdotes, addAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll();
  dispatch(setAnecdotes(anecdotes));
};

export const createAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await anecdoteService.create(content);
  dispatch(addAnecdote(newAnecdote));
};

export const voteAnecdote = (id) => async (dispatch, getState) => {
  const anecdoteToVote = getState().anecdotes.find(a => a.id === id);
  const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 };

  const newAnecdote = await anecdoteService.update(id, updatedAnecdote);
  dispatch(setAnecdotes(getState().anecdotes.map(a => a.id !== id ? a : newAnecdote)));
};

export default anecdoteSlice.reducer;
