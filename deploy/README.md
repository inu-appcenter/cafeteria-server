# Deploy

This documentation describes the steps you need to take to run the server.

## Requirements

You need these packages installed.

- `nodejs` with version >= 12
- `npm` with version >= 6
- `MySQL server` with version >= 5

## Configure DB

### Create DB

We will use `cafeteria` as a name of new DB.

~~~
CREATE DATABASE cafeteria;
~~~

### Create user

Open mysql command line client with following command:

~~~
$ mysql -uroot -p
~~~

Type your `root` password.

Once the mysql prompt is open, create a new user by:

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

### Configure DB

Open `config/seq-config.js`.

Modify keys `username` and `password` with those you used on the DB configuration.

### Configure crypto

Open `config/crypto-config.js`.

Change `key` with the one you received from the system administrator.

If you got nothing, mail me <potados99@gmail.com>.

### Configure auth

Open `config/auth-config.js`.

Change `cookie.password` to any string that has at least 32 characters.

### Configure server

Open `config/server-config.js`.

Edit `port` to what you want.

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

### Run

Start the server.

~~~
npm start
~~~
