import Person from "./Person";

const PersonList = ({ persons, handleDelete }) => {
  return (
    <ul className='person-list'>
      {persons.map((person) => (
        <Person key={person.id} person={person} handleDelete={handleDelete} />
      ))}
    </ul>
  );
};


export default PersonList;
