export const handleDeleteTweet = (twitterClient: any) => {
  logseq.Editor.registerBlockContextMenuItem(
    'Delete tweet/thread',
    async (e) => {
      const linkProperty = await logseq.Editor.getBlockProperty(e.uuid, 'link');

      const regExp = /\((.*?)\)/;
      const matched = regExp.exec(linkProperty);

      if (
        !matched[1].startsWith('https://www.twitter.com/status/') ||
        !linkProperty
      ) {
        logseq.App.showMsg(
          'You can only delete tweets that have been posted.',
          'error'
        );
      }

      const tweetId = matched[1].substring(matched[1].indexOf('/status/') + 8);

      try {
        const { data: deletedTweet } = await twitterClient.v2.deleteTweet(
          tweetId
        );

        deletedTweet
          ? logseq.App.showMsg(`Tweet ID: ${tweetId} deleted!`)
          : logseq.App.showMsg(
              'There was an error deleting the tweet. Please check the developer console and alert the developer.'
            );
      } catch (e) {
        console.log(e);
        logseq.App.showMsg(
          'There was an error deleting the tweet. Please check the developer console and alert the developer.'
        );
      }
    }
  );
};
