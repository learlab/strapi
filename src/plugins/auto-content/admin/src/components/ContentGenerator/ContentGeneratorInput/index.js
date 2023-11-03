import React, { useState, useEffect } from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Textarea } from "@strapi/design-system";
import { auth } from "@strapi/helper-plugin";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import useDebounce from "./useDebounce";

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

  // could make the target field configurable. "Text" is hardcoded.
  const debouncedTargetFieldValue = useDebounce(
    modifiedData[dynamicZone][index]["Text"],
    300
  );

  // could use modifiedData.publishedAt === null to only allow content generation for unpublished content
  // authors would have to unpublish their content to re-generate the content

  const generateText = async () => {
    // Get the text from the chunk text field in Strapi
    console.log(JSON.stringify({ name, value }));
    try {
      const response = await fetch(`/auto-content/generate-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          text: `${debouncedTargetFieldValue}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const parsedResponse = await response.json().then((res) => {
        console.log(res);
        return res.choices[0].message.content.trim();
      });

      onChange({
        target: { name, value: parsedResponse, type: attribute.type },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const clearGeneratedText = async () => {
    onChange({ target: { name, value: "", type: attribute.type } });
  };

  // for testing. Might be nice to do something like
  // if process.env.NODE_ENV === "development"
  // but I don't really know if that would work.
  useEffect(() => {
    console.log(modifiedData);
  }, [modifiedData]);
  // end testing

  return (
    <Stack spacing={2}>
      <Textarea
        placeholder="You can generate content here, or add it yourself."
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
      <Stack horizontal spacing={1}>
        <Button onClick={() => generateText()}>Generate</Button>
        <Button variant="secondary" onClick={() => clearGeneratedText()}>
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}
