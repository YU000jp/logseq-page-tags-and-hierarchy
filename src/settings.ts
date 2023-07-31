import { SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user";

/* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
export const settingsTemplate: SettingSchemaDesc[] = [
    {
        key: "booleanSplitHierarchy",
        title: "Split hierarchy of the page title link (non-journal)",
        type: "boolean",
        default: true,
        //この項目のみを有効にしたい場合は次の設定項目をnoneにする
        description: "default: true , *Journals is not split , *If you only want to use this feature, set the following option to 'unset'.",
    },
    {
        key: "placeSelect",
        title: "Place on side by side or bottom",
        type: "enum",
        enumChoices: ["side", "bottom", "unset"],
        default: "Side",
        description: "side: min-width 1560px , none: if select 'unset', other settings are invalid",//noneの場合は他の設定も無効になる
    },
    {
        key: "booleanWideModeLimit",
        title: "When in wide mode, set the main content max-width to 1450px",
        type: "boolean",
        default: true,
        description: "*wide mode(shortcut `(Esc) + t → c`)",
    },
    {
        key: "booleanDisplayIfSmaller",
        title: "When the window size is less than 1560px, do not display it",
        type: "boolean",
        default: true,
        description: "default: true",
    },
    {
        key: "booleanModifyHierarchy",
        title: "modify the display of hierarchy to be original rather than standard",
        type: "boolean",
        default: true,
        description: "",
    },
];

