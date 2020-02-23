global.__base = __dirname + '/';
global.__config = require(__base + 'config.js');

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const cafeteria = require(__base + 'routes/cafeteria.js');
const user = require(__base + 'routes/user.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/****************************************************************
 * Cafeteria
 ****************************************************************/
app.get('/cafeteria', cafeteria.handleCafeteriaRequest);
app.get('/cafeteria/:id', cafeteria.handleCafeteriaRequest);

/****************************************************************
 * Corner
 ****************************************************************/
app.get('/corner', cafeteria.handleCornerRequest);
app.get('/corner/:id', cafeteria.handleCornerRequest);

/****************************************************************
 * Menu
 ****************************************************************/
app.get('/menu', cafeteria.handleMenuRequest);

/****************************************************************
 * Login/out
 ****************************************************************/
app.post('/login', user.handleLoginRequest);
app.post('/logout', user.handleLogoutRequest);

/****************************************************************
 * Barcode
 ****************************************************************/
app.get('/barcode', user.handleGetBarcodeRequest);



app.listen(9999);
