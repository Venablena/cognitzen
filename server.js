const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const axios = require('axios');
const port = process.env.PORT || 5000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

    // POST TO WIX DATABASE //
    // UrlFetchApp.fetch('https://www.cognitzen.com/_functions/user', {	"headers": {
    //   "Access-Control-Allow-Origin": "*",
		// 	"Content-Type": "application/json"
		// }});

server.get('/api/hello', (req, res) => {
  // axios.get('https://www.cognitzen.com/_functions/user')
  //   .then((result) => {
  //     console.log(result.data);
  //     //res.send(result)
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
  res.send({ express: 'Hello From Express' });
});

server.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

server.listen(port, () => console.log(`Listening on port ${port}`));


// , {	"headers": {
//   "Access-Control-Allow-Origin": "*",
//   "Content-Type": "application/json"
// }}
