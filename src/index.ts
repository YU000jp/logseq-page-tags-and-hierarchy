import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";


const main = async () => {

    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
    const settingsTemplate: SettingSchemaDesc[] = [
        {
            key: "booleanMain",
            title: "side by side",
            type: "boolean",
            default: true,
            description: "true: Window size limit [min-width 1625px]  | false: Place it on the bottom side.",
        },
        {
            key: "booleanWideModeLimit",
            title: "set wide mode max-width: 1450px",
            type: "boolean",
            default: true,
            description: "true: wide mode(shortcut `(Esc) + t → c`) limit width",
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
    logseq.provideStyle(String.raw`
@media screen and (min-width:1850px) {
    body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative div.lazy-visibility div.references div.references-blocks div.content>div>div.lazy-visibility,body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.references div.references-blocks div.content>div>div.lazy-visibility{overflow:auto;max-height:450px;display:block}
}
    body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative{margin-bottom:2em;margin-top:2em;margin-left:1.5em}
    body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{max-height:210px;width:34vw;padding:1.15em;z-index:var(--ls-z-index-level-3)}
    body.th-bottom[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{bottom:0;right:.3em}
    body.th-bottom[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body.th-bottom[data-page="page"] main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{right:36vw;bottom:0}
@media screen and (max-width:1624px) {
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative{margin-bottom:2em;margin-top:2em;margin-left:1.5em}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{max-height:210px;width:34vw;padding:1.15em;z-index:var(--ls-z-index-level-3)}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{bottom:0;right:.3em}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body:not(.th-bottom)[data-page="page"] main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{right:36vw;bottom:0}
}
@media screen and (min-width:1625px) {
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative{margin-bottom:2em;margin-top:2em;margin-left:1.5em}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{width:390px;max-height:40vh;padding:1.25em}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{top:6.5em;right:1em}
    body:not(.th-bottom)[data-page="page"]:not(.is-tabs-loaded.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row{top:4.5em}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body:not(.th-bottom)[data-page="page"]:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{right:1em;bottom:3em}
}
@media screen and (min-width:1625px) and (max-width:2259px) {
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container{padding-right:424px}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{width:420px}
}
@media screen and (min-width:2260px) {
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container{padding-right:684px}
    body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body:not(.th-bottom)[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{width:680px}
}
    body[data-page="home"] div#today-queries>div.lazy-visibility{min-height:unset!important}
    body[data-page="home"] div#today-queries>div.lazy-visibility>div.shadow{display:none}
    body[data-page="home"] div#today-queries div.color-level div.blocks-container,body[data-page="home"] div#today-queries div.color-level{background-color:unset}
    body.is-pdf-active div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,main.ls-right-sidebar-open div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body.is-pdf-active div#main-content-container div.page-hierarchy,main.ls-right-sidebar-open div#main-content-container div.page-hierarchy,div#right-sidebar div.relative+div.references.mt-6.flex-1.flex-row,div#right-sidebar div.page-hierarchy{display:none}
    main.ls-wide-mode div#main-content-container div.cp__sidebar-main-content{max-width:1450px}
    body[data-page="page"]:not(.is-tabs-loaded.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body:not(.th-bottom)[data-page="page"]:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{font-size:.91em;background-color:var(--ls-primary-background-color);outline-offset:2px;outline:2px solid var(--ls-table-tr-even-background-color);border-radius:10px;overflow:auto;position:fixed}
    `);

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

    parent.document.body.classList.add('is-plugin-page-tags-and-hierarchy-enabled');
    logseq.beforeunload(async () => {
        parent.document.body.classList.remove('is-plugin-page-tags-and-hierarchy-enabled');
    });
    logseq.onSettingsChanged((newSettings, oldSettings) => {
        onSettingsChangedCallback(newSettings, oldSettings);
    });

};

// Setting changed
const onSettingsChangedCallback = (newSet: any, oldSet: any) => {
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
}

logseq.ready(main).catch(console.error);
