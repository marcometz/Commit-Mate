#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const gtpClient_1 = require("./clients/gtpClient");
const gitClient_1 = require("./clients/gitClient");
const enquirer_1 = __importDefault(require("enquirer"));
const CANCEL = '# Cancel';
const ACCEPT = '# OK';
const exec = () => __awaiter(void 0, void 0, void 0, function* () {
    const gtpClient = new gtpClient_1.GptClient(apiKey);
    const gitClient = new gitClient_1.GitClient();
    const jira_ticket = yield gitClient.getJiraTicket();
    const { error, changes } = gitClient.getDiff();
    if (error) {
        console.log(error);
    }
    else {
        var commitMessage = yield gtpClient.getMessages(changes !== null && changes !== void 0 ? changes : '');
        commitMessage = commitMessage + `\n\n${jira_ticket}`;
        const choices = [];
        choices.push(CANCEL);
        choices.push(ACCEPT);
        try {
            console.log(commitMessage);
            const answer = yield enquirer_1.default.prompt({
                type: 'select',
                name: 'message',
                message: 'Create a Commit?',
                choices
            });
            const { message } = answer;
            if (message === CANCEL) {
                console.log('Operation cancelled');
            }
            else {
                const { error, response } = gitClient.commit(commitMessage);
                console.log(response || error);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
});
const apiKey = process.env.GPT_API_KEY || '';
if (!apiKey || !apiKey.length) {
    console.error('No api key [GPT_API_KEY], please define api key.\nRead https://github.com/Mmontsheng/Commit-Mate#setup-api-keys for more information');
}
else {
    exec();
}
