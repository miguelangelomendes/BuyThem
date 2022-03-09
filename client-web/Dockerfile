# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:16-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app


# Nuxt will be looking for both a PORT and HOST ENV variables
ENV PORT 80
ENV HOST 0.0.0.0

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies
# RUN npm install -g yarn
RUN yarn

# Copy local code to the container image.
COPY . ./

# Build the application
RUN yarn build

# Run the web service on container startup.
CMD [ "yarn", "start" ]