#!/usr/bin/env node
import 'dotenv/config';

import { GptClient } from './clients/gtpClient';
import { GitClient } from './clients/gitClient';
import enquirer from 'enquirer';
const CANCEL = '# Cancel';
const ACCEPT = '# OK';
const exec = async () => {
  const gtpClient = new GptClient(apiKey);
  const gitClient = new GitClient();
  const jira_ticket = await gitClient.getJiraTicket();

  const { error, changes } = gitClient.getDiff();
  if (error) {
    console.log(error);
  } else {
    var commitMessage = await gtpClient.getMessages(changes ?? '');
    commitMessage = commitMessage + `\n\n${jira_ticket}`;
    const choices = [];
    choices.push(CANCEL);
    choices.push(ACCEPT);
    try {
      console.log(commitMessage);
      const answer = await enquirer.prompt<{ message: string }>({
        type: 'select',
        name: 'message',
        message: 'Create a Commit?',
        choices
      });
      const { message } = answer;
      if (message === CANCEL) {
        console.log('Operation cancelled');
      } else {
        const { error, response } = gitClient.commit(commitMessage);
        console.log(response || error);
      }
    } catch (error) {
      console.log(error);

    }
  }
};

const apiKey = process.env.GPT_API_KEY || '';
if (!apiKey || !apiKey.length) {
  console.error('No api key [GPT_API_KEY], please define api key.\nRead https://github.com/Mmontsheng/Commit-Mate#setup-api-keys for more information');
} else {
  exec();
}
