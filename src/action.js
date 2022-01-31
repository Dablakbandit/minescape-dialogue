const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
        const octokit = github.getOctokit(GITHUB_TOKEN);

        const { context = {} } = github;
        const { pull_request } = context.payload;

        if (pull_request == null) {
            core.setFailed('No pull request found.');
            return;
        }
      
        await octokit.issues.createComment({
          ...context.repo,
          issue_number: pull_request.number,
          body: `Thank you for submitting a pull request! We will try to review this as soon as we can.\n\n<img src="${gifUrl}" alt="thank you" />`
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();