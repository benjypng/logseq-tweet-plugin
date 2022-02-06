import { handleTweets } from './handleTweets';

export const buttonRenderer = (twitterClient: any) => {
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
      blockContent.length > 280
        ? `<span style="color:red;">${blockContent.length}`
        : blockContent.length;

    // Handle tweeting
    const buttonBlock = await logseq.Editor.getBlock(uuid, {
      includeChildren: true,
    });
    const tweetsArr = buttonBlock.children;

    logseq.provideModel({
      [`tweet-${tweetId}`]: async () => {
        const { appKey, appSecret, accessSecret, accessToken } =
          logseq.settings;

        if (!appKey || !appSecret || !accessSecret || !accessToken) {
          logseq.App.showMsg(
            'Please review your Logseq settings to ensure that your keys, tokens and secrets are set up correctly.'
          );
          return;
        } else {
          await handleTweets(twitterClient, tweetsArr, uuid);
        }
      },
    });

    // Model for button
    logseq.provideUI({
      key: `${tweetId}`,
      slot,
      reset: true,
      template: `<button class="tweet-btn" data-slot-id="${slot}" data-tweet-id="${tweetId}" data-on-click="tweet-${tweetId}"><i class="ti ti-brand-twitter"></i>: ${noOfChars}/280</button>`,
    });
  });
};
