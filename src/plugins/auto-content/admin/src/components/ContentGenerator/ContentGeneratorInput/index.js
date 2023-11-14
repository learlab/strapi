import React, { useState, useEffect } from "react";
import { Stack } from "@strapi/design-system/Stack";
import { Flex } from '@strapi/design-system';
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
  const [currentVideo, setCurrentVideo] = useState({ url: "", startTime: 0, endTime: 0 });
  const [targetText, setTargetText] = useState("");

  const debouncedTextFieldValue = useDebounce(
    modifiedData[dynamicZone][index]["Text"],
    300
  );

  const debouncedVideoFieldValue = useDebounce(
    { url: modifiedData[dynamicZone][index]["URL"], 
      startTime: modifiedData[dynamicZone][index]["StartTime"], 
      endTime: modifiedData[dynamicZone][index]["EndTime"],
    },
    300
  );

  // check if content type is text or video
  function checkContentType () {
    return ("Text" in modifiedData[dynamicZone][index])
  };

  // change text to show API is being called
  // needs to be a dict since other custom fields (question and answer) expect it
  function showLoading() {
    const loadingJSON = JSON.stringify({"question": "Currently being generated...", 
                                        "answer": "Currently being generated..."});
    onChange({
      target: { name, value: loadingJSON, type: attribute.type },
    });
  }
  
  async function getTargetText () {
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
      };
    } else {
    // If content type is video
      // Check if same transcript has been used for cleanText generation
      if (debouncedVideoFieldValue["url"] == currentVideo["url"] && 
          debouncedVideoFieldValue["startTime"] == currentVideo["startTime"] &&
          debouncedVideoFieldValue["endTime"] == currentVideo["endTime"]
          ) {
            return targetText;
          } else {
            setCurrentVideo({ url: debouncedVideoFieldValue["url"], 
                              startTime: debouncedVideoFieldValue["startTime"], 
                              endTime: debouncedVideoFieldValue["endTime"],
                            });
            cleanTextFeed = await fetchTranscript();
            setTargetText(cleanTextFeed);
            return cleanTextFeed;
          };
    }
  };

  // could use modifiedData.publishedAt === null to only allow content generation for unpublished content
  // authors would have to unpublish their content to re-generate the content

  const generateQA = async () => {
    try {
      showLoading();
      // create clean text to feed into QA generation
      const cleanTextFeed = await getTargetText();

      const response = await fetch(`/auto-content/generate-question`, {
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
      let parsedResponse = await response.json().then((res) => {
        return res.choices[0].message.content.trim();
      });

      let jsonResponse;

      // Check if output can be converted to JSON
      // Could use a JSON field instead of text field.
      try {
        jsonResponse = JSON.parse(parsedResponse);
      } catch (err) {
        parsedResponse = JSON.stringify({"question": "Automatic question-generation has failed. Please try again.", 
                        "answer": "Automatic answer-generation has failed. Please try again."});
      };

      onChange({
        target: { name, value: parsedResponse, type: attribute.type },
      });

    } catch (err) {
      console.log(err);
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
        return res['contents'];
      });

      return generatedCleanText;

    } catch (err) {
      console.log(err);
    }
  };

  const fetchTranscript = async () => {
    try {
      const payload = JSON.stringify({ url: `${debouncedVideoFieldValue["url"]}`, 
                                       startTime: `${debouncedVideoFieldValue["startTime"]}`, 
                                       endTime: `${debouncedVideoFieldValue["endTime"]}`, 
                                     })
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
      };

      let fetchedTranscript;

      try {
        fetchedTranscript = await response.text();
      } catch (error) {
        console.error('Error fetching transcript:', error);
        fetchedTranscript = "Error fetching transcript"
      };
      
      return fetchedTranscript;

    } catch (err) {
      console.log(err);
    }
  };

  // for testing. Might be nice to do something like
  // if process.env.NODE_ENV === "development"
  // but I don't really know if that would work.
  // useEffect(() => {
  //   console.log(modifiedData[dynamicZone][index]["Text"],);
  // }, [modifiedData[dynamicZone][index]["Text"],]);
  // end testing

  return (
    <Grid gap={2}>
      <GridItem col={12}>
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
      </GridItem>
      <GridItem col={12}>
        <Button fullWidth onClick={() => generateQA()}>Generate question and answer pair</Button>
      </GridItem>
    </Grid>
  );
}
