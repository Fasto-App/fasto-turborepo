## Doppler Setup

Doppler setup provides authentication for developers working on a project. You will need to generate a token for where you are working, frontend or backend.

-   Start by entering “doppler login” in the terminal, this will give you 2 choices.

-   Select the first “Scope login to current directory” then hit “y” and enter to open your browser to set up your token. You will have to authenticate using your github.

-   Follow the instructions in the browser to get a token.

-   Doppler will ask you to enter an auth code which is in your terminal, copy and paste this to the auth form in the browser then select “fasto” then “finish login”

-   Go back to the terminal and cd into the server directory or client depending on which token you need by using this command: “cd apps/server/”.

-   Then enter “doppler setup” and hit enter. You are in the server directory so select “fasto–backend” and hit enter then select “dev” and hit enter.

-   If you need a client token then type “cd ..” out of server then cd into client by typing “cd client” then enter “doppler setup” again this time select “fasto-frontend” then “dev”
