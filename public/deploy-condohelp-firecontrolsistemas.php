<?php
/*
GitHub Auto-Deploy to ServerPilot by Matt Stone and Craig Bowler
https://github.com/MeMattStone/github-auto-deploy

Based on the tutorial at https://serverpilot.io/docs/how-to-automatically-deploy-a-git-repo-from-bitbucket
*/

/* ServerPilot app details */
$sp_user_name = 'serverpilot';
$sp_app_name = 'app';

/* Branch you want to deploy from */
$branch_to_deploy = 'main';

/* Add your custom shell commands to run here and change run_custom_commands to true */
$custom_commands = '';

/* By default we deploy to the app directory which is great for applications like Laravel */
$app_root_dir = '/srv/users/' . $sp_user_name . '/apps/' . $sp_app_name;

/* The hidden directory that holds a copy of your repository where we actually deploy from */
$hidden_repo_dir = $app_root_dir . '/.repo';

/* Path to binary for git. This can be set to just 'git' in most cases */
$git_bin_path = 'git';

/* Get app PHP version to ensure correct version of composer is run */
$versionArray = explode('.', phpversion());
$php_version = $versionArray[0] . '.' . $versionArray[1];

/* Do a git checkout to the web root */
exec('cd ' . $hidden_repo_dir . ' && ' . $git_bin_path  . ' fetch');
exec('cd ' . $hidden_repo_dir . ' && GIT_WORK_TREE=' . $app_root_dir . ' ' . $git_bin_path  . ' checkout -f ' . $branch_to_deploy);


/* Run composer install */
shell_exec('cd '.$app_root_dir.' && npm install && npm run build');

/* Retrieve the commit hash */
$commit_hash = shell_exec('cd ' . $hidden_repo_dir . ' && ' . $git_bin_path  . ' rev-parse --short ' . $branch_to_deploy);

/* Log the result of the commit */
file_put_contents($hidden_repo_dir . '/deploy.log', date('Y-m-d h:i:s a') . " Deployed Branch: " .  $branch_to_deploy . " Commit: " . $commit_hash, FILE_APPEND);
