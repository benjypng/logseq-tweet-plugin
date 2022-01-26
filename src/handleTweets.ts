export const handleTweets = async (twitterClient: any, tweetsArr: any[]) => {
  if (tweetsArr.length === 0 || tweetsArr[0]['content'] === '') {
    logseq.App.showMsg(
      'Please include your tweets in child blocks below the button!'
    );
  } else if (tweetsArr.length === 1) {
    // Single tweet
    let tweet: string = tweetsArr[0]['content'];
    if (tweet.length > 160) {
      logseq.App.showMsg(
        'Please ensure that your tweet is less than 160 characters'
      );
      return;
    }

    try {
      if (tweet.includes('#twitter')) {
        tweet = tweet.replace('#twitter', '');
      }

      console.log(`Tweeting ${tweet}`);
      //   await twitterClient.v2.tweet(tweet);

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
        if (i['content'].length > 160) {
          logseq.App.showMsg(
            'Please ensure that each tweet is less than 160 characters'
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

      logseq.App.showMsg(`
          [:div.p-2
            [:h1 "logseq-tweet-plugin"]
            [:h2.text-xl "Tweet thread sent!"]]`);

      console.log(tweetThread);
      //   await twitterClient.v2.tweetThread(tweetThread);
    } catch (e) {
      console.log(e);
      logseq.App.showMsg(`
                      [:div.p-2
                        [:h1 "logseq-tweet-plugin"]
                        [:h2.text-xl "Error! Please check console logs and inform the developer."]]`);
      return;
    }
  }
};
