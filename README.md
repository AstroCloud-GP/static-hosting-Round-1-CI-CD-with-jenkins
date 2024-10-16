**Static hosting with Docker and Jenkins PoC  **
**Github Link**: https://github.com/Somaya-Ayman/static-hosting
**Team**: Somaya, Menna, Sara

Showcasing:
- **Dynamic User and Port Allocation**  
  Each new user gets a unique user number and an available port, dynamically allocated using the `createUserNo` and `createPortNo` functions. This ensures seamless scalability for new users and instances.

- **Automated Docker Container Creation**  
  The application builds Docker containers for each user using their provided GitHub repository URL. Containers are launched with a specific port and custom container name. Docker images are created based on the user’s repository content using the provided `Dockerfile` template.

- **Jenkins Pipeline Automation**  
  Jenkins integration ensures a continuous deployment workflow:
  - The repository is cloned from GitHub, and a new `Jenkinsfile` is generated dynamically using a template.
  - The `Jenkinsfile` is pushed back to the user’s GitHub repository, enabling the automation pipeline for future updates.

- **Custom NGINX Hosting**  
  Each container runs NGINX, hosting the files cloned from the user's repository. The content is served via the allocated port for that user.

- **Node.js Backend**  
  A backend written in Node.js manages the dynamic deployment of containers and Jenkins pipelines. Express.js is used to handle incoming requests, generate Docker containers, and initiate the Jenkins pipeline.
  
**Demo Video** 
[Meeting in _General_-20241015_213538-Meeting Recording.mp4](https://engasuedu.sharepoint.com/:v:/s/MMS123/Ee_GRoD__uhHshe-ziYCciEBCeJMknfM_-AAPYY0As6q8Q?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=tb68sd) 

