import React from "react";

import {
  Typography,
  BaseHeaderLayout,
  ContentLayout,
} from "@strapi/design-system";

const HomePage = () => {
  return (
    <>
      <BaseHeaderLayout
        title="Content Generator Plugin"
        subtitle="Generate content for your iTELL app."
        as="h2"
      />
      <ContentLayout>
        <Typography variant="epsilon">
          Content generator adds a new auto-content field type. This field is
          intended to be used within a component that contains another field
          called CleanText. To generate content, simply press Generate, and the
          CleanText field will be used to populate the auto-content field.
          <br />
          <br />
          Currently, question generation is supported for Chunk and Video
          components. It supports Question, Answer, and Keyphrase Generation. It
          is also capable of fetching a transcript for YouTube videos and
          generating the same content for them.
          <br />
          <br />
          After generating content, you should review it to make sure it meets
          your standards. Automatically generated content can be edited and
          saved like any other field.
        </Typography>
      </ContentLayout>
    </>
  );
};

export default HomePage;
