// import 'zone.js/dist/zone-node';

// import * as express from 'express';
// import { join } from 'path';

// // Express server
// const app = express();

// const PORT = process.env.PORT || 4200;
// const DIST_FOLDER = join(process.cwd(), 'dist/moltonbrown');

// // * NOTE :: leave this as require() since this file is built Dynamically from webpack
// const {
//   AppServerModuleNgFactory,
//   LAZY_MODULE_MAP,
//   ngExpressEngine,
//   provideModuleMap,
// } = require('./dist/moltonbrown/main');

// app.engine(
//   'html',
//   ngExpressEngine({
//     bootstrap: AppServerModuleNgFactory,
//     providers: [provideModuleMap(LAZY_MODULE_MAP)],
//   })
// );

// app.set('view engine', 'html');
// app.set('views', DIST_FOLDER);

// app.get(
//   '*.*',
//   express.static(DIST_FOLDER, {
//     maxAge: '1y',
//   })
// );

// // All regular routes use the Universal engine
// app.get('*', (req, res) => {
//   res.render('index', { req });
// });

// // Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node server listening on http://localhost:${PORT}`);
// });








// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import { REQUEST } from '@nguniversal/express-engine/tokens';

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import 'localstorage-polyfill';

const domino = require("domino");
const fetch = require('node-fetch');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
export const app = express();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'moltonbrown', 'index.html')).toString();


const win = domino.createWindow(template);

function setDomTypes() {
  // Make all Domino types available as types in the global env.
  Object.assign(global, domino['impl']);
  (global as any)['KeyboardEvent'] = domino['impl'].Event;
}

setDomTypes();

global["window"] = win;
global["document"] = win.document;
global['DOMTokenList'] = win.DOMTokenList;
global['Node'] = win.Node;
global['Text'] = win.Text;
global['HTMLElement'] = win.HTMLElement;
global['navigator'] = win.navigator;
global['MutationObserver'] = getMockMutationObserver();

function getMockMutationObserver() {
  return class {
    observe(node, options) {}

    disconnect() {}

    takeRecords() {
      return [];
    }
  };
}

global["Headers"] = fetch.Headers;
global['localStorage'] = localStorage;
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/moltonbrown-server/main');

app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP),
      {
        provide: REQUEST,
        useValue: options.req, //Provides the request to angular
      },
    ]
  }).then(html => {
    callback(null, html);
  });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'moltonbrown'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'moltonbrown')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  //res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
  global['navigator'] = req['headers']['user-agent'];
  res.setHeader('Cache-Control', 'max-age=0, private, must-revalidate');
  res.render(join(DIST_FOLDER, 'moltonbrown', 'index.html'), 
  { req }, 
  (err: Error, html: string) => {
    if(res.statusCode != 404 )
    res.status(html ? 200 : 500).send(html || err.message);
  }
  );
});

// If we're not in the Cloud Functions environment, spin up a Node server
if (!process.env.FUNCTION_NAME) {
  // Start up the Node server
  app.listen(PORT, () => {
      console.log(`Node Express server listening on http://localhost:${PORT}`);
  });
}