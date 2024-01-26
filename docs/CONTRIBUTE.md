## Pushing Changes to Github

In order to push your changes to github you will need to checkout and create your own branch.

- Make sure you make your own so that things stay organized and you get credit for your work.

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

   - Go to the [fasto-turborepo](https://github.com/Fasto-App/fasto-turborepo).
   - Click on the "Pull Request" button.
   - Select the branch "development" in the dropdown menu, it will display "base: development" in the dropdown menu when done correctly. ⚠️ DO NOT SELECT THE MAIN BRANCH.⚠️
   - Select the branch with your changes from the dropdown menu. It will display "compare: your-branch" if done correctly in the dropdown menu. For example: "compare: AS/FA-338_README"
   - Provide a descriptive title and comment explaining your changes and fill out the template.

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
