import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';
import Select from 'react-select';

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error('Error al actualizar el año de nacimiento:', error.graphQLErrors);
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    if (!name || !born) {
      alert('Please select an author and provide a birth year');
      return;
    }
    await editAuthor({ variables: { name, setBornTo: Number(born) } });

    setBorn('');
    setName('');
  };

  const authorOptions = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <div>
      <h3>Set Birth Year</h3>
      <form onSubmit={submit}>
        <div>
          <label>Author</label>
          <Select
            options={authorOptions}
            value={authorOptions.find((option) => option.value === name)}
            onChange={(selectedOption) => setName(selectedOption.value)}
            placeholder="Select an author"
          />
        </div>
        <div>
          <label>Born</label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            placeholder="Enter birth year"
          />
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  );
};

export default SetBirthYear;
