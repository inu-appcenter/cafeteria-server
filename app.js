global.__base = __dirname + '/';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const cafeteria = require(__base + 'routes/cafeteria.js');

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(9999);
