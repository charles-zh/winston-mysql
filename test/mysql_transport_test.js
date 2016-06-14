/**
 * This is the test suit file for mysql_transport module
 */
var winston = require('winston');
var winston_mysql = require('../lib/mysql_transport');
var vows = require('vows');
var assert = require('assert');
var MySql = require('mysql');

//test config for database, you can change it with your configuration.
var options_default = {
  host     : 'localhost',
  user     : 'logtest',
  password : 'log*test*pass',
  database : 'logtest',
  table    : 'sys_logs_default'
};

//custom log table fields
var options_custom = {
  host     : 'localhost',
  user     : 'logtest',
  password : 'log*test*pass',
  database : 'logtest',
  table    : 'sys_logs_custom',
  fields   : { level: 'mylevel', meta: 'metadata', message: 'source', timestamp: 'addDate'}
};

// Create a Test Suite
vows.describe('Test winston mysql transports').addBatch({
  'use default table fields': {
    topic: function () {

      winston.add(winston_mysql, options_default);

      var msg = 'test' + parseInt(Math.random() * 1000);
      winston.info(msg, {message: msg});
      return msg;
    },

    'check mysql table': function (msg) {
      //check database when finished
      setTimeout(function () {

        var connection = MySql.createConnection(options_default);
        var selectSQL = 'select message from `'+ options_default.table +'` where `message`=?';
        connection.query(selectSQL, [msg], function (err, rows) {
          assert.isNull(err);
          if(err){
            return;
          }
          assert.isArray(rows);
          assert.isNotZero(rows.length);
        });

        connection.end(function (err) {
          if(err){
            throw err;
          }
        });

      }, 2000);

    }
  }
}).addBatch({
  'use default table fields & different winston initialized object': {
    topic: function () {
      var logger = new (winston.Logger)({
        transports: [
          new winston_mysql(options_default)
        ]
      });
      var msg = 'test' + parseInt(Math.random() * 1000);
      logger.info(msg, {message: msg});
      return logger;
    },

    'check mysql table': function (logger) {
      //check database when finished
      logger.on('logging', function (transport, level, msg, meta) {

        if(transport != 'mysql'){
          return;
        }

        var connection = MySql.createConnection(options_default);
        var selectSQL = 'select message from `'+ options_default.table +'` where `message`=?';
        connection.query(selectSQL, [msg], function (err, rows) {
          assert.isNull(err);
          if(err){
            return;
          }
          assert.isArray(rows);
          assert.isNotZero(rows.length);
        });

        connection.end(function (err) {
          if(err){
            throw err;
          }
        });

      });

    }
  }
}).addBatch({
  'use custom table fields': {
    topic: function () {
      var logger = new (winston.Logger)({
        transports: [
          new winston_mysql(options_custom)
        ]
      });
      var msg = 'test' + parseInt(Math.random() * 1000);
      logger.info(msg, {message: msg});
      return logger;
    },

    'check mysql table': function (logger) {
      //check database when finished
      logger.on('logging', function (transport, level, msg, meta) {

        if(transport != 'mysql'){
          return;
        }

        var connection = MySql.createConnection(options_custom);
        var msgField = options_custom.fields.message;
        var selectSQL = 'select '+ msgField +' from `'+ options_custom.table +'` where `'+ msgField +'`=?';
        connection.query(selectSQL, [msg], function (err, rows) {
          assert.isNull(err);
          if(err){
            return;
          }
          assert.isArray(rows);
          assert.isNotZero(rows.length);
        });

        connection.end(function (err) {
          if(err){
            throw err;
          }
        });

      });

    }
  }
}).run(); // Run it

