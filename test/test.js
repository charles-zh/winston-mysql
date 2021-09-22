const winston = require('winston');
const assert = require('assert');
const expect = require('chai').expect;
const mysql = require('mysql2/promise');
const winstonMysql = require('../lib/mysql_transport');


//test config for database, you can change it with your configuration.
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

// get total log numbers
const getLogCount = async (options) => {

    try {
        // create the connection to database
        const connection = await mysql.createConnection({
            host: options.host,
            user: options.user,
            password: options.password,
            database: options.database
        });

        // simple query
        const [rows, fields] = await connection.query('SELECT COUNT(*) as num FROM `' + options.table +'`');
        return rows[0].num;

    } catch (err) {
        console.log(err.message);
        return 0;
    }
}

describe('Test MySQL transport for winston', async function () {
    await describe('Log to database should pass', async function () {

        let beforeCount = 0;
        before(async function() {
            beforeCount = await getLogCount(options_default);
            console.log(`before test numbers: ${beforeCount}`);
        });

        await it('always pass', async function (done) {

            try {
                const logger = winston.createLogger({
                    level: 'debug',
                    format: winston.format.json(),
                    defaultMeta: { service: 'user-service' },
                    transports: [
                        new winston.transports.Console({
                            format: winston.format.simple(),
                        }),
                        new winstonMysql(options_default)
                    ],
                });
                const rnd = Math.floor(Math.random() * 1000);
                const msg = `test message ${rnd}`;

                logger.debug(msg, {message: msg, type: 'demo'});
                logger.error(msg, {message: msg, type: 'demo'});
                logger.info(msg, {message: msg, type: 'demo'});
                logger.warn(msg, {message: msg, type: 'demo'});

                done();

            } catch (err) {
                console.log(err.message);
                done(err);
                assert(false);
            }

        });

        after(async function() {
            const afterCount = await getLogCount(options_default);
            console.log(`after test numbers: ${afterCount}`);
            expect(afterCount - beforeCount).to.be.equal(4);
        });

    });

    await describe('Log to database should pass', async function () {
        let beforeCount = 0;
        before(async function() {
            beforeCount = await getLogCount(options_custom);
            console.log(`before test numbers: ${beforeCount}`);
        });

        await it('custom table fields should always pass', async function (done) {
            try {
                const logger = winston.createLogger({
                    level: 'debug',
                    format: winston.format.json(),
                    defaultMeta: { service: 'user-service' },
                    transports: [
                        new winston.transports.Console({
                            format: winston.format.simple(),
                        }),
                        new winstonMysql(options_custom)
                    ],
                });
                const rnd = Math.floor(Math.random() * 1000);
                const msg = `test message ${rnd}`;

                logger.debug(msg, {message: msg, type: 'demo'});
                logger.error(msg, {message: msg, type: 'demo'});
                logger.info(msg, {message: msg, type: 'demo'});
                logger.warn(msg, {message: msg, type: 'demo'});

                done();

            } catch (err) {
                console.log(err.message);
                done(err);
                assert(false);
            }

        });

        after(async function() {
            const afterCount = await getLogCount(options_custom);
            console.log(`after test numbers: ${afterCount}`);
            expect(afterCount - beforeCount).to.be.equal(4);
        });

    });

    await describe('Log to database should pass', async function () {
        let beforeCount = 0;
        before(async function() {
            beforeCount = await getLogCount(options_json);
            console.log(`before test numbers: ${beforeCount}`);
        });

        await it('custom table fields using json format always pass', async function (done) {

            try {
                const logger = winston.createLogger({
                    level: 'debug',
                    format: winston.format.json(),
                    defaultMeta: { service: 'user-service' },
                    transports: [
                        new winston.transports.Console({
                            format: winston.format.simple(),
                        }),
                        new winstonMysql(options_json)
                    ],
                });
                const rnd = Math.floor(Math.random() * 1000);
                const msg = `test message ${rnd}`;

                logger.debug(msg, {message: msg, type: 'demo'});
                logger.error(msg, {message: msg, type: 'demo'});
                logger.info(msg, {message: msg, type: 'demo'});
                logger.warn(msg, {message: msg, type: 'demo'});
                done();

            } catch (err) {
                console.log(err.message);
                done(err);
                assert(false);
            }

        });

        after(async function() {
            const afterCount = await getLogCount(options_json);
            console.log(`after test numbers: ${afterCount}`);
            expect(afterCount - beforeCount).to.be.equal(4);
        });

    });
});
