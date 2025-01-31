import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((response) => response.data);
};

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const removePerson = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error al eliminar persona:", error);
      throw error;
    });
};

const update = (id, updatedPerson) => {
  return axios
    .put(`${baseUrl}/${id}`, updatedPerson)
    .then(response => response.data);
};
export default { create, getAll, removePerson, update };
