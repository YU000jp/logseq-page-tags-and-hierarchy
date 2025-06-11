import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin"
import { t } from "logseq-l10n"

export const wideViewSettings = (): SettingSchemaDesc[] => [
    {
        key: "heading0030",
        title: t("Wide view layout settings"),
        type: "heading",
        default: null,
        description: "",
    },
    {
        key: "booleanTableOfContents",
        title: t("Enable table of contents on a page"),
        type: "boolean",
        default: true,
        description: "",
    },
    {
        key: "booleanTableOfContentsHide",
        title: t("Collapsed table of contents by default"),
        type: "boolean",
        default: true,
        description: "",
    },
    //20240120
    {
        key: "tocRemoveWordList",
        title: t("Remove words from table of contents"),
        type: "string",
        inputAs: "textarea",
        default: "",
        description: t("Separate with line breaks"),
    },
    {
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
    {
        key: "enumTableOfContents",
        title: t("Table of contents position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "2",
        description: "default: 2",
    },
    {
        key: "enumLinkedReferences",
        title: t("Linked references position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "3",
        description: "default: 3",
    },
    {
        key: "enumUnlinkedReferences",
        title: t("Unlinked references position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "4",
        description: "default: 4",
    },
    {
        key: "enumPageHierarchy",
        title: t("Page hierarchy position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "5",
        description: "default: 5",
    },
    {
        key: "enumPageTags",
        title: t("Page tags position"),
        type: "enum",
        enumChoices: ["1", "2", "3", "4", "5", "6"],
        default: "6",
        description: "default: 6",
    },
]
