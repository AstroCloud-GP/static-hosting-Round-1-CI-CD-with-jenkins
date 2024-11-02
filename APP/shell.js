const fs = require('fs');
const express = require('express');
var shell = require('shelljs');
const ngrok = require('ngrok');
const app = express();
const path = require('path');
const fsPromises = require("fs").promises;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.listen(3000, () => {
    console.log("app is listening on port 3000!!");
});

// Create a single instance of the user number generator (we've used mongoDB but due to installation problems on somaya's device, we made a simple way) 
const createUserNo = (() => {
    let counter = 1;  // Variable inside the closure

    return function () {
        console.log("User: " + counter);  // Log user number
        return counter++;  // Return current counter and increment
    };
})();

const createPortNo = (() => {
    let counter = 5070;  // Variable inside the closure

    return function () {
        console.log("Port: " + counter);  // Log port number
        return counter++;  // Return current port and increment
    };
})();

const createDockerFile = (github_repo, userNo, container_name, portToUse) => {
        console.log("Container: " + container_name);

    try {
        let image_tag = "user" + userNo;
        if (shell.exec(`sudo docker build --build-arg REPO_URL=${github_repo} -t ${image_tag} .`).code !== 0) {
            shell.echo('Error: failed to build');
            shell.exit(1);
        } else {
            if (shell.exec(`sudo docker run --name ${container_name} -d -p ${portToUse}:80 ${image_tag}`).code !== 0) {
                shell.echo('Error: failed to run');
                shell.exit(1);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

const createJenkins = async (github_repo, container_name, portToUse) => {
    console.log("Container: " + container_name);
    const templatePath = path.join(__dirname, 'Jenkins_template'); // Path to the template
    let cleanUrl = github_repo.slice(github_repo.indexOf('@') + 1);
    cleanUrl = "https://" + cleanUrl;
    const REPO_NAME = cleanUrl.split('/').pop().replace('.git', '');

    console.log(`Repository Name: ${REPO_NAME}`);
    console.log(`Clean URL: ${cleanUrl}`);

    try {
        // Remove the repository folder if it already exists
        if (fs.existsSync(REPO_NAME)) {
            console.log(`Folder ${REPO_NAME} exists. Removing it...`);
            shell.rm('-rf', REPO_NAME);
        }

        // Clone the repository
        shell.exec(`git clone ${github_repo}`);
        shell.cd(REPO_NAME);

        // Check if Jenkinsfile exists and delete it if needed
        const jenkinsFilePath = path.join(REPO_NAME, 'Jenkinsfile');
        if (fs.existsSync(jenkinsFilePath)) {
            console.log('Jenkinsfile found in repository. Deleting it...');
            shell.rm('-f', jenkinsFilePath);
        }

        // Read the Jenkinsfile template
        const templateData = await fsPromises.readFile(templatePath, 'utf8');
        let updatedData = templateData.replace(/REPO_URL/g, cleanUrl)
                                       .replace(/CONTAINER_NAME/g, container_name);

        // Write the updated Jenkinsfile to the user's repository
        await fsPromises.writeFile('Jenkinsfile', updatedData); // Save to the current directory

        // Stage the Jenkinsfile for commit
        shell.exec('git add Jenkinsfile');

        // Commit the changes
        if (shell.exec('git commit -m "Jenkinsfile added successfully"').code !== 0) {
            console.error('Error: Git commit failed');
            shell.exit(1);
        }

        // Push to the remote repository
        if (shell.exec('git push origin main').code !== 0) {
            console.error('Error: Git push failed');
            shell.cd('..');
            shell.rm('-rf', REPO_NAME);
            shell.exit(1);
        }

        // Return to the original directory and clean up
        shell.cd('..');

        // Delete the Jenkinsfile after pushing
        console.log(`Deleting Jenkinsfile from ${REPO_NAME}...`);
        shell.rm('-f', path.join(REPO_NAME, 'Jenkinsfile')); // Delete the Jenkinsfile

        // Remove the cloned repository
        shell.rm('-rf', REPO_NAME);

    } catch (error) {
        console.error('Error updating file:', error);
    }

    // Construct the URL with the dynamic port
    const url = `http://102.37.146.184:${portToUse}/`;
    return url;
};


app.get('/apps', async (req, res) => {
    res.render('apps/app.ejs');
});

app.post('/apps', async (req, res) => {
    const { githubLink } = req.body;
    console.log(githubLink);
    
    // Get the new user number and port number
    const userNo = createUserNo();  // Get incremented user number for each request
    const portToUse = createPortNo(); // Get incremented port number

    let container_name = "user" + userNo + "container"; // Update container name with new user number
    console.log("User: " + userNo);
    console.log("Port: " + portToUse);
    console.log("Container: " + container_name);

    // Create Docker file and Jenkins pipeline with the new user number
    createDockerFile(githubLink, userNo, container_name, portToUse);  // Pass userNo to createDockerFile
    const url = await createJenkins(githubLink, container_name, portToUse); // Pass userNo to createJenkins
    res.send(`To access your website click <a href="${url}">here</a>`);
});
