const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine;

require('zone.js/dist/zone-node');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');

var hash;
fs.readdirSync(__dirname).forEach(file => {
  if (file.startsWith('main')) {
    hash = file.split('.')[1];
  }
});

const AppServerModuleNgFactory = require('./main.' + hash + '.bundle').AppServerModuleNgFactory;

const app = express();
const port = Number(process.env.PORT || 8080);

app.engine('html', ngExpressEngine({
  baseUrl: 'http://localhost:' + port,
  bootstrap: AppServerModuleNgFactory
}));


app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/../browser'));

app.use(compression());
app.use('/', express.static(path.join(__dirname, '/../browser'), {index: false}));


app.get('/*', function (req, res) {
  res.render('../dist/index', {
    req: req,
    // res: res
  });
});

app.listen(port, function() {
  console.log(`Listening at ${port}`);
});