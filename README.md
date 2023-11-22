# Fasto Coding Environment Setup Documentation
To install the dependencies and get Fasto running on your local machine follow the commands below. This will allow you the developer to make changes to the code and see them in real time.

## Clone the Github Repository
Once you have gained access to the github from Alex click on the blue “code” dropdown menu, then click “SSH” then copy the url so we can clone the repo. 

All of the following steps are done in the terminal until you need to get a token for doppler: 

- Create your folder on your machine where you would like to store the project and cd into it. Then type “git clone <github url>” make sure that you paste the github url after “git clone” and hit enter.

- Change your branch to “development” by clicking on the branch section in the bottom left in VS Code then selecting the “development” branch. This will keep your work in development and keep it from being published in the main branch. DO NOT PUBLISH TO THE MAIN BRANCH. See below how to publish your work to your own branch when you are ready.

## Package Installation
To install the packages to run Fasto: 

- First, type “cd opentab-turborepo” to get in the directory where the root package.json. 

- If you don’t have the yarn package manager installed then install it by entering this command in the terminal: “npm install --global yarn”. 

- Once this is installed then type “yarn install” and hit enter. This will install the packages that are needed to run the app.


## Environment Setup
The environment setup requires that your versions for node and other environment conditions are set up. You might get errors and need to install packages to get the app running. You can google search for the error in the terminal to tell you the command to install the missing package. Once the required packages are installed type “yarn install” and hit enter.

- If you get errors such as: “The engine "node" is incompatible with this module. Expected version "18.x.x". Got "16.20.1" you will need to install NVM and select this node version. NVM or node version manager is a tool to help download and manage node versions. To download and install NVM enter this in the terminal: 

    **macOS and Linux:**  Copy and paste this in the terminal and hit enter “curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash” or “wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash”

    **Windows:** Follow the instructions from this url: https://codedamn.com/news/nodejs/nvm-installation-setup-guide. You will need to download the installer and follow the instructions.

- Once installed NVM will help us use the correct node version. Use these commands to configure the node version that is needed.

- Run install node version with this command: ”nvm install 18.17.1”

- Then run to use this node version: “nvm use 18.17.1”

- Then try to run: “yarn install” again. It will take some time because of all of the packages.

- If there are no more errors try to run: “yarn dev”

- You should get this error once the packages are installed:  “ERROR  run failed: command  exited (1) error Command failed with exit code 1. info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command”

This means you are not authorized yet and to login and set up doppler. 

## Doppler Setup
Doppler setup provides authentication for developers working on a project. You will need to generate a token for where you are working, frontend or backend.

- Start by entering “doppler login” in the terminal, this will give you 2 choices. 

- Select the first “Scope login to current directory” then hit “y” and enter to open your browser to set up your token. You will have to authenticate using your github. 

- Follow the instructions in the browser to get a token.

- Doppler will ask you to enter an auth code which is in your terminal, copy and paste this to the auth form in the browser then select “fasto” then “finish login”

- Go back to the terminal and cd into the server directory or client depending on which token you need by using this command: “cd apps/server/”. 

- Then enter “doppler setup” and hit enter. You are in the server directory so select “fasto–backend” and hit enter then select “dev” and hit enter. 

- If you need a client token then type “cd ..” out of server then cd into client by typing “cd client” then enter “doppler setup” again this time select “fasto-frontend” then “dev”

## How to Run the Fasto App
To run the app:  

- Navigate to the “opentab-turborepo” directory 

- Then run the app by entering “yarn dev”. This will start the app on your machine in your browser. 

To see the project in action open the resources below.

Your resources are:

Client / Frontend at: http://127.0.0.1:3000/ 

Server / Backend at: http://127.0.0.1:4000/graphql

React Email at: http://127.0.0.1:3001/

## Pushing Changes to Github
In order to push your changes to github you will need to checkout and create your own branch. 

- Do this by typing: git checkout -b <your_initials> / <ticket_number> _ <component_you_are_working_on> for example “git checkout -b AS/FA-338_README”.

- Make sure you make your own so that things stay organized and you get credit for your work.

- Once you do that commit the changes in VS Code clicking on the branch icon on the left sidebar. You will see the “Changes” dropdown showing what needs to be pushed to github. 

- Mouse over each change you want to commit and click the “+” sign to add the item. 

- Then add a comment to the Message field above. 

- Click the commit button then click publish. 

If you have any questions use the Slack or Whatsapp chat and Alex or myself will be happy to help you!

Happy coding!!!
