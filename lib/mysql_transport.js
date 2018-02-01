/**
 * This is a MySQL transport module for winston.
 * https://github.com/winstonjs/winston
 * Notice: User should create a log table in MySQL first,
 * the default table fields are 'level', 'meta', 'message', 'timestamp'. But you can
 * use your custom table fields by setting: options.fields.
 * Example: options.fields = { level: 'mylevel', meta: 'metadata', message: 'source', timestamp: 'addDate'}
 * Two demo tables:
 * 
 CREATE TABLE `logtest`.`sys_logs_default` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` VARCHAR(512) NOT NULL,
 `meta` VARCHAR(1024) NOT NULL,
 `timestamp` DATETIME NOT NULL,
 PRIMARY KEY (`id`));
 *
 CREATE TABLE `logtest`.`sys_logs_custom` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `mylevel` VARCHAR(16) NOT NULL,
 `source` VARCHAR(512) NOT NULL,
 `metadata` VARCHAR(512) NOT NULL,
 `addDate` DATETIME NOT NULL,
 PRIMARY KEY (`id`));
 */


var util = require('util'),
  winston = require('winston'),
  mysql = require('mysql');

/**
 * @constructor
 * @param {Object} options      Options for the MySQL
 * @param {String} options.user Database username
 * @param {String} options.database Database name
 * @param {String} options.table  Database table for the logs
 * @param {Object} **Optional** options.fields Log object, set custom fields for the log table
 * @param {Boolean} **Optional** options.unix Set to true if you want to log a unix timestamp value
 */
var MySQL = exports.MySQL = function (options) {
  "use strict";
  //Please visit https://github.com/felixge/node-mysql#connection-options to get default options for mysql module
  this.options = options || {};

  if(!options.user){
    throw new Error('The database username is required');
  }

  if(!options.database){
    throw new Error('The database name is required');
  }

  if(!options.table){
    throw new Error('The database table is required');
  }

  //check custom table fields
  if(!options.fields){

    this.options.fields = {};
    //use default names
    this.fields = {
      level : 'level',
      meta: 'meta',
      message : 'message',
      timestamp: 'timestamp'
    }

  }else{

    //use custom table field names
    this.fields = {
      level : this.options.fields.level,
      meta: this.options.fields.meta,
      message : this.options.fields.message,
      timestamp: this.options.fields.timestamp
    }

  }

  //Create a connection poll
  this.pool = mysql.createPool(this.options);

};

// Inherit from `winston.Transport`.
util.inherits(MySQL, winston.Transport);


/**
 * @method log called by winston when to log somethings
 * @param level {string} Level in winston
 * @param message {string} Message in winston
 * @param meta  {Object} JSON object in winston
 * @param callback {function} callback when finished
 */
MySQL.prototype.log = function(level, message, meta, callback) {
  "use strict";

  //save this
  var self = this;
  //run it in nextTick
  process.nextTick(function() {

    var pool = self.pool;

    pool.getConnection(function (err, connection) {

      if(err){
        return callback(err, null);
      }
      //connected
      //set log object
      var log = {};
      log[self.fields.level] = level;
      log[self.fields.message] = message;
      log[self.fields.meta] = JSON.stringify(meta);
      log[self.fields.timestamp] = !self.options.unix ? new Date() : new Date().getTime();

      //Save the log
      connection.query('INSERT INTO '+ self.options.table + ' SET ?', log, function(err, rows, fields) {
        if(err){
          return callback(err, null);
        }
        //finished
        connection.release();
        callback(null, true);
      });

    });

  });

};

winston.transports.MySQL = MySQL;
