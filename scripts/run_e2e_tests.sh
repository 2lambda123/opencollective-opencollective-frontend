#!/bin/bash

. ./scripts/setup_functions.sh

if [ "$NODE_ENV" = "circleci" ]; then
  start_app
fi


# Set `$CYPRESS_RECORD` to `true` in ENV to activate records
if [ "$CYPRESS_RECORD" = "true" ]; then
  CYPRESS_RECORD="--record"
else
  CYPRESS_RECORD="--record false"
fi

# Set `$CYPRESS_VIDEO` to `false` in ENV to de-activate videos recording.
# See https://docs.cypress.io/guides/references/configuration.html#Videos

wait_for_app_services

echo ""
echo "> Running cypress tests"
npx cypress run ${CYPRESS_RECORD}
RETURN_CODE=$?
if [ $RETURN_CODE -ne 0 ]; then
  echo "Error with cypress e2e tests, exiting"
  exit 1;
fi
echo ""

if [ "$NODE_ENV" = "circleci" ]; then
  stop_app
fi

exit $RETURN_CODE