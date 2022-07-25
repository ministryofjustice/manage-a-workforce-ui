# manage-a-workforce-ui

Used to display cases to allocate to probation officers
## Running the app


```sh
docker compose pull
docker compose up -d
npm i
npm run start:dev
```

### Dependencies

The app requires: 
* [hmpps-auth](https://github.com/ministryofjustice/hmpps-auth) - for authentication
* redis - session store and token caching
* [hmpps-allocations](https://github.com/ministryofjustice/hmpps-allocations)
* [hmpps-workload](https://github.com/ministryofjustice/hmpps-workload)

### Run linter

`npm run lint`

### Run tests

`npm test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up -d`

Install dependencies and run the build

```sh
npm install && npm run build
```

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`
