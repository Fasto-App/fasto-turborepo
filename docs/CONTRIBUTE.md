## Pushing Changes to Github

In order to push your changes to github you will need to checkout and create your own branch.

-   Make sure you make your own so that things stay organized and you get credit for your work.

## How to Contribute After creating your branch

1. **Create a New Branch Following the Prefix:**

    - Create a new branch for your changes.

    ```bash
        git checkout -b <your_initials> / <ticket_number> _ <component_you_are_working_on>
    ```

    - this way things stay organized and you get credit for your work.

        for example

    ```bash
    git checkout -b AS/FA-338_README
    ```

2. **Make Changes:**

    - Make the necessary changes in your code.

3. **Commit Changes:**

    - Commit your changes with a meaningful commit message.
        ```bash
        git add .
        git commit -m "Add a concise commit message"
        ```

4. **Push Changes:**

    - Push your changes to your forked repository.
        ```bash
        git push origin feature-name
        ```

5. **Open a Pull Request (PR):**

    - Go to the [original repository](https://github.com/original-username/original-project).
    - Click on the "New Pull Request" button.
    - Select the branch with your changes.
    - Provide a descriptive title and comment explaining your changes.

6. **Review Process:**

    - Your pull request will be reviewed by the project maintainers.
    - Make any requested changes and update the pull request.

7. **Merge Pull Request:**
    - Once approved, your pull request will be merged into the main branch.

## Code Style Guidelines

Make sure to adhere to the project's code style guidelines. If there are any specific guidelines or requirements, they will be mentioned in the project documentation.

## Help and Support

If you have any questions or need assistance, feel free to reach out to the project maintainers or create an issue.

Thank you for your contribution! 🚀
