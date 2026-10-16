const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(morgan(
  function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ')
  }
));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/info', (request, response) => {
  response.send(`
    <p>Phone has info for ${persons.length} people<p>
    <p>${new Date()}</p>
    `)
  
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);
  if(person) response.json(person);
  else response.status(404).end();
  
})
app.post('/api/persons', (request, response) => {
  
  const reqBody = request.body;
  console.log(reqBody);
  
  if(!reqBody.name && !reqBody.number){
    return response.status(422).json({"error": "person name or number do not exists"});
    
  }

  const checkPerson = persons.find(p => p.name === reqBody.name);
  if(checkPerson){
    return  response.status(409).json({"error": "person name already exists"});
  }

  const newPerson = {
    "id": Math.random(),
    "name": reqBody.name,
    "number": reqBody.number,
  };

  persons.push(newPerson);

  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(p => p.id !== id);

  
  response.status(204).end()
})



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})