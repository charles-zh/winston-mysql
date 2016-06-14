# winston-mysql
MySQL transport plugin for winston logger

#### <https://github.com/charles-zh/winston-mysql> #

introduction
------------
This MySQL transport module is a plugin for winston logger running in node.js.


synopsis
--------

```js
    var options_default = {
      host     : 'localhost',
      user     : 'logtest',
      password : 'log*test*pass',
      database : 'logtest',
      table    : 'sys_logs_default'
    };

    var logger = new (winston.Logger)({
    transports: [
      new winston_mysql(options_default)
    ]
    });
    var msg = 'test message');
    logger.info('first log', {message: msg});
    
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



