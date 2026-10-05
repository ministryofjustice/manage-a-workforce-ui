# Stage: base image
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS base

ARG BUILD_NUMBER=1_0_0
ARG GIT_REF=not-available

# Stage: build assets
FROM base AS build

ARG BUILD_NUMBER=1_0_0
ARG GIT_REF=not-available

RUN apt-get update
RUN apt-get install -y python-is-python3
RUN apt-get install -y make python3 g++

COPY package*.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm run setup

COPY . .
RUN npm run build

RUN export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    npm run record-build-info

RUN npm prune --no-audit --production

# Stage: copy production assets and dependencies
FROM base

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        /app/technicalUpdates.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/build-info.json ./dist/build-info.json

COPY --from=build --chown=appuser:appgroup \
        /app/assets ./assets

COPY --from=build --chown=appuser:appgroup \
        /app/dist ./dist

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV='production'
USER 2000

CMD [ "npm", "start" ]
