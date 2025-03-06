import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "./NotificationContext";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.create,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries(["anecdotes"]);
      dispatch({ type: "SHOW", payload: `Anecdote '${newAnecdote.content}' added` });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    },
    onError: (error) => {
      dispatch({ type: "SHOW", payload: "Anecdote must be at least 5 characters long" });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
