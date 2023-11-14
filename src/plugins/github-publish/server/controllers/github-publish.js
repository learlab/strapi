const axios = require("axios");

const pluginId = "plugin.github-publish";

module.exports = ({ strapi }) => ({
  // Check if workflow is in_progress https://docs.github.com/en/rest/reference/actions#list-workflow-runs
  check: async (ctx) => {
    const { owner, repo, workflow_id, token, branch } = strapi.config.get(
      pluginId
    );

    const headers = {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
    };

    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/runs?branch=${branch}`;
    const { data: inProgressData } = await axios.get(
      `${url}&status=in_progress`,
      {
        headers,
      }
    );
    const { data: queuedData } = await axios.get(`${url}&status=queued`, {
      headers,
    });
    const busy = !!(inProgressData.total_count + queuedData.total_count);

    ctx.send({ busy });
  },

  publish: async (ctx) => {
    const {
      owner,
      repo,
      workflow_id,
      token,
      branch: ref
    } = strapi.config.get(pluginId);

    const headers = {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
    };

    const data = { ref }; // Removed the inputs object
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;

    try {
      const response = await axios.post(url, data, { headers });
      const success = response.status === 204;
      ctx.send({ success });
    } catch (error) {
      // Log the full error response for debugging
      console.error('Error triggering GitHub workflow:', error.response?.data || error.message);
      ctx.throw(500, 'Failed to trigger GitHub workflow');
    }
  },
});
