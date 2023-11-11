import React, { useState, useEffect } from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Flex } from '@strapi/design-system';
import { Button } from "@strapi/design-system/Button";
import { Textarea } from "@strapi/design-system";
import { auth } from "@strapi/helper-plugin";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import useDebounce from "./useDebounce";

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

  // could make the target field configurable. "Text" is hardcoded.
  const debouncedTargetFieldValue = useDebounce(
    modifiedData[dynamicZone][index]["Text"],
    300
  );

  // could use modifiedData.publishedAt === null to only allow content generation for unpublished content
  // authors would have to unpublish their content to re-generate the content

  const generateText = async () => {
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

      let jsonResponse;

      // Check if output can be converted to JSON
      // Could use a JSON field instead of text field.
      try {
        jsonResponse = JSON.parse(parsedResponse);
      } catch (err) {
        jsonResponse = {"question": "Automatic question-generation has failed. Please try again.", "answer": "Automatic answer-generation has failed. Please try again."};
      };

      onChange({
        target: { name, value: parsedResponse, type: attribute.type },
      });

    } catch (err) {
      console.log(err);
    }
  };

  const clearGeneratedText = () => {
    onChange({
      target: { name, value: "", type: attribute.type }
    });
  };

  // for testing. Might be nice to do something like
  // if process.env.NODE_ENV === "development"
  // but I don't really know if that would work.
  // useEffect(() => {
  //   console.log(modifiedData[dynamicZone][index]["Text"],);
  // }, [modifiedData[dynamicZone][index]["Text"],]);
  // end testing

  return (
    <Stack spacing={4}>
      <Stack>
        <Textarea
          disabled
          fullWidth
          placeholder="This area will show the generated question and answer in JSON format."
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
      <Stack>
        <Button fullWidth onClick={() => generateText()}>Generate question and answer pair</Button>
      </Stack>
    </Stack>
  );
}
