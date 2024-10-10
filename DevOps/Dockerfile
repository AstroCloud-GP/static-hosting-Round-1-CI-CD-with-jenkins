# Use NGINX as the base image
FROM nginx:alpine

# Install git
RUN apk add --no-cache git

# Define build-time arguments 
ARG REPO_URL

# Set the working directory
WORKDIR /usr/src/app

# Clone the specified repo
RUN git clone ${REPO_URL} .

# Copy the cloned content to NGINX's default serving directory
# The default directory for NGINX to serve files is /usr/share/nginx/html
RUN cp -r /usr/src/app/* /usr/share/nginx/html/

# The default command for NGINX base image is already set to run NGINX
CMD ["nginx", "-g", "daemon off;"]


## to make an image for example
## sudo docker build --build-arg REPO_URL=REPO_URL -t IMAGE_TAG .

## to run image make a container for example
## sudo docker run -d -p CONATINER_PORT:80 <IMAGE_TAG>
