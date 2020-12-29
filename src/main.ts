import * as core from "@actions/core";
import * as github from "@actions/github";

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
}

async function main() {
  const token = core.getInput("token", { required: true });
  const workflow = core.getInput("workflow", { required: true });
  const branch = core.getInput("branch", { required: true });
  const inputs = core.getInput("inputs") || "{}";
  const owner = core.getInput("owner") || github.context.repo.owner;
  const repo = core.getInput("repo") || github.context.repo.repo;
  const time_between_polls_str = core.getInput("time_between_polls") || "3";
  const start_timeout_str = core.getInput("start_timeout") || "120";
  const finish_timeout_str = core.getInput("finish_timeout") || "600";

  const time_between_polls = parseInt(time_between_polls_str);
  const start_timeout = parseInt(start_timeout_str);
  const finish_timeout = parseInt(finish_timeout_str);

  const octokit = github.getOctokit(token);

  try {
    const resp = await octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflow,
      ref: branch,
      inputs: JSON.parse(inputs),
    });
    core.debug(`workflow dispatched. status: ${resp.status}`);
  } catch (err) {
    return core.setFailed(
      `Failed to run the workflow ${workflow} in ${owner}/${repo} on branch ${branch} . Error: ${err}`
    );
  }

  let run_id = -1;
  for (let t = 0; t < start_timeout; t += time_between_polls) {
    try {
      await wait(time_between_polls);
      const resp = await octokit.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id: workflow,
        branch,
        event: "workflow_dispatch",
      });
      if (resp.data.workflow_runs.length > 0) {
        run_id = resp.data.workflow_runs[0].id;
        core.info(`Found the workflow run. id: ${run_id}`);
        break;
      }
    } catch (err) {
      return core.setFailed(
        `Error occurred while trying to find the workflow we just started. Error: ${err}`
      );
    }
  }
  if (run_id === -1) {
    return core.setFailed(
      `Timeout. The workflow did not start within ${start_timeout} seconds.`
    );
  }

  for (let t = 0; t < finish_timeout; t += time_between_polls) {
    await wait(time_between_polls);
    const resp = await octokit.actions.getWorkflowRun({ owner, repo, run_id });
    core.info(`still waiting... status: ${resp.data.status}`);
    if (resp.data.conclusion !== null) {
      if (
        resp.data.conclusion === "success" &&
        resp.data.status === "completed"
      ) {
        return core.info("Workflow succeeded");
      }
      return core.setFailed(
        `Workflow failed. conclusion: ${resp.data.conclusion} status: ${resp.data.status}`
      );
    }
  }
  return core.setFailed(
    `Timeout. Workflow still in progress after ${finish_timeout} seconds.`
  );
}

async function run(): Promise<void> {
  try {
    await main();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
