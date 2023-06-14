import "@logseq/libs";
import { SettingSchemaDesc, LSPluginBaseInfo } from "@logseq/libs/dist/LSPlugin.user";
import CSSmain from './main.css?inline';

const main = () => {

    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
    const settingsTemplate: SettingSchemaDesc[] = [
        {
            key: "placeSelect",
            title: "Place on side by side or bottom",
            type: "enum",
            enumChoices: ["side", "bottom"],
            default: "Side",
            description: "side: min-width 1560px",
        },
        {
            key: "booleanWideModeLimit",
            title: "When in wide mode, set the main content max-width to 1450px",
            type: "boolean",
            default: true,
            description: "*wide mode(shortcut `(Esc) + t → c`)",
        },
    ];
    logseq.useSettingsSchema(settingsTemplate);

    //CSS minify https://csscompressor.com/
    logseq.provideStyle({ key: "th-main", style: CSSmain });

    //Bottom
    if (logseq.settings?.placeSelect === "bottom") parent.document.body.classList.add('th-bottom');
    //WideModeLimit
    if (logseq.settings?.booleanWideModeLimit === true) parent.document.body.classList.add('th-WideModeLimit');

    logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
        if (oldSet.placeSelect !== "side" && newSet.placeSelect === "side") {
            parent.document.body.classList!.remove('th-bottom');
        } else
            if (oldSet.placeSelect !== "bottom" && newSet.placeSelect === "bottom") {
                parent.document.body.classList!.add('th-bottom');
            }
        if (oldSet.booleanWideModeLimit !== true && newSet.booleanWideModeLimit === true) {
            parent.document.body.classList!.add('th-WideModeLimit');
        } else if (oldSet.booleanWideModeLimit !== false && newSet.booleanWideModeLimit === false) {
            parent.document.body.classList!.remove('th-WideModeLimit');
        }
    });
};

logseq.ready(main).catch(console.error);
