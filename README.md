# manage-a-workforce-ui

Used to display cases to allocate to probation officers
## Running the app

The app depends on too many other apps to run locally against docker

### Dependencies

The app requires: 
* [hmpps-auth](https://github.com/ministryofjustice/hmpps-auth) - for authentication
* redis - session store and token caching
* [hmpps-allocations](https://github.com/ministryofjustice/hmpps-allocations)
* [hmpps-workload](https://github.com/ministryofjustice/hmpps-workload)
* [hmpps-user-preferences](https://github.com/ministryofjustice/hmpps-user-preferences)

### Run linter

`npm run lint`

### Run tests

`npm t`

### Running integration tests

For local running, start the apps manage-a-workforce-ui depends on in docker:

`docker compose up -d`

Install dependencies 
```sh
npm i 
```

Then run the server in test mode by:

`npm run start-feature:dev`

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`
