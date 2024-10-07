import React, { useState, useEffect } from "react";
import { Textarea, Grid } from "@strapi/design-system";

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
  const [dynamicZone, index, fieldName] = name.split(".");

  return (
    <Grid gap={2}>
      <Grid.Item col={12}>
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
      </Grid.Item>
    </Grid>
  );
}
