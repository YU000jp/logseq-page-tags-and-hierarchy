import { SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"

/* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
export const settingsTemplate = (): SettingSchemaDesc[] => [

    {// Hierarchy of Page Name
        key: "heading0000",
        // ページ名の階層に関する設定
        title: t("Settings relating to page name hierarchy"),
        type: "heading",
        default: null,
        description: "",
    },
    {
        key: "booleanSplitHierarchy",
        // ページ名の階層をリンクに分割する機能を有効にする
        title: t("Enable Split the hierarchy of a page name into links"),
        type: "boolean",
        default: true,
        // ジャーナルと日次ページは除外します。
        description: t("Journals or daily pages are excluded."),
    },
    {//ページ名の階層を取り除く機能を有効にする (上の項目が有効な場合のみ)
        key: "booleanRemoveHierarchyPageTitle",
        title: t("Enable Remove page name hierarchy"),
        type: "boolean",
        default: true,
        description: t("Only if the above item is enabled"),
    },
    {// ホワイトボードで、ページ名の階層を分割する機能を有効にする
        key: "booleanWhiteboardSplitHierarchy",
        title: t("Enable Splits of hierarchy on Whiteboard"),
        type: "boolean",
        default: true,
        description: "",
    },
    {// Hierarchy
        key: "heading0010",
        title: t("Hierarchy settings in page content"),
        type: "heading",
        default: null,
        description: "",
    },
    {// 標準で提供されている階層から、重複を削除する
        key: "booleanModifyHierarchy",
        title: t("Enable Remove duplicates from the standard hierarchy"),
        type: "boolean",
        default: true,
        // ページ名と重複する階層を削除
        description: t("Remove hierarchies that overlap with the page name"),
    },
    {// 階層のサブレベル1段階のみを表示する 
        key: "booleanHierarchyForFirstLevelOnly",
        // サブ階層のみを表示する
        title: t("Enable Show only sub-levels of the hierarchy"),
        type: "boolean",
        default: false,
        description: "",
    },

    {// Page View UI
        key: "heading0020",
        title: t("Page view UI settings"),
        type: "heading",
        default: null,
        //ページコンテンツにある、階層とページタグを標準とは異なる位置に配置します。
        description: t("Position hierarchy and page tags in the page content differently from the standard."),
    },
    {
        key: "placeSelect",
        title: t("Select mode"),
        type: "enum",
        enumChoices: ["unset", "side", "bottom", "wide view"],
        default: "unset",
        // unset: 標準のまま変更しません。
        // side: 右側上下のサイドスペースに配置します。
        // bottom: 下部に固定ポップアップを表示します。表示量が制限されます。
        // wide view: 画面を横に広く使うレイアウトが適用されます。横スクロールが必要です。作業スペースが小さい場合は、ズームインまたは右サイドバーで開きます。
        description: `
        - unset: ${t("Do not change the standard.")}
        - side: ${t("Position in the right side space. Top and bottom.")}
        - bottom: ${t("Display a fixed popup at the bottom. The amount of display is limited.")}
        - wide view: ${t("A layout that uses the screen width. Horizontal scrolling is required.")}
                     ${t("If the workspace is small, zoom in or open it in the right sidebar.")}`,
    },
    {// Unlinked Referencesを表示しない
        key: "booleanUnlinkedReferences",
        title: t("Hide Unlinked References"),
        type: "boolean",
        default: false,
        description: "",
    },
    {//wide viewモード以外もOKにした
        //Journal Queriesを表示するかどうか
        key: "booleanWideModeJournalQueries",
        title: t("Showing journal queries on today daily page"),
        type: "boolean",
        default: false,
        description: "",
    },
    // {// Linked Referencesで、tagsプロパティがある場合はそのブロックを省略する
    //     key: "booleanLinkedRefRemoveTagsProperty",
    //     title: t("Omit the block if the Linked References contain tags property")+"🆕",
    //     type: "boolean",
    //     default: false,
    //     // "Linked References"をスッキリさせます。デメリットは、tagsプロパティを含むブロックが他の情報を含んでいても、それらが表示されません。隠されるため、refの件数が一致しません。
    //     description: t("Clean up Linked References. The disadvantage is that if a block containing the tags property contains other information, it will not be displayed. It is hidden, so the number of refs does not match."),
    // },


    {//wide viewモードのみ
        key: "heading0030",
        title: t("Wide view layout settings"),
        type: "heading",
        default: null,
        description: "",
    },
    {//Switch Table of Contents
        key: "booleanTableOfContents",
        title: t("Enable table of contents on a page"),
        type: "boolean",
        default: true,
        description: "",
    },
    {//Table of Contentsをデフォルトで隠す
        key: "booleanTableOfContentsHide",
        title: t("Collapsed table of contents by default"),
        type: "boolean",
        default: true,
        description: "",
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
    {//wide viewモード専用。
        key: "heading0040",
        title: t("Wide view layout position settings"),
        type: "heading",
        default: "",
        //横の並び順として、1が左側にくる、6が右側にくる
        description: t("1 is on the left side, 6 is on the right side.")
    },
    {
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

