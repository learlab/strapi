import React, { useState, useEffect } from "react";
import { Flex } from "@strapi/design-system";
import { Textarea } from "@strapi/design-system";
import { unstable_useContentManagerContext as useContentManagerContext } from "@strapi/strapi/admin";

// Component for question field
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
  const { form } = useContentManagerContext();
  const { initialValues, values } = form;  const [dynamicZone, index, fieldName] = name.split(".");

  const clearGeneratedText = () => {
    onChange({
      target: { name, value: "", type: attribute.type },
    });
  };

  useEffect(() => {
    if (
      values[dynamicZone][index]["QuestionAnswerResponse"] &&
      JSON.parse(values[dynamicZone][index]["QuestionAnswerResponse"])[
        "question"
      ] !== value
    ) {
      onChange({
        target: {
          name,
          value: JSON.parse(
            values[dynamicZone][index]["QuestionAnswerResponse"],
          )["question"],
          type: attribute.type,
        },
      });
    }
  }, [values[dynamicZone][index]["QuestionAnswerResponse"]]);

  return (
    <Flex spacing={2}>
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
    </Flex>
  );
}
