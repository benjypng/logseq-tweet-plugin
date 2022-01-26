<a href="https://www.buymeacoffee.com/hkgnp.dev" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/arial-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

# Overview

Easily tweet from within Logseq!

![](/screenshots/demo.gif)

# Installation

If you find it in the marketplace, do install it from there for a more seamless experience.

If you can't find the plugin in the marketplace, please [download the latest release here](https://github.com/hkgnp/logseq-tweet-plugin/releases) and manually install the plugin in Logseq.

# Usage

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

7. The information in (6) will need to go in the plugin settings as above.

# Important Notes

- All blank blocks in a Tweet thread will be ignored when sending the tweet (see demo above). There will be a popup indicating so, but the tweet will still get sent.
- Will be looking to add abiility to schedule tweets and upload images when I have the time (I hope).
