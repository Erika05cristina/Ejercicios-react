import { useQuery } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import anecdoteService from "./services/anecdotes";

const App = () => {
  const {
    data: anecdotes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: anecdoteService.getAll, 
  });

  if (isLoading) {
    return <div>anecdote service not available due to problem in server</div>;
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
          <button onClick={() => console.log("vote")}>vote</button>
        </div>
      ))}
    </div>
  );
};

export default App;
