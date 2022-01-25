// logseq.Editor.registerSlashCommand('send tweet', async () => {
//   if (!appKey || !appSecret || !accessToken || !accessSecret) {
//     logseq.App.showMsg(
//       'logseq-tweet-plugin: You have not entered your Twitter secrets in the plugin settings.'
//     );
//     return;
//   }

//   const currBlock: BlockEntity = await logseq.Editor.getCurrentBlock();
//   const currBlockWithChildren: BlockEntity = await logseq.Editor.getBlock(
//     currBlock.uuid,
//     { includeChildren: true }
//   );
//   if (
//     !currBlockWithChildren.children ||
//     currBlockWithChildren.children.length === 0
//   ) {
//     // Single tweet
//     let tweet = await logseq.Editor.getEditingBlockContent();
//     try {
//       if (tweet.includes('#twitter')) {
//         tweet = tweet.replace('#twitter', '');
//       }

//       // await twitterClient.v2.tweet(tweet);

//       logseq.App.showMsg(`
//         [:div.p-2
//           [:h1 "logseq-tweet-plugin"]
//           [:h2.text-xl "${tweet}"]]`);
//     } catch (e) {
//       console.log(e);
//       logseq.App.showMsg(`
//         [:div.p-2
//           [:h1 "logseq-tweet-plugin"]
//           [:h2.text-xl "Error! Please check console logs and inform the developer."]]`);
//       return;
//     }
//   } else {
//     // Tweet thread
//     let tweetArr = [];

//     for (let i of currBlockWithChildren.children) {
//       tweetArr.push(i['content']);
//     }

//     tweetArr.unshift(currBlock.content);

//     await twitterClient.v2.tweetThread(tweetArr);
//   }
// });
