import React from "react";

const UserList = ({ usuarios }) => {
  console.log("Usuarios recibidos en UserList:", usuarios); 

  if (!usuarios || usuarios.length === 0) {
    return <p>No hay usuarios disponibles.</p>;
  }

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.name} ({usuario.username})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
