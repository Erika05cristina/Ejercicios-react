const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("tiny"));
const cors = require('cors')

app.use(cors())

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
 
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
  });

app.get("/info", (request, response) => {
    const date = new Date();
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`
    );
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);
  
    if (person) {
      response.json(person);
    } else {
      //response.status(404).end();
      response.send("Person not found");
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
  
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const person = request.body;

    if (!person.name || !person.number) {
        return response.status(400).json({ error: 'Falta el nombre o el número' });
    } else if (persons.some(p => p.name === person.name)) {
        return response.status(400).json({ error: 'El nombre ya existe en la agenda' });
    }
    
    const newId = Math.floor(Math.random() * 1000);  
    
    while (persons.some(p => p.id === newId)) {
        newId = Math.floor(Math.random() * 1000);   
    }

 
    const newPerson = { ...person, id: newId }; 
    persons.push(newPerson);
    response.json(newPerson);
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});