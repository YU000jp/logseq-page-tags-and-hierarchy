import "@logseq/libs";
import { SettingSchemaDesc, LSPluginBaseInfo } from "@logseq/libs/dist/LSPlugin.user";
import CSSmain from './main.css?inline';

const main = () => {

    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
    const settingsTemplate: SettingSchemaDesc[] = [
        {
            key: "booleanMain",
            title: "Place page-tags and hierarchy on side by side (or bottom)",
            type: "boolean",
            default: true,
            description: "true: *Window size limit [min-width 1625px]  / false: Bottom mode",
        },
        {
            key: "booleanWideModeLimit",
            title: "set wide mode max-width: 1450px",
            type: "boolean",
            default: true,
            description: "*wide mode(shortcut `(Esc) + t → c`)",
        },
        {
            key: "booleanPageLinkedReferences",
            title: "Page Linked References height limit",
            type: "boolean",
            default: true,
            description: "",
        },
    ];
    logseq.useSettingsSchema(settingsTemplate);

    //CSS minify https://csscompressor.com/
    logseq.provideStyle({ key: "main", style: CSSmain });

    //Bottom
    if (logseq.settings?.booleanMain === false) {
        parent.document.body.classList.add('th-bottom');
    } else {
        //Bottom < 1624 & 1625 > Side
        //not(th-bottom)
    }
    //WideModeLimit
    if (logseq.settings?.booleanWideModeLimit === true) {
        parent.document.body.classList.add('th-WideModeLimit');
    }
    //pageLinkedReferences
    if (logseq.settings?.booleanPageLinkedReferences === true) {
        parent.document.body.classList.add('th-pageLinkedReferences');
    }

    logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

        if (oldSet.booleanMain !== true && newSet.booleanMain === true) {
            parent.document.body.classList.remove('th-bottom');
        } else if (oldSet.booleanMain !== false && newSet.booleanMain === false) {
            parent.document.body.classList.add('th-bottom');
        }
        if (oldSet.booleanWideModeLimit !== true && newSet.booleanWideModeLimit === true) {
            parent.document.body.classList.add('th-WideModeLimit');
        } else if (oldSet.booleanWideModeLimit !== false && newSet.booleanWideModeLimit === false) {
            parent.document.body.classList.remove('th-WideModeLimit');
        }
        if (oldSet.booleanPageLinkedReferences !== true && newSet.booleanPageLinkedReferences === true) {
            parent.document.body.classList.add('th-pageLinkedReferences');
        } else if (oldSet.booleanPageLinkedReferences !== false && newSet.booleanPageLinkedReferences === false) {
            parent.document.body.classList.remove('th-pageLinkedReferences');
        }
    });

};

logseq.ready(main).catch(console.error);
