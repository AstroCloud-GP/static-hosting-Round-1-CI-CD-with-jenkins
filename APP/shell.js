var shell = require('shelljs');
const express = require('express');
const app = express();
const path = require('path');
const fsPromises = require("fs").promises;
app.set('views',path.join(__dirname,'views'));



function createPortNo() {
    let counter = 5070;  // Variable inside the function

    return function() {
        counter++;  // Increment the variable
        console.log("Port: " + counter);
        return counter;
    };
}

function createUserNo() {
    let counter = 1;  // Variable inside the function

    return function() {
        counter++;  // Increment the variable
        console.log("User: " + counter);
        return counter;
    };
}

// Create instances of the port and user number counters
const newPort = createPortNo();
const newUser = createUserNo();

const createDockerFile = async(github_repo)=>{
    try{
        // Get incremented user number for image and container names
        let userNo = newUser();  // Call the counter function to get user number
        let image_tag = "user" + userNo;
        let container_name = "user" + userNo + "container";
        
        if (shell.exec(`sudo docker build --build-arg REPO_URL=${github_repo} -t ${image_tag} .`).code !== 0) {
             shell.echo('Error: failed to build');
             shell.exit(1);
        }
        else{
            const newPort = createPortNo();
            const portToUse = newPort(); 
             if (shell.exec(`sudo docker run --name ${container_name} -d -p ${portToUse}:80 ${image_tag}`).code !== 0) {
                 shell.echo('Error: failed to run');
                 shell.exit(1);
               }
           }
           
     }
     catch(err)
     {
         console.error(err);
     }
}
createDockerFile('https://github.com/Somaya-Ayman/test.git');
