cd ~/api
echo "> Restoring opencollective_dvl database for e2e testing";
PGHOST=localhost PGUSER=postgres ./scripts/db_restore.sh -U ubuntu
npm run db:migrate
if [ $? -ne 0 ]; then
  echo "Error with restoring opencollective_dvl, exiting"
  exit 1;
else
  echo "✓ API is setup";
fi
