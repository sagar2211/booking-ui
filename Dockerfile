# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:16.14.0-alpine3.14

# Stage 2: Craete a Build Diretory
RUN mkdir /app

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY ./ /app/

# Install all the dependencies
RUN npm install && \
    npm install -g @angular/cli@13.0.2

# Generate the build of the application
RUN npm run build --prod



# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=0 /app/dist/wadiia-frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80
