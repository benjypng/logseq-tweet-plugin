import '@logseq/libs';
import TwitterApi from 'twitter-api-v2';

const main = () => {
  console.log('logseq-tweet-plugin loaded');

  const { appKey, appSecret, accessToken, accessSecret } = logseq.settings;

  const twitterClient = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  logseq.Editor.registerSlashCommand('send tweet', async () => {
    if (!appKey || !appSecret || !accessToken || !accessSecret) {
      logseq.App.showMsg(
        'logseq-tweet-plugin: You have not entered your Twitter secrets in the plugin settings.'
      );
      return;
    }

    const text = await logseq.Editor.getEditingBlockContent();

    try {
      await twitterClient.v2.tweet(text);
      logseq.App.showMsg(`
      [:div.p-2 
        [:h1 "logseq-tweet-plugin"]
        [:h2.text-xl "${text}"]]`);
    } catch (e) {
      console.log(e);
      logseq.App.showMsg(`
      [:div.p-2 
        [:h1 "logseq-tweet-plugin"]
        [:h2.text-xl "Error! Please check console logs and inform the developer."]]`);
      return;
    }
  });
};

logseq.ready(main).catch(console.error);
