import { SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"

/* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
export const settingsTemplate = (): SettingSchemaDesc[] => [

    {// Hierarchy of Page Name
        key: "headingHierarchyOfPageName",
        title: t("Hierarchy of page-name settings"),
        type: "heading",
        default: "",
        description: "",
    },
    {
        key: "booleanSplitHierarchy",
        title: t("Split page title hierarchy as links (non-journals)"),
        type: "boolean",
        default: true,
        //この項目のみを有効にしたい場合は次の設定項目をunsetにする
        description: "default: true",
    },
    {//ページ名の階層を取り除く (上の項目が有効な場合のみ)
        key: "booleanRemoveHierarchyPageTitle",
        title: t("Remove hierarchies of the page title (if the above option is enabled)"),
        type: "boolean",
        default: true,
        description: "default: true",
    },
    {
        key: "booleanWhiteboardSplitHierarchy",
        title: t("Splits of hierarchies on Whiteboard"),
        type: "boolean",
        default: true,
        description: "default: true",
    },
    {// Hierarchy
        key: "headingHierarchy",
        title: t("Hierarchy settings"),
        type: "heading",
        default: "",
        description: "",
    },
    {
        key: "booleanModifyHierarchy",
        title: t("Delete the hierarchy from the beginning level"),
        type: "boolean",
        default: true,
        description: t("Modify the display of hierarchy to be original rather than standard."),
    },
    {//上記が有効な場合のみ
        // 階層のサブレベル1段階のみを表示する
        key: "booleanHierarchyForFirstLevelOnly",
        title: t("Hierarchy for first level only"),
        type: "boolean",
        default: false,
        description: "default: false",
    },

    {// Page View
        key: "headingPageView",
        title: t("Page view settings"),
        type: "heading",
        default: "",
        description: "",
    },
    {
        key: "placeSelect",
        title: t("Select mode"),
        type: "enum",
        enumChoices: ["unset", "side", "bottom", "wide view"],
        default: "unset",
        description: t("[unset, side, bottom, wide view]") + ` [more details](${t("https://github.com/YU000jp/logseq-page-tags-and-hierarchy/wiki/Page-View-UI")})`,
    },
    {// Unlinked Referencesを表示しない
        key: "booleanUnlinkedReferences",
        title: t("Hide unlinked references"),
        type: "boolean",
        default: false,
        description: "default: false",
    },

    {//wide viewモードのみ
        key: "headingWideView mode",
        title: t("Wide view mode settings"),
        type: "heading",
        default: "",
        description: `
        - ${t("Require scroll to right space.")}
        - ${t("If workspace is small, zoom in or open it in the right sidebar.")}
        `,
    },
    {//Switch Table of Contents
        key: "booleanTableOfContents",
        title: t("Enable table of contents on a page"),
        type: "boolean",
        default: true,
        description: "default: true",
    },
    {//Table of Contentsをデフォルトで隠す
        key: "booleanTableOfContentsHide",
        title: t("Collapsed table of contents by default"),
        type: "boolean",
        default: false,
        description: "default: false",
    },
    //20240120
    {//Table of Contents、削除する単語リスト 改行区切り
        key: "tocRemoveWordList",
        title: t("Remove words from table of contents"),
        type: "string",
        inputAs: "textarea",
        default: "",
        description: t("Separate with line breaks"),
    },
    {//wide viewモード、Journal Queriesを表示するかどうか
        key: "booleanWideModeJournalQueries",
        title: t("Showing journal queries on today journal page"),
        type: "boolean",
        default: false,
        description: "default: false",
    },
    {//wide viewモード、横の並び順 SCHEDULED AND DEADLINEの位置
        key: "enumScheduleDeadline",
        title: t("Scheduled and deadline position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "1",
        description: "default: 1",
    },
    {//wide viewモード、横の並び順 Table of Contentsの位置
        key: "enumTableOfContents",
        title: t("Table of contents position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "2",
        description: "default: 2",
    },
    {//wide viewモード、横の並び順 Linked Referencesの位置
        key: "enumLinkedReferences",
        title: t("Linked references position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "3",
        description: "default: 3",
    },
    {//wide viewモード、横の並び順 Unlinked Referencesの位置
        key: "enumUnlinkedReferences",
        title: t("Unlinked references position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "4",
        description: "default: 4",
    },
    {//wide viewモード、横の並び順 Page-Hierarchyの位置
        key: "enumPageHierarchy",
        title: t("Page hierarchy position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "5",
        description: "default: 5",
    },
    {//wide viewモード、横の並び順 Page-Tagsの位置
        key: "enumPageTags",
        title: t("Page tags position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "6",
        description: "default: 6",
    },
];

