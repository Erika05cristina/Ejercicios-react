import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "./components/NotificationContext";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import anecdoteService from "./services/anecdotes";

const App = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const {
    data: anecdotes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: anecdoteService.getAll,
  });

  const voteMutation = useMutation({
    mutationFn: anecdoteService.update,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries(["anecdotes"]);
      dispatch({ type: "SHOW", payload: `You voted for '${updatedAnecdote.content}'` });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    },
  });

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    voteMutation.mutate(updatedAnecdote);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes} votes</div>
          <button onClick={() => handleVote(anecdote)}>vote</button>
        </div>
      ))}
    </div>
  );
};

export default App;
