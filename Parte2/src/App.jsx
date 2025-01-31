import { useState, useEffect  } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import PersonList from "./PersonList";
import axios from "axios";
import comunicacion from "./comunicacion";


const App = () => {
  
 
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    comunicacion.getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);
  
  const addPerson = (event) => {
    event.preventDefault();
 
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
  
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} ya está en la agenda, ¿quieres actualizar su número?`
      );
  
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };
  
        comunicacion.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => 
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName("");
            setNewNumber("");
          })
          .catch(error => {
            console.error("Error al actualizar el número:", error);
            alert(`No se pudo actualizar el número de ${newName}`);
          });
  
        return;
      } else {
        return;  
      }
    }
  
    const newPerson = { name: newName, number: newNumber };
  
    comunicacion.create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
        setNewName("");
        setNewNumber("");
      })
      .catch(error => console.error("Error al agregar persona:", error));
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${name}?`)) {
      comunicacion.removePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => console.error("Error al eliminar persona:", error));
    }
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

      <PersonList persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
