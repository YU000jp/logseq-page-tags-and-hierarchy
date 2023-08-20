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
    {//ページタイトルの階層を取り除く (上の項目が有効な場合のみ)
        key: "booleanRemoveHierarchyPageTitle",
        title: "Remove hierarchy of the page title (if the above option is enabled)",
        type: "boolean",
        default: true,
        description: "default: true",
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
        title: "Enable table of contents on a page (wide view only)",
        type: "boolean",
        default: true,
        description: "default: true",
    },
    {//Table of Contentsをデフォルトで隠す
        key: "booleanTableOfContentsHide",
        title: "Hide table of contents by default (wide view only)",
        type: "boolean",
        default: false,
        description: "default: false",
    },
    {//wide viewモード、Journal Queriesを表示するかどうか
        key: "booleanWideModeJournalQueries",
        title: "Showing journal queries on today journal page (wide view only)",
        type: "boolean",
        default: false,
        description: "default: false *When on the single journal page.",
    },
    {//wide viewモード、横の並び順 SCHEDULED AND DEADLINEの位置
        key: "enumScheduleDeadline",
        title: "Scheduled and deadline position (wide view only)",
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "1",
        description: "default: 1 *It is not displayed only when necessary",
    },
    {//wide viewモード、横の並び順 Table of Contentsの位置
        key: "enumTableOfContents",
        title: "Table of contents position (wide view only)",
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "2",
        description: "default: 2 *It is not displayed only when necessary",
    },
    {//wide viewモード、横の並び順 Linked Referencesの位置
        key: "enumLinkedReferences",
        title: "Linked references position (wide view only)",
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "3",
        description: "default: 3",
    },
    {//wide viewモード、横の並び順 Unlinked Referencesの位置
        key: "enumUnlinkedReferences",
        title: "Unlinked references position (wide view only)",
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "4",
        description: "default: 4",
    },
    {//wide viewモード、横の並び順 Page-Hierarchyの位置
        key: "enumPageHierarchy",
        title: "Page hierarchy position (wide view only)",
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "5",
        description: "default: 5 *It is not displayed only when necessary",
    },
    {//wide viewモード、横の並び順 Page-Tagsの位置
        key: "enumPageTags",
        title: "Page tags position (wide view only)",
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "6",
        description: "default: 6 *It is not displayed only when necessary",
    },
];

