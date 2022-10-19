var express = require('express');
var router = express.Router();

app.put("/rest/", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });
   
module.exports = router;