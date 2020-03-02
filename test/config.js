module.exports = {

  // Logging settings.
  log: {
    ops: {
      interval: 60 * 1000, /* interval sampling ops event. */
    },
    file: {
      name: (name) => 'logs/test/test-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
    },
    timestamp: 'YYYY-MM-DD HH:mm:ss',
  },

};
