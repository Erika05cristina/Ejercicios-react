import { useState, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import PersonList from "./PersonList";
import comunicacion from "./comunicacion";
import "./index.css";
import Notification from "./Notification";



const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    comunicacion
      .getAll()
      .then((initialPersons) => setPersons(initialPersons))
      .catch((error) => console.error("Error al obtener datos:", error));
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} ya está en la agenda, ¿quieres actualizar su número?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        comunicacion
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Error al actualizar:", error);

            if (error.response && error.response.status === 404) {
              setErrorMessage(`La persona '${newName}' ya fue eliminada del servidor`);
              setPersons(persons.filter((person) => person.id !== existingPerson.id));
            } else {
              setErrorMessage(`Error al actualizar a ${newName}`);
            }

            setTimeout(() => setErrorMessage(null), 5000);
          });

        return;
      } else {
        return;
      }
    }

    const newPerson = { name: newName, number: newNumber };

    comunicacion
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons([...persons, returnedPerson]);
        setNewName("");
        setNewNumber("");

        setNotification(`Se agregó ${newName}`);
        setTimeout(() => setNotification(null), 5000);
      })
      .catch((error) => {
        console.error("Error al agregar persona:", error);
        setErrorMessage(`No se pudo agregar a ${newName}`);
        setTimeout(() => setErrorMessage(null), 5000);
      });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${name}?`)) {
      comunicacion
        .removePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.error("Error al eliminar persona:", error);
          setErrorMessage(`No se pudo eliminar a ${name}`);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type="success" />
      <Notification message={errorMessage} type="error" />

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
