import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import anecdoteService from "./services/anecdotes";

const App = () => {
  const queryClient = useQueryClient();

  const {
    data: anecdotes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: anecdoteService.getAll,
  });

  const mutation = useMutation({
    mutationFn: anecdoteService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["anecdotes"]);
    },
  });

  const handleVote = (id, currentVotes) => {
    const updatedAnecdote = { votes: currentVotes + 1 };
    mutation.mutate({ id, updatedAnecdote });
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
          <button onClick={() => handleVote(anecdote.id, anecdote.votes)}>
            vote
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
