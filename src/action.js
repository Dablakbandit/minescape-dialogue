const core = require('@actions/core');
const github = require('@actions/github');
const os = require('os');
const fs = require('fs');

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

        let homedir = os.homedir();
        let files = JSON.parse(fs.readFileSync(homedir + '/files.json'));

        let actions = '\n';

        for ( var file in files ) {
            if ( !file.endsWith(".json") ) {
                continue;
            }
            try{
                let json = JSON.parse(fs.readFileSync(file));
                for ( node in json[0].nodes ){
                    if (node.node_type == 'execute' && node.title == 'EXECUTE') {
                        actions += node.text;
                    }
                }
            } catch (error) {
                core.setFailed(file + ": " + error.message);
            }
        }
      
        await octokit.rest.issues.createComment({
          ...context.repo,
          issue_number: pull_request.number,
          body: `Thank you for submitting a pull request! We will try to review this as soon as we can.\n\nActions:${actions}`
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();