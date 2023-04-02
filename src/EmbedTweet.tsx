import { BlockEntity, IBatchBlock } from "@logseq/libs/dist/LSPlugin.user";
import { getDateForPage } from "logseq-dateutils";
import React, { useState } from "react";
import "./App.css";
import axios from "axios";

type Tweet = {
  text: string;
};

const EmbedTweetOrThread = (props: any) => {
  const { twitterClient } = props;

  const [urlVal, setUrlVal] = useState("");

  const handleForm = (e: any) => {
    setUrlVal(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    if (e.key === "Enter") {
      if (
        !urlVal.startsWith("https://www.twitter.com/") &&
        !urlVal.startsWith("https://twitter.com/") &&
        !urlVal.startsWith("www.twitter.com/") &&
        !urlVal.startsWith("twitter.com/")
      ) {
        logseq.App.showMsg("Please double check the URL again!");
      } else {
        const tweetId = urlVal.substring(urlVal.indexOf("/status/") + 8);
        const tweetResponse = await twitterClient({
          url: `https://api.twitter.com/2/tweets/${tweetId}`,
          method: "get",
          params: {
            expansions: "author_id,attachments.media_keys,referenced_tweets.id",
            "media.fields": "preview_image_url",
            "tweet.fields": "created_at,attachments",
          },
        });

        const threadResponse = await axios({
          url: `https://api.twitter.com/2/tweets/search/recent`,
          method: "get",
          headers: {
            Authorization: `Bearer ${logseq.settings?.bearerToken}`,
          },
          params: {
            query: `conversation_id:${tweetId} from:${tweetResponse.data.data.author_id} to:${tweetResponse.data.data.author_id}`,
            max_results: 100,
          },
        });

        // Insert tweet block
        await logseq.Editor.insertAtEditingCursor(`author:: [${
          tweetResponse.data.includes.users[0].name
        }](https://twitter.com/${tweetResponse.data.includes.users[0].username})
        date:: ${getDateForPage(
          new Date(tweetResponse.data.data.created_at),
          logseq.settings?.preferredDateFormat
        )}
        > ${tweetResponse.data.data.text}`);

        const currBlock = await logseq.Editor.getCurrentBlock();

        if (threadResponse.data.meta.result_count === 0) {
          const blockAfter = await logseq.Editor.insertBlock(
            currBlock!.uuid,
            "",
            {
              before: false,
              sibling: true,
            }
          );

          window.setTimeout(async () => {
            await logseq.Editor.editBlock(blockAfter!.uuid);
          }, 600);
        } else {
          const threadBlock: IBatchBlock = threadResponse.data.data
            .reverse()
            .map((i: Tweet) => ({
              content: i.text,
            }));

          await logseq.Editor.insertBatchBlock(currBlock!.uuid, threadBlock, {
            before: false,
            sibling: false,
          });
        }

        logseq.hideMainUI();
        setUrlVal("");
      }
    }
  };

  return (
    <div className="flex justify-center border border-black" tabIndex={-1}>
      <div className="absolute top-10 bg-white rounded-lg p-3 w-2/3 border">
        <input
          className="url-field appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="https://www.twitter.com/hkgnp/status/1234567890"
          aria-label="Embed tweet or thread"
          name="urlVal"
          onChange={handleForm}
          value={urlVal}
          onKeyDown={(e) => handleSubmit(e)}
        />
      </div>
    </div>
  );
};

export default EmbedTweetOrThread;
// logseq.Editor.registerSlashCommand('thread', async () => {
//   const response = await twitterClient.v2.get('tweets/search/recent', {
//     query: 'conversation_id:1487501059270533124',
//     max_results: 100,
//     expansions: ['in_reply_to_user_id', 'author_id'],
//   });

//   const thread = response.data.filter((i: TweetInThread) => {
//     if (i.in_reply_to_user_id === i.author_id) return i;
//   });

//   console.log(thread.reverse());

//   // Now need to think of a way to key in the URL. Do I use a command palette or?
// });
