import { BlockEntity } from '@logseq/libs/dist/LSPlugin';
import { getDateForPage } from 'logseq-dateutils';

export const handleDeleteTweet = (twitterClient: any) => {
  logseq.Editor.registerBlockContextMenuItem(
    'Delete tweet/thread',
    async (e) => {
      const meUser = await twitterClient.v2.me();
      const linkProperty = await logseq.Editor.getBlockProperty(e.uuid, 'link');
      const origBlock: BlockEntity = await logseq.Editor.getBlock(e.uuid);

      const regExp = /\((.*?)\)/;
      const matched = regExp.exec(linkProperty);
      const tweetId = matched[1].substring(matched[1].indexOf('/status/') + 8);

      const tweetThread = await twitterClient.v2.get('tweets/search/recent', {
        query: `conversation_id:${tweetId} from:${meUser.data.id} to:${meUser.data.id}`,
        max_results: 100,
      });

      window.setTimeout(async () => {
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

        const resultCount = tweetThread.meta.result_count;
        if (resultCount !== 0) {
          for (const t of tweetThread.data) {
            try {
              const { data: deletedTweet } = await twitterClient.v2.deleteTweet(
                t.id
              );
              deletedTweet
                ? logseq.App.showMsg(`Tweet ID: ${tweetId} deleted!`)
                : logseq.App.showMsg(
                    `There was an error deleting the tweet (${tweetId}). Please check the developer console and alert the developer.`
                  );
            } catch (e) {
              console.log(e);
              logseq.App.showMsg(
                'There was an error deleting the tweet. Please check the developer console and alert the developer.'
              );
            }
          }

          logseq.Editor.updateBlock(
            e.uuid,
            `(Deleted on ${getDateForPage(
              new Date(),
              logseq.settings.preferredDateFormat
            )}) ${origBlock.content}`
          );

          logseq.Editor.removeBlockProperty(e.uuid, 'link');
        }
      }, 600);
    }
  );
};
