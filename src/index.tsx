import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import { buttonRenderer } from "./buttonRenderer";
import EmbedTweetOrThread from "./EmbedTweet";
import { handleClosePopup } from "./handleClosePopup";
import { handleDeleteTweet } from "./handleDeleteTweet";
import { callSettings } from "./callSettings";
import axios from "axios";
import addOAuthInterceptor from "axios-oauth-1.0a";

const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "");

const main = async () => {
  console.log("logseq-tweet-plugin loaded");

  callSettings();
  handleClosePopup();

  // Set preferred date format
  window.setTimeout(async () => {
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat: string = userConfigs.preferredDateFormat;
    logseq.updateSettings({
      preferredDateFormat: preferredDateFormat,
      customHashtag: "#tweeted on",
    });
    console.log(`Settings updated to ${preferredDateFormat}`);
  }, 3000);

  // Define twitter client
  const { appKey, appSecret, accessToken, accessSecret } = logseq.settings;
  const twitterClient = axios.create();
  const options = {
    algorithm: "HMAC-SHA1",
    key: appKey,
    secret: appSecret,
    token: accessToken,
    tokenSecret: accessSecret,
  };

  //@ts-expect-error
  addOAuthInterceptor(twitterClient, options);

  // Handle tweeting
  logseq.Editor.registerSlashCommand("Tweet", async () => {
    logseq.provideStyle(`
        .tweet-btn {
            padding: 8px 8px 14px 8px;
        	border-radius: 8px;
        	border: 1px solid;
        	background-color: rgb(29, 155, 240);
        }
        
        .tweet-btn:hover {
        	background-color: rgb(9, 90, 144);
        }
        
        .tweet-txt {
            margin: 0 0 12px 0 !important;
            padding: 0;
            font-size: 110%;
            line-height: 0 !important;
    	    color: white !important;
        }
        
        .count {
            margin: 0;
            padding: 0;
            font-size: 100%;
            line-height: 0 !important;
            color: white !important;
        }
  `);
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :tweet_${uniqueIdentifier()}}}`
    );
    buttonRenderer(twitterClient);
  });

  // Handle embed tweet thread
  logseq.Editor.registerSlashCommand("Embed tweet/thread", async () => {
    ReactDOM.render(
      <React.StrictMode>
        <EmbedTweetOrThread twitterClient={twitterClient} />
      </React.StrictMode>,
      document.getElementById("app")
    );

    logseq.showMainUI();

    document.addEventListener("keydown", (e: any) => {
      if (e.keyCode !== 27) {
        (document.querySelector(".url-field") as HTMLElement).focus();
      }
    });
  });

  handleDeleteTweet(twitterClient);
};

logseq.ready(main).catch(console.error);
