import { useState, useEffect  } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import PersonList from "./PersonList";
import axios from "axios";


const App = () => {
  
 
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber, id: persons.length + 1 };
    //Con el post envia al servidor la nueva persona y la agrega al array de personas 
    axios.post("http://localhost:3001/persons", newPerson).then((response) => {
      setPersons([...persons, response.data]);
      setNewName("");
      setNewNumber("");
    });
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter search={search} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <PersonList persons={personsToShow} />
    </div>
  );
};

export default App;
