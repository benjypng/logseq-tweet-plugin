import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

export const callSettings = () => {
  const settings: SettingSchemaDesc[] = [
    {
      key: "appKey",
      type: "string",
      default: "",
      title: "API key",
      description: "Enter your API key from the developer console.",
    },
    {
      key: "appSecret",
      type: "string",
      default: "",
      title: "API secret",
      description: "Enter your API key from the developer console.",
    },
    {
      key: "accessToken",
      type: "string",
      default: "",
      title: "Access token",
      description: "Enter your API key from the developer console.",
    },
    {
      key: "accessSecret",
      type: "string",
      default: "",
      title: "Access secret",
      description: "Enter your API key from the developer console.",
    },
    {
      key: "bearerToken",
      type: "string",
      default: "",
      title: "Bearer token",
      description: "Enter your API key from the developer console.",
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
