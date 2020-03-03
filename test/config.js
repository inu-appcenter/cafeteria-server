module.exports = {

  sequelize: {
    database: 'cafeteria', /* cafeteria */
    username: 'hah',
    password: 'duh',
    host: 'host', /* localhost */
    dialect: 'mysql', /* mysql */
    logging: false,
  },

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

  menu: {
    url: '0',
    fetchInterval: 0,
  },

};
