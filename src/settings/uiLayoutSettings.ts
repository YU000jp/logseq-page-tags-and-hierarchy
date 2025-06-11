import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin"
import { t } from "logseq-l10n"

export const uiLayoutSettings = (): SettingSchemaDesc[] => [
    {
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
    {
        key: "booleanUnlinkedReferences",
        title: t("Hide Unlinked References"),
        type: "boolean",
        default: false,
        description: "",
    },
    {
        //Journal Queriesを表示するかどうか
        key: "booleanWideModeJournalQueries",
        title: t("Showing journal queries on today daily page"),
        type: "boolean",
        default: false,
        description: "",
    },
]
