import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import TwitterApi from 'twitter-api-v2';
import { buttonRenderer } from './buttonRenderer';
import EmbedTweetOrThread from './EmbedTweet';
import { handleClosePopup } from './handleClosePopup';

// Generate unique identifier
const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '');

const main = () => {
  console.log('logseq-tweet-plugin loaded');

  // Set preferred date format
  window.setTimeout(async () => {
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat: string = userConfigs.preferredDateFormat;
    logseq.updateSettings({ preferredDateFormat: preferredDateFormat });
    console.log(`Settings updated to ${preferredDateFormat}`);
  }, 3000);

  // Define twitter client
  const { appKey, appSecret, accessToken, accessSecret } = logseq.settings;
  const twitterClient = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  // Handle tweeting
  logseq.Editor.registerSlashCommand('tweet', async () => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :tweet_${uniqueIdentifier()}}}`
    );
  });
  logseq.provideStyle(`
    .tweet-btn {
        padding: 8px;
        border-radius: 8px;
        font-size: 110%;
        border: 1px solid;
        background-color: rgb(29,155,240);
        color: white;
    }
  `);
  buttonRenderer(twitterClient);

  // Handle embed tweet thread
  handleClosePopup();

  logseq.Editor.registerSlashCommand('Embed tweet/thread', async () => {
    ReactDOM.render(
      <React.StrictMode>
        <EmbedTweetOrThread twitterClient={twitterClient} />
      </React.StrictMode>,
      document.getElementById('app')
    );

    logseq.showMainUI();

    document.addEventListener('keydown', (e: any) => {
      if (e.keyCode !== 27) {
        (document.querySelector('.url-field') as HTMLElement).focus();
      }
    });
  });
};

logseq.ready(main).catch(console.error);
