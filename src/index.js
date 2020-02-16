import '@babel/polyfill';

import express from 'express';
import bodyParser from 'body-parser';
import Elasticsearch from 'elasticsearch';
import errorHandler from './middlewares/error-handler';
import injectHandlerDependencies from './utils/inject-handler-dependencies';
import createUser from './handlers/users/create';

const client = new Elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});
// import http from 'http';

// const requestHandler = (req, res) => {
//   // if (req.method === 'POST' && req.url === '/users') {
//   //   res.statusCode = 400;
//   //   res.end();
//   //   return;
//   // }
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello World!');
// };
// const server = http.createServer(requestHandler);
// server.listen(9000);

const app = express();
app.use(bodyParser.json({ limit: 1e6 }));
// app.post('/users', (req, res) => {
//   if (req.headers['content-length'] === '0') {
//     res.status(400);
//     res.set('Content-Type', 'application/json');
//     res.json({
//       message: 'Payload should not be empty',
//     });
//     return;
//   }
//   if (req.headers['content-type'] !== 'application/json') {
//     res.status(415);
//     res.set('Content-Type', 'application/json');
//     res.json({
//       message: 'The "Content-Type" header must always be "application/json"',
//     });
//   }
//   client.index({
//     index: 'hobnob',
//     type: 'user',
//     body: req.body,
//   }).then((result) => {
//     res.status(201);
//     res.set('Content-Type', 'text/plain');
//     res.send(result._id);
//   }).catch(() => {
//     res.status(500);
//     res.set('Content-Type', 'application/json');
//     res.json({ message: 'Internal Server Error' });
//   });
// });

app.use(errorHandler);
app.post('/users', injectHandlerDependencies(createUser, client));

app.listen(process.env.SERVER_PORT);

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API server listening on port ${process.env.SERVER_PORT}!`);
});
