import React, { useState, useEffect } from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Flex } from "@strapi/design-system";
import { Button } from "@strapi/design-system/Button";
import { Textarea, Grid, GridItem } from "@strapi/design-system";
import { auth } from "@strapi/helper-plugin";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import useDebounce from "./useDebounce";
import { cleanText } from "../../../../../server/routes";

// Component for raw QA field
export default function Index({
  name,
  error,
  description,
  onChange,
  value,
  intlLabel,
  options,
  attribute,
}) {
  const { modifiedData, initialData } = useCMEditViewDataManager();
  const [dynamicZone, index, fieldName] = name.split(".");

  return (
    <Grid gap={2}>
      <GridItem col={12}>
        <Textarea
          fullWidth
          disabled
          placeholder="This area will show the generated slug."
          label={fieldName}
          name="content"
          onChange={(e) =>
            onChange({
              target: { name, value: e.target.value, type: attribute.type },
            })
          }
        >
          {value}
        </Textarea>
      </GridItem>
    </Grid>
  );
}
