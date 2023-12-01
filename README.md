# Fasto Coding Environment Setup Documentation

To install the dependencies and get Fasto running on your local machine follow the commands below. This will allow you the developer to make changes to the code and see them in real time.

## Requirements

-   [Node 18.x.x](https://nodejs.org/en/download)
-   [Yarn 1.22.19](https://classic.yarnpkg.com/lang/en/docs/install/)

## Table of Contents

1. ✅ [Installation](#installation)

2. ✅ [Environment Setup](docs/ENVIRONMENT.md)

3. ✅ [Doppler Setup](docs/DOPPLER.md)

4. ✅ [Pushing Changes to Github](docs/CONTRIBUTE.md)

### Installation

Once you have gained access to the github from Alex click on the blue “code” dropdown menu, then click “SSH” then copy the url so we can clone the repo.

1. **Clone the repository:**

    ```bash
    git clone git@github.com:Fasto-App/fasto-turborepo.git
    ```

2. **Checkout to development**

    Change your branch to `development` by clicking on the branch section in the bottom left in VS Code then selecting the `development` branch. This will keep your work in development and keep it from being published in the `main branch`.

    ⚠️ DO NOT PUBLISH TO THE MAIN BRANCH.⚠️

    See below how to publish your work to your own branch when you are ready.

3. **Project Installation**

    To install the packages to run Fasto, get in the directory where the root `package.json` is and run install:

```bash
 cd fasto-turborepo/
 yarn install
```

-   If you don’t have the yarn package manager installed then install it by entering this command in the terminal:

```bash
 npm install --global yarn
```

-   Once this is installed then type `yarn install` and hit enter. This will install the packages that are needed to run the app.

## How to Run the Fasto App

To run the app:

-   Navigate to the “fasto-turborepo” directory

```bash
    cd fasto-turborepo
```

-   Then run the app by entering “yarn dev”. This will start the app on your machine in your browser.

```bash
    yarn dev
```

To see the project in action open the resources below:

-   📱 Client / Frontend at: http://127.0.0.1:3000/

-   💻 Server / Backend at: http://127.0.0.1:4000/graphql

-   📧 React Email at: http://127.0.0.1:3001/

If you have any questions use the Slack or Whatsapp chat and Alex or myself will be happy to help you!

Happy coding!!!
