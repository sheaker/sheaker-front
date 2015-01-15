
## Installation

Simply run this following command in the api directory to install dependencies

```shell
composer install
```

Edit the /etc/hosts an add this line

```
127.0.0.1 api.sheaker.perso.dev
```

Create a new file something like /etc/apache2/site-avalaible/api.sheaker.perso.dev and adapt the configuration (paths...)

```
<VirtualHost api.sheaker.perso.dev:80>
    ServerAdmin mail@mail.fr
    ServerName api.sheaker.perso.dev

    SetEnv APPLICATION_ENV development
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Headers X-Requested-With,Content-Type,Authorization

    DocumentRoot "/home/myuser/mywebsites/sheaker/api/public/"
    <Directory "/home/myuser/mywebsites/sheaker/api/public/">
        Options Indexes MultiViews FollowSymLinks
        Require all granted

        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
        RewriteCond %{HTTP:Authorization} ^(.*)
        RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]
    </Directory>

    #ErrorLog "/var/log/apache2/perso.dev-error.log"
    #CustomLog "/var/log/apache2/perso.dev-access.log" common
</VirtualHost>
```

Note: you may have to install some modules like rewrite
