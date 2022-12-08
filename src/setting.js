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
            key: "switch01",
            title: "side by side *",
            type: "enum",
            enumChoices: ["Side", "Bottom"],
            enumPicker: "radio",
            default: "enable",
            description: "Side: Window size limit [min-width 1625px]  | Bottom: Place it on the bottom side.",
        }
    ];
    logseq.useSettingsSchema(settingsTemplate);
};
