import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    console.log('button clicked', event.target);

    const newPerson = { name: newName };
    setPersons([...persons, newPerson]);
    setNewName('');
  } 

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
          value={newName}
          onChange={handleNameChange}
          />

        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      
      <h2>Names</h2>
      <ul>
        {persons.map(person => <li key={person.name}>{person.name}</li>)} 
      </ul>
      
    </div>
  )
}

export default App