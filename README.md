# dispatch-workflow-and-wait

This action can dispatch a workflow in the same repo or a different repo and wait for it to finish running.

## Usage
Run workflow in same repo with no inputs and default timeouts:
```
steps:
  - uses: HarikrishnanBalagopal/dispatch-workflow-and-wait@v1
    with:
      token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
      workflow: build.yml
      branch: main
```

Run workflow in different repo with some inputs and custom timeouts:
```
steps:
  - uses: HarikrishnanBalagopal/dispatch-workflow-and-wait@v1
    with:
      token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
      workflow: build.yml
      branch: main
      inputs: '{ "foo" : "bar" }'
      owner: someuser
      repo: somerepo
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
| inputs | inputs to used by the workflow | false: default is {} |
| owner | name of the repo owner | false: default is the current repo owner |
| repo | name of the repo | false: default is the current repo |
| time_between_polls | how long to wait between workflow status checks (in seconds) | false: default is 3 seconds |
| start_timeout | how long to wait for the workflow to start (in seconds) | false: default if 2 minutes |
| finish_timeout | how long to wait for the workflow to finish running (in seconds) | false: default is 10 minutes |
