# Deploy

This documentation describes the steps you need to take to run the server.

## Requirements

You need these packages installed.

- `nodejs` with version >= 12
- `npm` with version >= 6
- `MySQL server` with version >= 5

## Configure DB

### Start MySQL CLI

Open mysql command line client with following command:

~~~
$ mysql -uroot -p
~~~

Type your `root` password.

### Create DB

We will use `cafeteria` as a name of new DB.

~~~
mysql> CREATE DATABASE cafeteria;
~~~

Use that DB.

~~~
mysql> use cafeteria
~~~

### Create user

Create a new user by:

~~~
mysql> CREATE USER '[username]'@'localhost' IDENTIFIED BY '[password]';
~~~

Substitute `[username]` and `[password]` with your own settings.

For example:

~~~
mysql> CREATE USER 'potados'@'localhost' IDENTIFIED BY '1234';
~~~

### Grant privileges

Now we need to grant permissions of the `cafeteria` DB for the new user wee added.

~~~
mysql> GRANT ALL PRIVILEGES ON cafeteria.* TO '[username]'@'localhost';
~~~

### Change identification

We need to change the authentication method of the user to `mysql_native_password`.

This is to connect this app to the MySQL server.

~~~
mysql> ALTER USER '[username]'@'localhost' IDENTIFIED WITH mysql_native_password by '[password]';
~~~

### Create tables and records

Go to the project root and type:

~~~
mysql> source deploy/setup-db.sql
~~~

## Configure app

Copy `config/config.sample.js` to `config/config.js`.

Fill all empty keys.

## Run

Now all configurations are done.

### Install

Install node dependencies.

It is fully automatic.

~~~
npm install
~~~

### Test

You can run unit tests using this command:

~~~
npm test
~~~

### Set as service

Deploy this app as a service.

We will use `systemctl`.

At the project root, do the following:

~~~
$ mkdir -p ~/.config/systemd/user
$ cp deploy/cafeteria.service ~/.config/systemd/user
~~~

> The service file cafeteria.service is written in assumption that the user name is `potados` and the project directory is `/home/potados/cafeteria-server`.    
You need to modify it yourself on different configurations.

### Run

Start the server.

~~~
npm start
~~~

### Check

To check if the server is running,

~~~
npm run status
~~~
