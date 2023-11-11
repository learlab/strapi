import React, { useState, useEffect } from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Flex } from '@strapi/design-system';
import { Button } from "@strapi/design-system/Button";
import { Textarea } from "@strapi/design-system";
import { auth } from "@strapi/helper-plugin";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";

// Component for constructed response field
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

  useEffect(() => {
    if (modifiedData[dynamicZone][index]["FullQuestionAnswer"]) {onChange({
              target: { name, value: JSON.parse(modifiedData[dynamicZone][index]["FullQuestionAnswer"])["answer"], type: attribute.type },
            })}
  }, [modifiedData[dynamicZone][index]["FullQuestionAnswer"],]);

  return (
    <Stack spacing={2}>
        <Textarea
          placeholder="Answer to the question"
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
    </Stack>
  );
}
