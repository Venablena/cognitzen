const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  axios.get('https://www.cognitzen.com/_functions/user')
    .then((result) => {
      res.send(result.data.items)
    })
    .catch((err) => {
      res.send({err: "Couldn't fetch users from WIX API"});
    })
});

app.listen(port, () => console.log(`Listening on port ${port}`));
