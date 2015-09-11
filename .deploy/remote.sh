TEMP_DIR=/tmp/sheaker-front
PROD_DIR=/var/www/sheaker.com/sheaker-front
PROD_NAME=$(date +%s)

#sudo /etc/init.d/nginx stop

mkdir $PROD_DIR/$PROD_NAME
cp -pr $TEMP_DIR $PROD_DIR/$PROD_NAME

cd $PROD_DIR

#unlink $PROD_DIR/current
#ln -s $PROD_NAME current

#sudo /etc/init.d/nginx start

rm -rf $TEMP_DIR
