import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const UserList = ({ usuarios }) => {
  console.log("Usuarios recibidos en UserList:", usuarios); 

  if (!usuarios || usuarios.length === 0) {
    return <p>No hay usuarios disponibles.</p>;
  }

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {usuarios.map((usuario) => (
        <Card key={usuario.id} sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {usuario.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {usuario.blogs.length} blogs
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserList;
