APP_NAME=sheaker-front

TEMP_DIR=/tmp/$APP_NAME/dist
PROD_DIR=/var/www/sheaker.com/$APP_NAME
PROD_NAME=$(date +%s)

chown ubuntu:www-data $TEMP_DIR

cp -pr $TEMP_DIR $PROD_DIR/$PROD_NAME

cd $PROD_DIR

#sudo /etc/init.d/nginx stop

#unlink $PROD_DIR/current
#ln -s $PROD_NAME current

#sudo /etc/init.d/nginx start

rm -rf $TEMP_DIR
