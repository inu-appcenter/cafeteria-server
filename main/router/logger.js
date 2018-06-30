const caller = require('caller');
const util = require('util');
const mysql = require('./mysql.js');
const moment = require('moment');
const winston = require('winston');
const fs = require('fs');
const request = require('request');
const lineReader = require('reverse-line-reader');
const token = require('../config.js').TELEGRAM_TOKEN;
const chat_id = require('../config.js').CHAT_ID;
const path = require('path');

const logDir = 'public/log';
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}
if (!fs.existsSync(logDir + '/info')) {
	fs.mkdirSync(logDir + '/info');
}
if (!fs.existsSync(logDir + '/error')) {
	fs.mkdirSync(logDir + '/error');
}
if (!fs.existsSync(logDir + '/debug')) {
	fs.mkdirSync(logDir + '/debug');
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const loggerSet = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			name: 'info-console',
			timestamp: tsFormat,
			level: 'info'
		}),
		// new (winston.transports.Console)({
		// 	name: 'error-console',
		// 	timestamp: tsFormat,
		// 	level: 'error'
		// }),
		// new (winston.transports.Console)({
		// 	name: 'debug-console',
		// 	timestamp: tsFormat,
		// 	level: 'debug'
		// }),
		new (require('winston-daily-rotate-file'))({
			name: 'info',
			level: 'info',
			filename: `${logDir}/info/log`,
			timestamp: tsFormat,
			dateformat: 'yyyy-MM-dd',
			maxsize:5000000,
			prepend: true,
		}),
		new (require('winston-daily-rotate-file'))({
			name: 'error',
			level: 'error',
			filename: `${logDir}/error/log`,
			timestamp: tsFormat,
			dateformat: 'yyyy-MM-dd',
			maxsize:5000000,
			prepend: true,
		}),
		new (require('winston-daily-rotate-file'))({
			name: 'debug',
			level: 'debug',
			filename: `${logDir}/debug/log`,
			timestamp: tsFormat,
			dateformat: 'yyyy-MM-dd',
			maxsize:5000000,
			prepend: true,
		})
	]
});

function logger(type, text, func){
	let path = caller().replace(/.*\/(.*?).js/gi, '$1');
	let message = util.format('[%s%s]',path, func ? '/'+func.name : '') + ' ' + text;
	if(type == 'telegram'){
		request.post('https://api.telegram.org/bot'+token+'/sendMessage', {form:{chat_id:chat_id, text:'cafeteria:'+message}});
	}
	else if(type == 'error'){
		request.post('https://api.telegram.org/bot'+token+'/sendMessage', {form:{chat_id:chat_id, text:'cafeteria:'+message}});
		loggerSet.log(type, message);
	}
	else {
		if(type =='error-only') type = 'error';
		loggerSet.log(type, message);
	}
}

function readReverse(filename, cb){
	var str = "";
	lineReader.eachLine(filename , function(line) {
		str += line + '\n';
	}).then(function () {
		cb(str);
	});
}

function storePaymentHistory(){

	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir);
	}
	if (!fs.existsSync(logDir + '/payment')) {
		fs.mkdirSync(logDir + '/payment');
	}
	mysql.customQuery('select * from payment', function(rows){
		var objs = moment().format('YYYY-MM-DD HH:mm:ss') + '\n';
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			objs += util.format('barcode : %s, cafecode : %s, menu : %s, time : %s, timestamp : %s\n', row.barcode, row.cafecode, row.menu, row.time, row.timestamp);
		}

		fs.writeFile(logDir + '/payment/' + moment().format('YYYY-MM-DD') + '.log', objs, function(err){
			if(!err){
				logger('info', 'Payment Table Data Stored', storePaymentHistory);
				mysql.customQuery('truncate payment');
				return;
			}
			else {
				logger('error', err, storePaymentHistory);
				return;
			}
		});
	});
}
function clearCurrentLog(){
	var timestamp = moment().format('YY-MM-DD.HH:mm:ss');
	fs.copyFile('std.text', path.join(__dirname, 'log', timestamp + '_std.text'), (err) => {
		if(err){
			logger('error-only', 'copy std.text error');
		}
		else {
			fs.truncate(path.join(__dirname, 'std.text'), 0, (err) =>{
				if(err){
					logger('error-only', 'truncate std.text error');
				}
			});
		}
	});

	fs.copyFile('err.text', path.join(__dirname, 'log', timestamp + '_err.text'), (err) => {
		if(err){
			logger('error-only', 'copy err.text error');
		}
		else {
			fs.truncate(path.join(__dirname, 'err.text'), 0, (err) =>{
				if(err){
					logger('error-only', 'truncate err.text error');
				}
			});
		}
	});
}

module.exports = logger;
module.exports.clearCurrentLog = clearCurrentLog;
module.exports.readReverse = readReverse;
module.exports.storePaymentHistory = storePaymentHistory;
