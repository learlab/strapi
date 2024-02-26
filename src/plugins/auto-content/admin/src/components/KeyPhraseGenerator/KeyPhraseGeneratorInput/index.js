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
  const [currentText, setCurrentText] = useState("");
  const [currentVideo, setCurrentVideo] = useState({
    url: "",
    startTime: 0,
    endTime: 0,
  });
  const [targetText, setTargetText] = useState("");

  const debouncedTextFieldValue = useDebounce(
    modifiedData[dynamicZone][index]["Text"],
    300
  );

  const debouncedVideoFieldValue = useDebounce(
    {
      url: modifiedData[dynamicZone][index]["URL"],
      startTime: modifiedData[dynamicZone][index]["StartTime"],
      endTime: modifiedData[dynamicZone][index]["EndTime"],
    },
    300
  );

  // check if content type is text or video
  function checkContentType() {
    return "Text" in modifiedData[dynamicZone][index];
  }

  // change text to show API is being called
  function showLoading() {
    const loadingString = "Currently being generated...";

    onChange({
      target: { name, value: loadingString, type: attribute.type },
    });
  }

  async function getTargetText() {
    let cleanTextFeed;
    // Check content type
    const contentIsText = checkContentType();
    // If content type is text
    if (contentIsText) {
      // Check if same text has been used for cleanText generation
      if (debouncedTextFieldValue == currentText) {
        return targetText;
      } else {
        setCurrentText(debouncedTextFieldValue);
        cleanTextFeed = await generateCleanText();
        setTargetText(cleanTextFeed);
        return cleanTextFeed;
      }
    } else {
      // If content type is video
      // Check if same transcript has been used for cleanText generation
      if (
        debouncedVideoFieldValue["url"] == currentVideo["url"] &&
        debouncedVideoFieldValue["startTime"] == currentVideo["startTime"] &&
        debouncedVideoFieldValue["endTime"] == currentVideo["endTime"]
      ) {
        return targetText;
      } else {
        setCurrentVideo({
          url: debouncedVideoFieldValue["url"],
          startTime: debouncedVideoFieldValue["startTime"],
          endTime: debouncedVideoFieldValue["endTime"],
        });
        cleanTextFeed = await fetchTranscript();
        setTargetText(cleanTextFeed);
        return cleanTextFeed;
      }
    }
  }

  // could use modifiedData.publishedAt === null to only allow content generation for unpublished content
  // authors would have to unpublish their content to re-generate the content

  const generateKeyPhrase = async () => {
    try {
      showLoading();
      // create clean text to feed into QA generation
      const cleanTextFeed = await getTargetText();

      const response = await fetch(`/auto-content/extract-keyphrase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          text: cleanTextFeed,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const parsedResponse = await response.json().then((res) => {
        // Probably will need to add a new column in Strapi db if we want to use the JSON feature
        // const resArr = Object.values(JSON.parse(res.choices[0].message.content))[0];
        // console.log(resArr);
        // return resArr.join("\n");
        if ("error" in res) {
          return `Error generating kephrases!: ${res.error.message}`
        } else {
          return res.choices[0].message.content.trim();
        }
      });

      onChange({
        target: { name, value: parsedResponse, type: attribute.type },
      });
    } catch (err) {
      throw new Error(`Error generating kephrases! status: ${err}`);
    }
  };

  const generateCleanText = async () => {
    try {
      // call CleanText service
      const response = await fetch(`/auto-content/clean-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          text: `${debouncedTextFieldValue}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const generatedCleanText = await response.json().then((res) => {
        return res["contents"];
      });

      return generatedCleanText;
    } catch (err) {
      throw new Error(`Error generating clean text! status: ${err}`);
    }
  };

  const fetchTranscript = async () => {
    try {
      const payload = JSON.stringify({
        url: `${debouncedVideoFieldValue["url"]}`,
        startTime: `${debouncedVideoFieldValue["startTime"]}`,
        endTime: `${debouncedVideoFieldValue["endTime"]}`,
      });
      // fetch transcript service
      const response = await fetch(`/auto-content/fetch-transcript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      let fetchedTranscript;

      try {
        fetchedTranscript = await response.text();
      } catch (error) {
        console.error("Error fetching transcript:", error);
        fetchedTranscript = "Error fetching transcript";
        throw new Error(`Error fetching transcript! status: ${error}`);
      }

      return fetchedTranscript;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid gap={2}>
      <GridItem col={12}>
        <Textarea
          fullWidth
          placeholder="This area will show the generated key phrases."
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
      <GridItem col={12}>
        <Button fullWidth onClick={() => generateKeyPhrase()}>
          Extract key phrases from text
        </Button>
      </GridItem>
    </Grid>
  );
}
