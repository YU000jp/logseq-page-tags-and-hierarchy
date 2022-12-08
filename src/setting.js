export const settingUI = () => {
    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
    const settingsTemplate = [
        {
            key: "heading00",
            title: "*Please reboot Logseq to reflect styles.",
            type: "heading",
            default: "",
            description: "",
        },
        {
            key: "switchMain",
            title: "side by side *",
            type: "enum",
            enumChoices: ["Side", "Bottom"],
            enumPicker: "radio",
            default: "Side",
            description: "Side: Window size limit [min-width 1625px]  | Bottom: Place it on the bottom side.",
        },
        {
            key: "switchWideModeLimit",
            title: "set wide mode max-width: 1450px *",
            type: "enum",
            enumChoices: ["Enable", "Normal"],
            enumPicker: "radio",
            default: "Enable",
            description: "enable: wide mode(shortcut `(Esc) + t → c`) limit width",
        },
        {
            key: "switchPageLinkedReferences",
            title: "Page Linked References height limit  *",
            type: "enum",
            enumChoices: ["Enable","Normal"],
            enumPicker: "radio",
            default: "Enable",
            description: "",
        }

    ];
    logseq.useSettingsSchema(settingsTemplate);
};
