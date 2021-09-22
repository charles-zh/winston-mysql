# winston-mysql
MySQL transport plugin for winston@3.x logger

#### <https://github.com/charles-zh/winston-mysql> #

introduction
------------
This MySQL transport module is a plugin for winston@3.x logger running in node.js.

Current version plugin supports Winston@3.x.

synopsis
--------

Please check test/test.js for demo usage

```js
const options_default = {
    host: 'localhost',
    user: 'logger',
    password: 'logger*test',
    database: 'WinstonTest',
    table: 'sys_logs_default'
};

//custom log table fields
const options_custom = {
    host: 'localhost',
    user: 'logger',
    password: 'logger*test',
    database: 'WinstonTest',
    table: 'sys_logs_custom',
    fields: {level: 'mylevel', meta: 'metadata', message: 'source', timestamp: 'addDate'}
};

//meta json log table fields
const options_json = {
    host: 'localhost',
    user: 'logger',
    password: 'logger*test',
    database: 'WinstonTest',
    table: 'sys_logs_json'
};

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // or use: options_custom / options_json
        new winstonMysql(options_default),
    ],
});

const rnd = Math.floor(Math.random() * 1000);
const msg = `test message ${rnd}`;

logger.debug(msg, {message: msg, type: 'demo'});
logger.error(msg, {message: msg, type: 'demo'});
logger.info(msg, {message: msg, type: 'demo'});
logger.warn(msg, {message: msg, type: 'demo'});



```

installation
------------
You should create a table in the database first.

Demos:
```SQL

 CREATE TABLE `WinstonTest`.`sys_logs_default` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` VARCHAR(2048) NOT NULL,
 `meta` VARCHAR(2048) NOT NULL,
 `timestamp` DATETIME NOT NULL,
 PRIMARY KEY (`id`));
 
 # or
 CREATE TABLE `WinstonTest`.`sys_logs_custom` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `mylevel` VARCHAR(16) NOT NULL,
 `source` VARCHAR(1024) NOT NULL,
 `metadata` VARCHAR(2048) NOT NULL,
 `addDate` DATETIME NOT NULL,
 PRIMARY KEY (`id`));
 
```
If you already have the log table, you can set custom fields for this module.

```js
//custom log table fields
const options_custom = {
    host: 'localhost',
    user: 'logger',
    password: 'logger*test',
    database: 'WinstonTest',
    table: 'sys_logs_custom',
    fields: {level: 'mylevel', meta: 'metadata', message: 'source', timestamp: 'addDate'}
};

```

You can use the JSON format meta field in MySQL database table. 
That is great for searching & parsing, but it only supports MySQL 5.7+.

```
 CREATE TABLE `WinstonTest`.`sys_logs_json` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` VARCHAR(2048) NOT NULL,
 `meta` JSON NOT NULL,
 `timestamp` DATETIME NOT NULL,
 PRIMARY KEY (`id`));

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
Install docker & docker-compose.
Enter test directory and run:

```
docker-compose up

```

Then:

Open browser and visit: 127.0.0.1:8080. 

Login using user & password in docker-compose.yml

Create Tables using SQL commands above.

```sh
$ npm run test
```

authors
-------

charles-zh



