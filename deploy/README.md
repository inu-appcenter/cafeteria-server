# Deploy

This documentation describes the steps you need to take to run the server.

## Requirements

You need these packages installed.

- `nodejs` with version >= 12
- `npm` with version >= 6
- `MySQL server` with version >= 5

## Configure DB

### Set default character set

Add below lines to mysql config file (`/etc/mysql/mysql.conf.d/mysqld.cnf` or other).

~~~
collation-server        = utf8_unicode_ci
init-connect            = 'SET NAMES utf8'
character-set-server    = utf8
~~~

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

### Timezone(optional)

Set default timezone to `+09:00`.

~~~
sudo vi /etc/my.cnf
~~~

Add `default-time-zone='+9:00'` to `[mysqld]` section.

## Configure app

Add below lines to `~/env`:

**Replace values with your owns.**

~~~
NODE_ENV=production
PORT=[any port number you want]
JWT_SECRET_KEY=[any string that is logn enough]
DB_USERNAME=[username of your DB]
DB_PASSWORD=[password of your DB]
LOGIN_KEY=['Appcenter the greatest' in korean]
~~~

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
$ sudo cp deploy/cafeteria.service /etc/systemd/system/
~~~

> The service file cafeteria.service is written in assumption that the user name is `potados` and the project directory is `/home/potados/cafeteria-server`.    
You need to modify it yourself on different configurations.

Enable the service.

~~~
sudo systemctl enable cafeteria
~~~

### Run

Start the server.

~~~
sudo systemctl start cafeteria
~~~

### Check

To check if the server is running,

~~~
sudo systemctl status cafeteria
~~~

### Others

~~~
sudo systemctl stop cafeteria # stop the service
sudo systemctl restart cafeteria # restart the service
sudo systemctl disable cafeteria # disable the service
~~~

You can add commands above to your `.bashrc`.

~~~
alias enable='sudo systemctl enable cafeteria'
alias disable='sudo systemctl disable cafeteria'

alias start='sudo systemctl start cafeteria'
alias restart='sudo systemctl restart cafeteria'
alias stop='sudo systemctl stop cafeteria'
alias status='sudo systemctl status cafeteria'
~~~
