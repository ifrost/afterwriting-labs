var express = require('express');
var app = express();
app.use(express.static('.'));
app.listen(8000);

console.log('Server is running on localhost:8000');