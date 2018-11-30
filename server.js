const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const port = process.env.PORT || 5000;
const app = express();
const wixURL = 'https://www.cognitzen.com/_functions/user';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/users/:userEmail', (req, res) => {
//   const userEmail = req.params.userEmail;
app.get('/users/:userEmail', (req, res) => {
  const userEmail = req.params.userEmail;
  axios.get(wixURL)
    .then((result) => {
      const users = result.data.items;
      const existingUser = users.find(el => el.email === userEmail);
      res.send(existingUser);
    })
    .catch((err) => {
      res.send({ err: "Couldn't fetch users from Wix API" });
    })
});

app.post('/users', (req, res) => {
  axios.post(wixURL, JSON.stringify(req.body))
    .then((result) => {
      res.send(result.data);
    })
    .catch((err) => {
      res.send({ err: "Couldn't create a new user for Wix API" });
    })
});
//FOR DEPLOYMENT
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
