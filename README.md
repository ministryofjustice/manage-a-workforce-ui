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


### Running web application locally
- It is possible to get the web application running locally, authenticating against the dev environment, and making networks calls to the dev environment APIs.
- For authentication to work correctly you need to have already logged into the dev environment before you log into the app locally.
- To achieve this do the following:

#### Create a .env file for local deployment
- Duplicate the `.env.template` file and rename the duplicated file to `.env`
- You will notice that in your new `.env` file you have all of the properties that the application requires
- You will also notice that the secret values (that are intentionally left out of `values.dev.yml` for deployments) are also intentionally not included in the `.env.template`. Here are those properties:
```
API_CLIENT_ID=<retrieve_k8s_secret__AUTH_API_CLIENT_ID>
API_CLIENT_SECRET=<retrieve_k8s_secret__AUTH_API_CLIENT_SECRET>
```
- The placeholder values of the above properties will therefore need to be swapped out for the real secrets
- these secrets are stored in `Kubenetes` and can be accessed in the `manage-a-workforce-ui` secret
- here is a guide for [connecting to the Kubernetes Cluster](https://user-guide.cloud-platform.service.justice.gov.uk/documentation/getting-started/kubectl-config.html#connecting-to-the-cloud-platform-39-s-kubernetes-cluster) to access the secrets

#### Run docker locally with redis docker service only
- we can run redis locally as a docker container so that we do not need to integrate with the dev environment's redis datasource
- to achieve this, run this command from this repo's root directory: `docker-compose up -d redis`
- with the above command you will have noticed that we are specifically running the redis container only. If we were to run the usual `docker-compose up -d` command then we would run the wiremock containers which would mean that your localhost deployment is running against mock data (like with the `Cyprus` integration tests above)
- just running the `redis` container is good because that way we are seeing proper `dev` data (not mocked data) in the web application

#### Kick-off the web application locally
- In Intellij create a new Configuration by clicking `Edit Configuration` in the dropdown next to the `Run` and `Debug` buttons
- Click the `Add new configuration` button (the button with the `+` sign in the top left)
- In the resulting list find `npm` in the list and click on it
- In the resulting form take the defaults and set the following values:
    - `Command` = `run`
    - `Scripts` = `start:dev`
- Hit `Apply` button
- Hit `OK` button
- Now you should see a new `start:dev` run configuration in the dropdown next to the `Run` and `Debug` buttons
- You should now be in a position to run (as well as debug) the application and it will use the properties set in your new `.env` file to fire the networks calls at the dev environment
