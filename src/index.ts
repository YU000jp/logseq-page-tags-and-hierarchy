import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

const main = async () => {

    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
    const settingsTemplate: SettingSchemaDesc[] = [
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
            enumChoices: ["Enable", "Normal"],
            enumPicker: "radio",
            default: "Enable",
            description: "",
        }
    ];
    logseq.useSettingsSchema(settingsTemplate);

    //CSS minify
    logseq.provideStyle(`@media screen and (min-width:1850px){body.th-pageLinkedReferences[data-page="page"] div#main-content-container div.relative div.lazy-visibility div.references{margin-top:4em;margin-bottom:4em}body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative div.lazy-visibility div.references div.references-blocks div.content>div,body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div+div div.references div.references-blocks div.content>div,body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div+div+div div.references div.references-blocks div.content>div{gap:1.2em}body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative div.lazy-visibility div.references div.references-blocks div.content>div>div.lazy-visibility,body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div+div div.references div.references-blocks div.content>div>div.lazy-visibility,body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div+div+div div.references div.references-blocks div.content>div>div.lazy-visibility{overflow:auto;border-radius:1em;max-height:450px;font-size:smaller;display:block}body.th-pageLinkedReferences[data-page="page"] div#main-content-container div.relative h2.font-bold{display:block;margin-left:auto;margin-right:auto}}//Bottom body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative{margin-bottom:2em;margin-top:2em;margin-left:1.5em}body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{position:fixed;max-height:210px;width:42vw;overflow-y:auto;padding:1.5em;font-size:.95em;background-color:var(--ls-primary-background-color);border-radius:10px;z-index:var(--ls-z-index-level-3)}body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{bottom:0;right:.3em}body.th-bottom[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body.th-bottom[data-page="page"] main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{right:42vw;bottom:0}@media screen and (max-width:1624px){body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative{margin-bottom:2em;margin-top:2em;margin-left:1.5em}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{position:fixed;max-height:210px;width:42vw;overflow-y:auto;padding:1.5em;font-size:.95em;background-color:var(--ls-primary-background-color);border-radius:10px;z-index:var(--ls-z-index-level-3)}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{bottom:0;right:.3em}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body:not(.th-bottom)[data-page="page"] main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{right:42vw;bottom:0}}@media screen and (min-width:1625px){body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative{margin-bottom:2em;margin-top:2em;margin-left:1.5em}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{position:fixed;width:390px;max-height:40vh;overflow-y:auto;padding:1.5em;font-size:.95em;background-color:var(--ls-primary-background-color);border-radius:10px}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{top:6.5em;right:1em}body:not(.th-bottom)[data-page="page"]:not(.is-tabs-loaded.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{top:4.5em}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body:not(.th-bottom)[data-page="page"]:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{right:1em;bottom:3em}}@media screen and (min-width:1625px) and (max-width:2259px){body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container{padding-right:424px}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{width:420px}}@media screen and (min-width:2260px){body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container{padding-right:684px}body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{width:680px}}body[data-page="home"] div#today-queries>div.lazy-visibility{min-height:unset!important}body[data-page="home"] div#today-queries>div.lazy-visibility>div.shadow{display:none}body[data-page="home"] div#today-queries div.color-level div.blocks-container,body[data-page="home"] div#today-queries div.color-level{background-color:unset}body.is-pdf-active div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,main.ls-right-sidebar-open div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body.is-pdf-active div#main-content-container div.page-hierarchy,main.ls-right-sidebar-open div#main-content-container div.page-hierarchy,div#right-sidebar div.relative+div.references.mt-6.flex-1.flex-row,div#right-sidebar div.page-hierarchy{display:none}main.ls-wide-mode div#main-content-container div.cp__sidebar-main-content{max-width:1450px}\n`);

    const logseqSettings = logseq.settings;
    if (!logseqSettings) {
        return;
    }
    const SettingMain = logseqSettings.switchMain || "";
    const SettingWideModeLimit = logseqSettings.switchWideModeLimit || "";
    const SettingPageLinkedReferences = logseqSettings.switchPageLinkedReferences || "";

    //WideModeLimit
    if (SettingWideModeLimit === "Enable") {
        parent.document.body.classList.add('th-WideModeLimit');
    }
    //pageLinkedReferences
    if (SettingPageLinkedReferences === "Enable") {
        parent.document.body.classList.add('th-pageLinkedReferences');
    }
    //Bottom
    if (SettingMain === "Bottom") {
        parent.document.body.classList.add('th-bottom');
    } else {
        //Bottom < 1624 & 1625 > Side
        //not(th-bottom)
    }

    parent.document.body.classList.add('is-plugin-page-tags-and-hierarchy-enabled');
    logseq.beforeunload(async () => {
        parent.document.body.classList.remove('is-plugin-page-tags-and-hierarchy-enabled');
    });
    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });

};

// Setting changed
const onSettingsChangedCallback = (newSettings: any, oldSettings: any) => {
    if (oldSettings.switchMain !== "Side" && newSettings.switchMain === "Side") {
        parent.document.body.classList.remove('th-bottom');
    } else if (oldSettings.switchMain !== "Bottom" && newSettings.switchMain === "Bottom") {
        parent.document.body.classList.add('th-bottom');
    }
    if (oldSettings.switchWideModeLimit !== "Enable" && newSettings.switchWideModeLimit === "Enable") {
        parent.document.body.classList.add('th-switchWideModeLimit');
    } else if (oldSettings.switchWideModeLimit !== "Normal" && newSettings.switchWideModeLimit === "Normal") {
        parent.document.body.classList.remove('th-switchWideModeLimit');
    }
    if (oldSettings.switchPageLinkedReferences !== "Enable" && newSettings.switchPageLinkedReferences === "Enable") {
        parent.document.body.classList.add('th-pageLinkedReferences');
    } else if (oldSettings.switchPageLinkedReferences !== "Normal" && newSettings.switchPageLinkedReferences === "Normal") {
        parent.document.body.classList.remove('th-pageLinkedReferences');
    }
}

logseq.ready().then(main).catch(console.error);
