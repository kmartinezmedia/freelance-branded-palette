require('dotenv').config();
const connect = require('connect');
const serveStatic = require('serve-static');
const app = connect();
var port;

if (process.env.NODE_ENV == "development") {
  port = process.env.DEVELOPMENT_PORT || 8000;
} else {
  port = process.env.PRODUCTION_PORT;
}

app.use(serveStatic(__dirname, {'index': ['index.html']}));

app.listen(port);