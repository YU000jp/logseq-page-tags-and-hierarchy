import { SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user";

/* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
export const settingsTemplate = (defaultMode: string): SettingSchemaDesc[] => [
    {
        key: "booleanSplitHierarchy",
        title: "🆙Split hierarchy of the page title link (non-journals)",
        type: "boolean",
        default: true,
        //この項目のみを有効にしたい場合は次の設定項目をunsetにする
        description: "default: true , *Journals is not split , *If you only want to use this feature, set the following option to 'unset'.",
    },
    {
        key: "placeSelect",
        title: "Select mode",
        type: "enum",
        enumChoices: ["wide view", "side", "bottom", "unset"],
        default: defaultMode || "side",
        description: `
        🆕wide view: *require scroll to right space , If workspace is small, zoom in or open it in the right sidebar , Logseq v0.9.11 or later⚠️
        side: *min-width 1560px
        bottom: *min-width 1560px
        🆙unset: *for only use split hierarchy feature
        `,//noneの場合は他の設定も無効になる
    },
    {
        key: "booleanModifyHierarchy",
        title: "For non-\"unset\", modify the display of hierarchy to be original rather than standard",
        type: "boolean",
        default: true,
        description: "",
    },
    {
        key: "booleanDisplayIfSmaller",
        title: "Bottom mode, when the window size is less than 1560px, do not display it",
        type: "boolean",
        default: true,
        description: "default: true",
    },
    {//Switch Table of Contents
        key: "booleanTableOfContents",
        title: "Enable table of contents on a page",
        type: "boolean",
        default: true,
        description: "default: true",
    },
    {//Table of Contentsをデフォルトで隠す
        key: "booleanTableOfContentsHide",
        title: "Hide table of contents by default",
        type: "boolean",
        default: false,
        description: "default: false",

    },
];

