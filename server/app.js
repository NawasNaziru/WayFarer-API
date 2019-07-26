import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Debug from 'debug';
const debug = Debug('Express4');

import router from './routes/index';
import helper from './controllers/helpers';

const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use('/api/v1', router);

app.use((req, res) => {
    helper.sendJSONresponse(res, 404, {
        status: 'error',
        error: 'No such API exist here!'
    })
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// Catch unauthorised errors e.g. due to altered token.

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
       helper.sendJSONresponse(res, 401, {
            status: 'error',
            error: 'Invalid token'
        });
    }
   else {
     next(err);
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
