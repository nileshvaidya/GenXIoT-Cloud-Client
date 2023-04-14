FROM node:18 as client

WORKDIR /client

# Copy over the package.json files
COPY ./package*.json ./


# Install dependencies
RUN npm install --legacy-peer-deps --silent

RUN npm install react-scripts -g --silent

COPY . .

# Build the application
RUN npm run build

# Copy all the contents from the build directory into the web root
COPY --from=client /app/build/ /var/www/html

EXPOSE 80
