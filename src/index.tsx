import '@logseq/libs';
import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import TwitterApi from 'twitter-api-v2';

// Generate unique identifier
const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '');

const main = () => {
  console.log('logseq-tweet-plugin loaded');

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

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    // Get uuid of payload so that child blocks can be retrieved for the board
    const uuid = payload.uuid;
    const [type] = payload.arguments;
    const id = type.split('_')[1]?.trim();
    const tweetId = `tweet_${id}`;

    if (!type.startsWith(':tweet_')) return;

    const buttonBlock = await logseq.Editor.getBlock(uuid, {
      includeChildren: true,
    });

    // Only need 1 level of children
    const tweetsArr = buttonBlock.children;

    logseq.provideModel({
      tweet() {
        if (tweetsArr.length === 0 || tweetsArr[0]['content'] === '') {
          logseq.App.showMsg(
            'Please include your tweets in child blocks below the button!'
          );
        } else if (tweetsArr.length === 1) {
          // Single tweet
          let tweet: string = tweetsArr[0]['content'];

          try {
            if (tweet.includes('#twitter')) {
              tweet = tweet.replace('#twitter', '');
            }

            // await twitterClient.v2.tweet(tweet);
            console.log(`Tweeting ${tweet}`);

            logseq.App.showMsg(`
                        [:div.p-2
                          [:h1 "logseq-tweet-plugin"]
                          [:h2.text-xl "${tweet}"]]`);
          } catch (e) {
            console.log(e);
            logseq.App.showMsg(`
                        [:div.p-2
                          [:h1 "logseq-tweet-plugin"]
                          [:h2.text-xl "Error! Please check console logs and inform the developer."]]`);
            return;
          }
        } else if (tweetsArr.length > 1) {
          // Tweet thread

          try {
            let tweetThread = [];

            for (let i of tweetsArr) {
              tweetThread.push(i['content']);
            }

            logseq.App.showMsg(`
            [:div.p-2
              [:h1 "logseq-tweet-plugin"]
              [:h2.text-xl "Tweet thread sent!"]]`);

            // await twitterClient.v2.tweetThread(tweetArr);
            console.log(tweetThread);
          } catch (e) {
            console.log(e);
            logseq.App.showMsg(`
                        [:div.p-2
                          [:h1 "logseq-tweet-plugin"]
                          [:h2.text-xl "Error! Please check console logs and inform the developer."]]`);
            return;
          }
        }
      },
    });

    logseq.provideUI({
      key: `${tweetId}`,
      slot,
      reset: true,
      template: `<button class="tweet-btn" data-slot-id="${slot}" data-tweet-id="${tweetId}" data-on-click="tweet"><i class="ti ti-brand-twitter"></i>: 0/160</button>`,
    });
  });
};

logseq.ready(main).catch(console.error);
