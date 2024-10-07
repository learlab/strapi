import React from "react";

import {
  Dialog,
  Flex,
  Typography,
} from "@strapi/design-system";
import { Upload } from "@strapi/icons";
import PropTypes from "prop-types";

const dialogBody = <Flex spacing={2}>
  <Flex justifyContent="center">
    <Typography>{description}</Typography>
  </Flex>
</Flex>

const PublishPrompt = ({
  isOpen,
  title,
  description,
  cancelLabel,
  publishLabel,
  handleCancel,
  handlePublish,
}) => (
  <Dialog body = {dialogBody} onClose={handleCancel} title={title} isOpen={isOpen}>
    {/*<DialogFooter*/}
    {/*  startAction={*/}
    {/*    <Button variant="tertiary" onClick={handleCancel}>*/}
    {/*      {cancelLabel}*/}
    {/*    </Button>*/}
    {/*  }*/}
    {/*  endAction={*/}
    {/*    <Button startIcon={<Upload />} onClick={handlePublish}>*/}
    {/*      {publishLabel}*/}
    {/*    </Button>*/}
    {/*  }*/}
    {/*/>*/}
  </Dialog>
);

PublishPrompt.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  cancelLabel: PropTypes.string,
  publishLabel: PropTypes.string,
  handleCancel: PropTypes.func,
  handlePublish: PropTypes.func,
};

export default PublishPrompt;
