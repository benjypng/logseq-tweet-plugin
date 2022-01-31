import React, { useState } from 'react';
import './App.css';

type TweetInThread = {
  author_id: string;
  in_reply_to_user_id: string;
  id: string;
  text: string;
};

const EmbedTweetOrThread = (props: any) => {
  const { twitterClient } = props;

  const [urlVal, setUrlVal] = useState('');

  const handleForm = (e: any) => {
    setUrlVal(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    if (e.key === 'Enter') {
      if (
        !urlVal.startsWith('https://www.twitter.com/') &&
        !urlVal.startsWith('https://twitter.com/') &&
        !urlVal.startsWith('www.twitter.com/') &&
        !urlVal.startsWith('twitter.com/')
      ) {
        logseq.App.showMsg('Please double check the URL again!');
      } else {
        const tweetResponse = await twitterClient.v2.get(
          `tweets/${urlVal.substring(urlVal.indexOf('/status/') + 8)}`,
          { expansions: ['author_id'], 'user.fields': 'name' }
        );

        console.log(tweetResponse.data);
        console.log(tweetResponse.includes);

        const threadResponse = await twitterClient.v2.get(
          'tweets/search/recent',
          {
            query: `conversation_id:${urlVal.substring(
              urlVal.indexOf('/status/') + 8
            )} from:${tweetResponse.data.author_id} to:${
              tweetResponse.data.author_id
            }`,
            max_results: 100,
          }
        );

        console.log(threadResponse.data.reverse());

        logseq.hideMainUI();
        setUrlVal('');
      }
    }
  };

  return (
    <div className="flex justify-center border border-black" tabIndex={-1}>
      <div className=" absolute top-10 bg-white rounded-lg p-3 w-1/3 border">
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
