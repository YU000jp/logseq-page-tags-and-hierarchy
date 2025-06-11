import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin"
import { t } from "logseq-l10n"

export const pageContentHierarchySettings = (): SettingSchemaDesc[] => [
    {
        key: "heading0010",
        title: t("Hierarchy settings in page content"),
        type: "heading",
        default: null,
        description: "",
    },
    {
        key: "booleanModifyHierarchy",
        title: t("Enable Remove duplicates from the standard hierarchy"),
        type: "boolean",
        default: true,
        // ページ名と重複する階層を削除
        description: t("Remove hierarchies that overlap with the page name"),
    },
    {
        key: "booleanHierarchyForFirstLevelOnly",
        // サブ階層のみを表示する
        title: t("Enable Show only sub-levels of the hierarchy"),
        type: "boolean",
        default: false,
        description: "",
    },
]
