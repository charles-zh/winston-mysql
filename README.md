# winston-mysql
MySQL transport plugin for winston logger

#### <https://github.com/charles-zh/winston-mysql> #

introduction
------------
This MySQL transport module is a plugin for winston logger running in node.js.


synopsis
--------

```js
const winston = require('winston');
const MySQL = require('winston-mysql').MySQL;

// Create a newlogger
var logger = new winston.Logger();

// Define the logger options
const loggerOptions = {
  level: 'info', // If undefined the default is info
  host: 'localhost',
  user: 'logtest',
  password: 'log*test*pass',
  database: 'logtest',
  table: 'sys_logs_custom',
  unix: true, // If undefined the default is false
  fields: { level: 'level', meta: 'meta', message: 'type', timestamp: 'timestamp'}
};

// A MySQL transport
logger.add(winston.transports.MySQL, loggerOptions)

// Log an info level message
logger.info('first log', {message: 'test message'});
```

installation
------------
You should create a table in the database first.

Demos:
```SQL

CREATE TABLE `logtest`.`sys_logs_default` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` VARCHAR(512) NOT NULL,
 `meta` VARCHAR(1024) NOT NULL,
 `timestamp` DATETIME NOT NULL,
 PRIMARY KEY (`id`));

```
Change the timestamp type from `DATETIME` to `DOUBLE` if you would like to log a unix timestamp instead.

If you already have the log table, you can set custom fields for this module.
```js
//custom log table fields
var options_custom = {
  host     : 'localhost',
  user     : 'logtest',
  password : 'log*test*pass',
  database : 'logtest',
  table    : 'sys_logs_custom',
  fields   : { level: 'mylevel', meta: 'metadata', message: 'source', timestamp: 'addDate'}
};

```

Install via npm:

```sh
$ npm install winston-mysql
```

documentation
-------------

Head over to <https://github.com/charles-zh/winston-mysql>

run tests
-------------

```sh
$ node mysql_transport_test.js
```

authors
-------

charles-zh



