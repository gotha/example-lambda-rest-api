
const fs = require('fs');
const serverless = require('serverless-http');
const express = require('express')

const app = express()
app.use(express.json())

var data = []

const loadData = () => {
  return new Promise((resolve, reject) => {
    if (data.length > 0) {
      console.log("reusing data");
      return resolve()
    }
    console.log("reading data");
    fs.readFile("./data.json", "utf8", (err, content) => {
      if (err != null) {
        return reject(err)
      }
      data = JSON.parse(content)
      resolve()
    });

  })
}


app.get('/', function (_, res) {
  res.send("Example REST API");
});

app.get('/employee', function (_, res) {
  loadData()
    .then(() => {
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send("Error")
    })
})

app.get('/employee/:id', function (req, res) {
  loadData()
    .then(() => {
      const id = req.params.id || false;
      const employees = data.filter(i => i.id == id)
      if (employees.length == 0) {
        return res.status(404).send("Not found")
      }
      res.json(employees[0])
    })
    .catch(err => {
      console.log(err)
      res.status(500).send("Error")
    })
})


app.post('/employee', function (req, res) {
  loadData()
    .then(() => {
      const lastID = data.reduce((r, v) => (v.id > parseInt(r)) ? parseInt(v.id) : parseInt(r), 1)
      newEmployee = req.body
      newEmployee.id = lastID+1
      data.push(newEmployee)
      res.json(newEmployee)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send("Error")
    })
})

app.put('/employee/:id', function (req, res) {
  loadData()
    .then(() => {
      const id = req.params.id || false;
      for (i = 0; i < data.length; i++) {
        if (data[i].id == id) {
          newData = req.body
          newData.id = id
          data[i] = newData
          return res.json(newData)
        }
      }
      return res.status(404).send("Not found")

    })
    .catch(err => {
      console.log(err)
      res.status(500).send("Error")
    })
})


app.delete('/employee/:id', function (req, res) {
  loadData()
    .then(() => {
      const id = req.params.id || false;
      const newData = [];
      for (i = 0; i < data.length; i++) {
        if(data[i].id != id) {
          newData.push(data[i])
        }
      }
      data = newData
      return res.send("OK")

    })
    .catch(err => {
      console.log(err)
      res.status(500).send("Error")
    })
})

module.exports.handler = serverless(app);

//app.listen(3000, () => console.log("Server started"))
