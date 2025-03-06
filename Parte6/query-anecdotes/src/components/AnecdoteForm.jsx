import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: anecdoteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["anecdotes"]);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    if (content.length >= 5) {
      mutation.mutate(content);
      setContent("");
    } else {
      alert("Anecdote must be at least 5 characters long");
    }
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input
          name="anecdote"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
