// This file is to expose its current directory name
// to modules who cannot access __dirname.
// Place this file at the same directory with
// this module who needs it.
//
// Use it like:
//  import expose from './expose';
// and:
//  expose.__dirname
// or:
//  const {__dirname} = expose
module.exports = {__dirname};
