const logdir = 'etc';
const caller = require('caller');
const util = require('util');
const moment = require('moment');
const winston = require('winston');
const fs = require('fs');
const request = require('request');
const lineReader = require('reverse-line-reader');
const token = require('../config.js').TELEGRAM_TOKEN;
const chat_id = require('../config.js').CHAT_ID;

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
		new (winston.transports.Console)({
			name: 'error-console',
			timestamp: tsFormat,
			level: 'error'
		}),
    new (winston.transports.Console)({
      name: 'debug-console',
      timestamp: tsFormat,
      level: 'debug'
    }),
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

module.exports = logger;
module.exports.readReverse = readReverse;
