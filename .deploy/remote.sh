APP_NAME=sheaker-front

TEMP_FILE=~/$APP_NAME.tar
TEMP_DIR=~/$APP_NAME
PROD_DIR=/var/www/sheaker.com/$APP_NAME
PROD_NAME=$(date +%s)

cp -pr $TEMP_DIR/dist $PROD_DIR/$PROD_NAME

cd $PROD_DIR

# Put correct rights
sudo chown -R ubuntu:www-data $PROD_NAME

sudo /etc/init.d/nginx stop

unlink $PROD_DIR/current
ln -s $PROD_NAME current

sudo /etc/init.d/nginx start

rm -rf $TEMP_DIR
rm -rf $TEMP_FILE
