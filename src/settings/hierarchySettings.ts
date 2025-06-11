import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin"
import { t } from "logseq-l10n"

export const hierarchySettings = (logseqDbGraph: boolean, logseqMdModel: boolean): SettingSchemaDesc[] => [
    {
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
    {
        key: "booleanRemoveHierarchyPageTitle",
        title: t("Enable Remove page name hierarchy"),
        type: "boolean",
        default: true,
        description: t("Only if the above item is enabled"),
    },
    ...(logseqMdModel === true
        ? [
            {
                key: "booleanWhiteboardSplitHierarchy",
                title: t("Enable Splits of hierarchy on Whiteboard"),
                type: "boolean" as const,
                default: true,
                description: "",
            },
        ]
        : []),
]