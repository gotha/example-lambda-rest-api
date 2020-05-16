const fs = require('fs');
const serverless = require('serverless-http');
const express = require('express');

const app = express();
app.use(express.json());

let data = [];

const loadData = () => {
  return new Promise((resolve, reject) => {
    if (data.length > 0) {
      console.log('reusing data');

      return resolve();
    }
    console.log('reading data');
    fs.readFile('./data.json', 'utf8', (err, content) => {
      if (err) {
        return reject(err);
      }
      data = JSON.parse(content);
      resolve();
    });

  });
};

app.use((_, res, next) => {
  loadData()
    .then(() => next())
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal server error');
    });
});

app.get('/', (_, res) => {
  res.send('Example REST API');
});

app.get('/employee', (_, res) => {
  res.json(data);
});

app.get('/employee/:id', (req, res) => {
  const id = req.params.id || false;
  const employees = data.filter(i => parseInt(i.id) === parseInt(id));
  if (employees.length === 0) {
    return res.status(404).send('Not found');
  }
  res.json(employees[0]);
});

app.post('/employee', (req, res) => {
  const lastID = data.reduce((r, v) => (parseInt(v.id) > parseInt(r)) ? parseInt(v.id) : parseInt(r), 1);
  const newEmployee = req.body;
  newEmployee.id = lastID+1;
  data.push(newEmployee);
  res.json(newEmployee);
});

app.put('/employee/:id', (req, res) => {
  const id = req.params.id || false;
  for (let i = 0; i < data.length; i++) {
    if (parseInt(data[i].id) === parseInt(id)) {
      const newData = req.body;
      newData.id = id;
      data[i] = newData;

      return res.json(newData);
    }
  }

  return res.status(404).send('Not found');
});

app.delete('/employee/:id', (req, res) => {
  const id = req.params.id || false;
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    if (parseInt(data[i].id) !== parseInt(id)) {
      newData.push(data[i]);
    }
  }
  data = newData;

  return res.send('OK');
});

module.exports.handler = serverless(app);

//app.listen(3000, () => console.log("Server started"))
