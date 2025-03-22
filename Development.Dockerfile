# Use node 20 alpine
FROM node:20-alpine

# Set the working directory
WORKDIR /src

# Persist the node_modules folder
VOLUME ./node_modules /src/node_modules

# Copy the current directory contents into the container at /src
COPY . .

# Install any needed packages specified in package.json
RUN npm install ci

# Make port 3000 available to the world outside this container
EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start"]
