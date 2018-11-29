const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 5000;
const wixURL = 'https://www.cognitzen.com/_functions/user';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users', (req, res) => {
  axios.get(wixURL)
    .then((result) => {
      // const users = result.data.items;
      // return users.find(el => el.email === userEmail);
      res.send(result.data.items)
    })
    .catch((err) => {
      res.send({ err: "Couldn't fetch users from WIX API" });
    })
});

app.listen(port, () => console.log(`Listening on port ${port}`));
