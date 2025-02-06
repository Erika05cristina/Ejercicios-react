require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("tiny"));
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));
const Person = require("./models/person");

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body;

  if (!number) {
    return response.status(400).json({ error: "Missing number" });
  }

  Person.findByIdAndUpdate(request.params.id, { number }, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Missing name or number" });
  }

  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(200).json({
          message: "Person already exists",
          id: existingPerson._id,
        });
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        });

        person
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  response.status(500).send({ error: "Internal Server Error" });
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
