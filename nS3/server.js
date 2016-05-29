'use strict';

const express = require('express');

// Constants
const PORT = 8787;

// App
const app = express();
app.get('/rec', function (req, res) {
  res.send('Here comes the recommendation ...\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);