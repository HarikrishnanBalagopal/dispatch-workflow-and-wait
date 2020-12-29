# dispatch-workflow-and-wait

This action can dispatch a workflow in the same repo or a different repo and wait for it to finish running.

## Usage

```
steps:
  - uses: HarikrishnanBalagopal/dispatch-workflow-and-wait
    with:
      token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
      owner: someuser
      repo: somerepo
      workflow: build.yml
      branch: main
      time_between_polls: 5
      start_timeout: 600
      finish_timeout: 1200
```

## Inputs

| Name | Description | Required |
| --- | --- | --- |
| token | a personal access token with write access to the repo | true |
| workflow | name of the workflow file. Ex: 'build.yml' | true |
| branch | name of the branch to run the workflow on | true |
| owner | name of the repo owner | false |
| repo | name of the repo | false |
| time_between_polls | how long to wait between workflow status checks (in seconds) | false: default is 3 seconds |
| start_timeout | how long to wait for the workflow to start (in seconds) | false: default if 2 minutes |
| finish_timeout | how long to wait for the workflow to finish running (in seconds) | false: default is 10 minutes |
