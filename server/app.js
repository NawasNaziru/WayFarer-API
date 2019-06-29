import dotenv from 'dotenv';
dotenv.load();
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Debug from 'debug';
const debug = Debug('Express4');
import pg from 'pg';

import  router from './routes/index';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'UI')));

app.use('/api/v1', router);

var config = {
  user: 'postgres',
  database: 'Banka', 
  password: 'zazaa1992', 
  port: 5432, 
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
	
var pool = new pg.Pool(config);
 
app.get('/pool', (req, res, next) => {
    pool.connect((err,client,done) => {
       if(err){
           console.log("not able to get connection due to " + err);
           res.status(400).send(err);
           return;
       } 
       client.query('SELECT * FROM student where id = $1', [1],(err,result) => {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

app.use((req, res) => {
  
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// Catch unauthorised errors
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ message: `${err.name}: ${err.message}` });
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

// start server

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  debug('Express server listening on port ' + server.address().port);
 console.log('Express server listening on localhost:3000');
});

export default app;
