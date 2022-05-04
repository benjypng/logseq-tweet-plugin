import { getDateForPage } from "logseq-dateutils";

export const handleTweets = async (
  twitterClient: any,
  tweetsArr: any[],
  uuid: string
) => {
  // Get me usr
  const meUser = await twitterClient({
    url: "https://api.twitter.com/2/users/me",
    method: "get",
  });
  const userName = meUser.data.data.username;

  // Begin handle tweet
  if (tweetsArr.length === 0 || tweetsArr[0]["content"] === "") {
    logseq.App.showMsg(
      "Please include your tweets in child blocks below the button!"
    );
  } else if (tweetsArr.length === 1) {
    // Single tweet
    let tweet: string = tweetsArr[0]["content"];
    if (tweet.length > 280) {
      logseq.App.showMsg(
        "Please ensure that your tweet is less than 280 characters"
      );
      return;
    }

    try {
      if (tweet.includes("#twitter")) {
        tweet = tweet.replace("#twitter", "");
      }

      const response = await twitterClient({
        url: "https://api.twitter.com/2/tweets",
        method: "post",
        data: {
          text: tweet,
        },
      });
      console.log(
        `SENT! Tweet ID: ${response.data.data.id} - ${response.data.data.text}`
      );

      logseq.App.showMsg(
        `
      [:div.p-2
        [:h1 "logseq-tweet-plugin"]
        [:h2.text-xl "${tweet}"]]`,
        "success"
      );

      await logseq.Editor.updateBlock(
        uuid,
        `${logseq.settings.customHashtag} ${getDateForPage(
          new Date(),
          logseq.settings.preferredDateFormat
        )} at ${new Date().toTimeString().substring(0, 5)}
link:: [https://www.twitter.com/${userName}/status/${
          response.data.data.id
        }](https://www.twitter.com/${userName}/status/${response.data.data.id})`
      );
    } catch (e) {
      console.log(e);
      logseq.App.showMsg(
        `
                      [:div.p-2
                        [:h1 "logseq-tweet-plugin"]
                        [:h2.text-xl "Error! Please check console logs and inform the developer."]]`,
        "error"
      );
      return;
    }
  } else if (tweetsArr.length > 1) {
    // Tweet thread
    try {
      let tweetThread = [];
      let tweetIds: string[] = [];

      // Return object: {"data":{"id":"1521786371467137024","text":"test"}}
      for (let i of tweetsArr) {
        if (i["content"].length > 280) {
          logseq.App.showMsg(
            "Please ensure that each tweet is less than 280 characters"
          );
          return;
        } else if (i["content"].length === 0) {
          logseq.App.showMsg("One of your tweets is blank.");
          continue;
        } else {
          if (i["content"].includes("#twitter")) {
            i["content"] = i["content"].replace("#twitter", "");
          }
          tweetThread.push(i["content"]);
        }
      }

      for (let i = 0; i < tweetThread.length; i++) {
        if (i === 0) {
          const response = await twitterClient({
            url: "https://api.twitter.com/2/tweets",
            method: "post",
            data: {
              text: tweetThread[i],
            },
          });
          tweetIds.push(response.data.data.id);
          console.log(
            `SENT! Tweet ID: ${response.data.data.id} - ${response.data.data.text}`
          );
        } else {
          const response = await twitterClient({
            url: "https://api.twitter.com/2/tweets",
            method: "post",
            data: {
              text: tweetThread[i],
              reply: {
                in_reply_to_tweet_id: tweetIds[i - 1],
              },
            },
          });
          tweetIds.push(response.data.data.id);
          console.log(
            `SENT! Tweet ID: ${response.data.data.id} - ${response.data.data.text}`
          );
        }
      }

      console.log(tweetIds);
      logseq.App.showMsg(
        `
      [:div.p-2
        [:h1 "logseq-tweet-plugin"]
        [:h2.text-xl "${tweetThread.join(" ")}"]]`,
        "success"
      );

      await logseq.Editor.updateBlock(
        uuid,
        `${logseq.settings.customHashtag} ${getDateForPage(
          new Date(),
          logseq.settings.preferredDateFormat
        )} at ${new Date().toTimeString().substring(0, 5)}
link:: [https://www.twitter.com/${meUser.data.data.username}/status/${
          tweetIds[0]
        }](https://www.twitter.com/${meUser.data.data.username}/status/${
          tweetIds[0]
        })`
      );
    } catch (e) {
      console.log(e);
      logseq.App.showMsg(
        `[:div.p-2
         [:h1 "logseq-tweet-plugin"]
         [:h2.text-xl "Error! Please check console logs and inform the developer."]]`,
        "error"
      );
      return;
    }
  }
};
