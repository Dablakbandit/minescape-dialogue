const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const github_token = core.getInput('GITHUB_TOKEN');

        const context = github.context;
        if (context.payload.pull_request == null) {
            core.setFailed('No pull request found.');
            return;
        }

        const octokit = new github.GitHub(github_token);
        await octokit.issues.createComment({
            ...context.repo,
            issue_number: context.payload.pull_request.number,
            body: 'Thank you for submitting a pull request! We will try to review this as soon as we can.'
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();