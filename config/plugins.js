module.exports = ({ env }) => ({
  'github-publish': {
    enabled: true,
    config: {
      owner: "learlab", // The GitHub organisation or user
      repo: "strapi", // The name of the repository
      workflow_id: "greetings.yml", // The workflow_id or filename
      token: env("GITHUB_TOKEN"), // The GitHub personal access token with access to trigger workflows and view build status
      branch: "main", // The branch the workflow should be triggered on
      inputs: {
        // Optional inputs to pass through to the GitHub workflow
        some_input: "Some value",
        some_other_input: "Some other value",
      },
    },
    resolve: './src/plugins/github-publish'
  },
  'slugify-components': {
    enabled: true,
    resolve: './src/plugins/slugify-components'
  },
  upload: {
    config: {
      provider: "strapi-provider-upload-supabase",
      providerOptions: {
        apiUrl: env("SUPABASE_API_URL"),
        apiKey: env("SUPABASE_API_KEY"),
        bucket: env("SUPABASE_BUCKET"),
        directory: env("SUPABASE_DIRECTORY"),
        options: {},
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
