const express = require('express');
const cors = require('cors')
const path = require('path');
const scraper = require('./scraper')
const app = express();

app.use(cors());
// Your static pre-build assets folder
app.use(express.static(path.join(__dirname, 'build')));
//Home page
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, 'build'));
});

//API route
app.get('/api/search', (req, res) => {
    const ch = req.query.ch ? req.query.ch.split(',') : [''];
    scraper.youtube(ch[0], req.query.q, req.query.key, req.query.pageToken)
        .then(x => res.json(x))
        .catch(e => res.send(e));
});

app.listen(process.env.PORT || 8080, function () {
  console.log('Listening on port 8080');
});

module.exports = app;




