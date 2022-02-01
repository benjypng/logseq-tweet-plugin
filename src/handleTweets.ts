import { getDateForPage } from 'logseq-dateutils';

export const handleTweets = async (
  twitterClient: any,
  tweetsArr: any[],
  uuid: string
) => {
  if (tweetsArr.length === 0 || tweetsArr[0]['content'] === '') {
    logseq.App.showMsg(
      'Please include your tweets in child blocks below the button!'
    );
  } else if (tweetsArr.length === 1) {
    // Single tweet
    let tweet: string = tweetsArr[0]['content'];
    if (tweet.length > 280) {
      logseq.App.showMsg(
        'Please ensure that your tweet is less than 280 characters'
      );
      return;
    }

    try {
      if (tweet.includes('#twitter')) {
        tweet = tweet.replace('#twitter', '');
      }

      const { data: createdTweet } = await twitterClient.v2.tweet(tweet);
      console.log('Tweet', createdTweet.id, ':', createdTweet.text);

      logseq.App.showMsg(
        `
      [:div.p-2
        [:h1 "logseq-tweet-plugin"]
        [:h2.text-xl "${tweet}"]]`,
        'success'
      );

      await logseq.Editor.updateBlock(
        uuid,
        `#tweeted on ${getDateForPage(
          new Date(),
          logseq.settings.preferredDateFormat
        )} at ${new Date().toTimeString().substring(0, 5)}`
      );
    } catch (e) {
      console.log(e);
      logseq.App.showMsg(
        `
                      [:div.p-2
                        [:h1 "logseq-tweet-plugin"]
                        [:h2.text-xl "Error! Please check console logs and inform the developer."]]`,
        'error'
      );
      return;
    }
  } else if (tweetsArr.length > 1) {
    // Tweet thread
    try {
      let tweetThread = [];

      for (let i of tweetsArr) {
        if (i['content'].length > 280) {
          logseq.App.showMsg(
            'Please ensure that each tweet is less than 280 characters'
          );
          return;
        } else if (i['content'].length === 0) {
          logseq.App.showMsg('One of your tweets is blank.');
          continue;
        } else {
          if (i['content'].includes('#twitter')) {
            i['content'] = i['content'].replace('#twitter', '');
          }
          tweetThread.push(i['content']);
        }
      }

      const data = await twitterClient.v2.tweetThread(tweetThread);
      console.log(data);

      logseq.App.showMsg(
        `
      [:div.p-2
        [:h1 "logseq-tweet-plugin"]
        [:h2.text-xl "${tweetThread.join(' ')}"]]`,
        'success'
      );

      await logseq.Editor.updateBlock(
        uuid,
        `#tweeted on ${getDateForPage(
          new Date(),
          logseq.settings.preferredDateFormat
        )}`
      );
    } catch (e) {
      console.log(e);
      logseq.App.showMsg(
        `
                      [:div.p-2
                        [:h1 "logseq-tweet-plugin"]
                        [:h2.text-xl "Error! Please check console logs and inform the developer."]]`,
        'error'
      );
      return;
    }
  }
};
