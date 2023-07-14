#!/bin/bash
mysql -u "$LOCAL_DB_USER" -p -Bse "DROP DATABASE $LOCAL_DB_NAME;"
ssh "$REMOTE_DB_HOST" "mysqldump -u $REMOTE_DB_USER $REMOTE_DB_NAME > $REMOTE_DB_NAME.sql"
scp "$REMOTE_DB_HOST":$REMOTE_DB_NAME.sql .
ssh "$REMOTE_DB_HOST" "rm $REMOTE_DB_NAME.sql"
mysql -u "$LOCAL_DB_USER" -p -Bse "CREATE DATABASE $LOCAL_DB_NAME; USE $LOCAL_DB_NAME; SOURCE $REMOTE_DB_NAME.sql;"
rm "$REMOTE_DB_NAME.sql"
