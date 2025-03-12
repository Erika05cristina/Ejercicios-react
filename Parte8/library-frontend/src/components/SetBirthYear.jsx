import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState(authors[0]?.name || '');
  const [born, setBorn] = useState('');

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error('Error al actualizar el año de nacimiento:', error.graphQLErrors);
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    await editAuthor({ variables: { name, setBornTo: Number(born) } });

    setBorn('');
  };

  return (
    <div>
      <h3>Set Birth Year</h3>
      <form onSubmit={submit}>
        <div>
          <label>Author</label>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Born</label>
          <input type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  );
};

export default SetBirthYear;
