import '@logseq/libs';
import TwitterApi from 'twitter-api-v2';
import { handleTweets } from './handleTweets';

// Generate unique identifier
const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '');

const main = () => {
  console.log('logseq-tweet-plugin loaded');

  window.setTimeout(async () => {
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat: string = userConfigs.preferredDateFormat;
    logseq.updateSettings({ preferredDateFormat: preferredDateFormat });
    console.log(`Settings updated to ${preferredDateFormat}`);
  }, 3000);

  const { appKey, appSecret, accessToken, accessSecret } = logseq.settings;

  const twitterClient = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

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

    .noOfChars {

    }
  `);

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    // Get uuid of payload so that child blocks can be retrieved for the board
    const uuid = payload.uuid;
    const [type] = payload.arguments;
    const id = type.split('_')[1]?.trim();
    const tweetId = `tweet_${id}`;

    if (!type.startsWith(':tweet_')) return;

    // Handle no of characters
    const blockContent = await logseq.Editor.getEditingBlockContent();
    const noOfChars =
      blockContent.length > 160
        ? `<span style="color:red;">${blockContent.length}`
        : blockContent.length;

    // Handle tweeting
    const buttonBlock = await logseq.Editor.getBlock(uuid, {
      includeChildren: true,
    });
    const tweetsArr = buttonBlock.children;

    logseq.provideModel({
      async tweet() {
        await handleTweets(twitterClient, tweetsArr, uuid);
      },
    });

    // Model for button
    logseq.provideUI({
      key: `${tweetId}`,
      slot,
      reset: true,
      template: `<button class="tweet-btn" data-slot-id="${slot}" data-tweet-id="${tweetId}" data-on-click="tweet"><i class="ti ti-brand-twitter"></i>: ${noOfChars}/160</button>`,
    });
  });
};

logseq.ready(main).catch(console.error);
