export const callSettings = () => {
  const settings = [
    {
      key: "appKey",
      type: "string",
      default: "",
      title: "API key",
    },
    {
      key: "appSecret",
      type: "string",
      default: "",
      title: "API secret",
    },
    {
      key: "accessToken",
      type: "string",
      default: "",
      title: "Access token",
    },
    {
      key: "accessSecret",
      type: "string",
      default: "",
      title: "Access secret",
    },
    {
      key: "customHashtag",
      type: "string",
      default: "#tweeted on",
      description: "Define the header block for your tweet.",
      title: "Custom hashtag",
    },
  ];

  logseq.useSettingsSchema(settings);
};
