## Environment Setup

The environment setup requires that your versions for node and other environment conditions are set up. You might get errors and need to install packages to get the app running. You can google search for the error in the terminal to tell you the command to install the missing package. Once the required packages are installed type `yarn install` and hit enter.

-   If you get errors such as: ``The engine "node" is incompatible with this module. Expected version "18.x.x". Got "16.20.1" you will need to install NVM and select this node version. NVM or node version manager is a tool to help download and manage node versions. To download and install NVM enter this in the terminal:

    **macOS and Linux:** Copy and paste this in the terminal and hit enter `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash` or `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

    **Windows:** Follow the instructions from this url: https://codedamn.com/news/nodejs/nvm-installation-setup-guide. You will need to download the installer and follow the instructions.

-   Once installed NVM will help us use the correct node version. Use these commands to configure the node version that is needed.

-   Run install node version with this command: `nvm install 18.17.1`

-   Then run to use this node version: `nvm use 18.17.1`

-   Then try to run: `yarn install` again. It will take some time because of all of the packages.

-   If there are no more errors try to run: `yarn dev`

-   You should get this error once the packages are installed: `ERROR run failed: command exited (1) error Command failed with exit code 1. info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command`

This means you are not authorized yet, and to login and set up [Doppler](docs/DOPPLER.md).
