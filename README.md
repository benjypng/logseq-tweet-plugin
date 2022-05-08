[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

> In v2.0.0 onwards, your `Bearer token` is required to embed tweet threads.

# Overview

Easily tweet from within Logseq!

![](/screenshots/demo.gif)

# Installation

If you find it in the marketplace, do install it from there for a more seamless experience.

If you can't find the plugin in the marketplace, please [download the latest release here](https://github.com/hkgnp/logseq-tweet-plugin/releases) and manually install the plugin in Logseq.

# Usage

## Tweeting single tweets and tweet threads

1. Install the plugin as above.

2. Navigate to the plugin settings.

3. Copy and paste the code below and replace the values with your own (from the developer console). Please refer to the instructions in the next section to find out how to get your keys and secrets.

```json
{
  "appKey": "API Key",
  "appSecret": "API Secret",
  "accessToken": "Access Token",
  "accessSecret": "Access Token Secret"
}
```

4. Restart Logseq.

5. Start by typing `/tweet` anywhere. You can then start tweeting in the next block.

6. If you only have 1 block, you will be sending just 1 tweet.

7. If you have multiple blocks, you will be sending a tweet thread.

8. When you are done composing your tweet/s, simply hit the big blue tweet button to send off your tweets!

## Deleting tweets & tweet threads

Once you have tweeted, the tweet button would disappear and be replaced by the date/time stamp of the tweet/thread, and a link to the tweet (or first tweet of the thread). To delete this tweet/thread, right click on the block and select `Delete tweet/thread`.

Note: If you try to delete your tweet immediately after you post it, all the tweets may not get deleted as the Twitter API needs some time to be updated. Do give it a few seconds before initiating the delete.

## Embedding tweet or thread

This plugin also allows you to embed tweets and threads. Simply type `/Embed tweet/thread` and enter the url of the **first** tweet of the thread. It will automaticaly scan to see if it's a single tweet or thread and embed it accordingly/and embed it accordingly.

# Customisation

## Setting custom hashtags for successful tweets

Successful tweets will look something like this: `#tweeted on Feb 22nd, 2022 at 15:34`. You can replace `#tweeted on` with your own custom hashtag by changing the plugin settings.

```
{
  "customHashtag": "#tweeted on"
}
```

# How to get your Twitter keys, secrets and tokens

1. [Sign up for a developer account](https://developer.twitter.com/en/docs/developer-portal/overview) and log in.

2. Go to your [developer portal](https://developer.twitter.com/en/portal/dashboard).

3. Create a project.

4. Go to your app settings and ensure that your user authentication settings are set to OAuth 1.0a. It should reflect as below after you're done:

![](/screenshots/user-auth-settings2.png)

5. Go to your keys and tokens page using the tab below:

![](/screenshots/keys-tokens-tab.png)

6. On this page, generate your:

- API Key
- API Secret
- Access Token
- Access Token Secret
- Bearer Token

7. The information in (6) will need to go in the plugin settings as above.

# Important Notes

- All blank blocks in a Tweet thread will be ignored when sending the tweet (see demo above). There will be a popup indicating so, but the tweet will still get sent.
- Will be looking to add abiility to schedule tweets when I have the time (I hope).
- Uploading videos and images are however not possible afaik as the plugin sandbox does not allow retrieval of assets saved into Logseq as an "attachment". However, will look into supporting including linked videos and images through URLs to them.

# Credits

- [Twitter API v2](https://github.com/plhery/node-twitter-api-v2)
