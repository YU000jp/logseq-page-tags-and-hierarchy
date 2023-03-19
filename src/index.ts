import "@logseq/libs";
import { getDateForPage } from 'logseq-dateutils';
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import Swal from 'sweetalert2';//https://sweetalert2.github.io/

async function addProperties(addProperty: string | undefined, addType: string) {
    const logseqSettings = logseq.settings || "";
    if (!logseqSettings) {
        return;
    }
    const SettingPARArecodeDate: string = logseqSettings.switchPARArecodeDate || "";
    const SettingRecodeDate: string = logseqSettings.switchRecodeDate || "";

    //リスト選択モード
    if (addType === "Select") {
        let SettingSelectionList = logseqSettings.SelectionList || "";
        if (SettingSelectionList === "") {
            return logseq.UI.showMsg(`Please set the selection list first`, "warning");//cancel
        }
        SettingSelectionList = SettingSelectionList.split(",");
        const SelectionListObj = {};
        for (let i = 0; i < SettingSelectionList.length; i++) {
            if (SettingSelectionList[i]) {
                SelectionListObj[`${SettingSelectionList[i]}`] = SettingSelectionList[i];
            }
        }
        //dialog
        logseq.showMainUI();
        await Swal.fire({
            text: 'Page-tags selection list',
            input: 'select',
            inputOptions: SelectionListObj,
            inputPlaceholder: 'Select a page-tag (Add to page-tags)',
            showCancelButton: true,
        }).then((answer) => {
            if (answer) {
                const { value: select } = answer;
                if (select) {
                    addProperty = select;//ページタグ確定
                }
            }
        }).finally(() => {
            logseq.hideMainUI();
        });
    }
    if (addProperty === "") {
        return logseq.UI.showMsg(`Cancel`, "warning");//cancel
    }
    const getCurrent = await logseq.Editor.getCurrentPage();
    if (getCurrent && addProperty) {
        if (getCurrent.name === addProperty || getCurrent.originalName === addProperty) {
            return logseq.UI.showMsg(`Need not add current page to page-tags.`, "warning");//cancel same page
        }
        console.error(getCurrent.name === addProperty);
        const editBlockUUID: string | undefined = await updateProperties(addProperty, "tags", getCurrent.properties, addType);
        if (editBlockUUID) {
            if ((addType === "Select" && SettingRecodeDate === "Enable") || (addType === "PARA" && SettingPARArecodeDate === "Enable")) {//指定されたPARAページに日付とリンクをつける
                const userConfigs = await logseq.App.getUserConfigs();
                await setTimeout(function () { RecodeDateToPage(editBlockUUID, getCurrent.name) }, 300);

                async function RecodeDateToPage(editBlockUUID, getCurrentName) {
                    if (addProperty) {
                        const blocks = await logseq.Editor.getPageBlocksTree(addProperty);
                        if (blocks) {
                            //PARAページの先頭行の下に追記
                            const content = getDateForPage(new Date(), userConfigs.preferredDateFormat) + " [[" + getCurrentName + "]]";
                            await logseq.Editor.insertBlock(blocks[0].uuid, content, { sibling: false });
                        }
                    }
                }
            }
            logseq.UI.showMsg(`add ${addProperty} to tags`, "info");
        }
    }
}


async function updateProperties(addProperty: string, targetProperty: string, PageProperties, addType: string) {
    const getCurrentTree = await logseq.Editor.getCurrentPageBlocksTree();
    const firstBlockUUID: string = getCurrentTree[0].uuid;

    let editBlockUUID;
    let deleteArray = ['Project', 'Resource', 'Area of responsibility', 'Archive'];
    if (typeof PageProperties === "object" && PageProperties !== null) {//ページプロパティが存在した場合
        if (addType === "PARA") {
            deleteArray = deleteArray.filter(element => element !== addProperty);//PARA: 一致するもの以外のリスト
        }
        let PropertiesArray = PageProperties[targetProperty] || [];
        if (PropertiesArray) {
            if (addType === "PARA") {
                PropertiesArray = PropertiesArray.filter(property => !deleteArray.includes(property));//PARA: タグの重複削除
            }
            PropertiesArray = [...PropertiesArray, addProperty];
        } else {
            PropertiesArray = [addProperty];
        }
        PropertiesArray = [...new Set(PropertiesArray)];//タグの重複削除
        await logseq.Editor.upsertBlockProperty(firstBlockUUID, targetProperty, PropertiesArray);
        editBlockUUID = firstBlockUUID;
    } else {//ページプロパティが存在しない
        const prependProperties = {};
        prependProperties[targetProperty] = addProperty;
        await logseq.Editor.insertBlock(firstBlockUUID, "", { properties: prependProperties, sibling: true, before: true, isPageBlock: true, focus: true }).then((prepend) => {
            if (prepend) {
                logseq.Editor.moveBlock(prepend.uuid, firstBlockUUID, { before: true, children: true });
                editBlockUUID = prepend.uuid;
            }
        });

    }
    await logseq.Editor.editBlock(editBlockUUID);
    await setTimeout(function () {
        logseq.Editor.insertAtEditingCursor(",");//ページプロパティを配列として読み込ませる処理
    }, 200);
    return editBlockUUID;
}



const main = async () => {

    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */
    const settingsTemplate: SettingSchemaDesc[] = [
        {
            key: "switchMain",
            title: "side by side",
            type: "enum",
            enumChoices: ["Side", "Bottom"],
            enumPicker: "radio",
            default: "Side",
            description: "Side: Window size limit [min-width 1625px]  | Bottom: Place it on the bottom side.",
        },
        {
            key: "switchWideModeLimit",
            title: "set wide mode max-width: 1450px",
            type: "enum",
            enumChoices: ["Enable", "Normal"],
            enumPicker: "radio",
            default: "Enable",
            description: "enable: wide mode(shortcut `(Esc) + t → c`) limit width",
        },
        {
            key: "switchPageLinkedReferences",
            title: "Page Linked References height limit",
            type: "enum",
            enumChoices: ["Enable", "Normal"],
            enumPicker: "radio",
            default: "Enable",
            description: "",
        },
        {
            key: "",
            title: "Test Function",
            type: "heading",
            default: "",
            description: "",
        },
        {
            key: "switchPARAfunction",
            title: "[page title context menu] Shortcuts for PARA method pages. Add to page-tags",
            type: "enum",
            enumChoices: ["Enable", "Disable"],
            enumPicker: "radio",
            default: "Enable",
            description: "Possible to add it, but delete it manually. \n(It is slow to be removed from the list of page tags by Logseq specification.)",
        },
        {
            key: "switchPARArecodeDate",
            title: "Record today's date on the PARA page when adding",
            type: "enum",
            enumChoices: ["Enable", "Disable"],
            enumPicker: "radio",
            default: "Disable",
            description: "Possible to add it, but delete it manually.",
        },
        {
            key: "SelectionList",
            type: "string",
            default: `Index,`,
            title: "For selecting on page-tags selection list",
            description: `Entry page titles separated by commas(,).`,
        },
        {
            key: "switchRecodeDate",
            title: "Record today's date on the selection page when adding",
            type: "enum",
            enumChoices: ["Enable", "Disable"],
            enumPicker: "radio",
            default: "Disable",
            description: "Possible to add it, but delete it manually.",
        },
    ];
    logseq.useSettingsSchema(settingsTemplate);
    const logseqSettings = logseq.settings || "";
    if (!logseqSettings) {
        return;
    }
    const SettingMain = logseqSettings.switchMain || "";
    const SettingWideModeLimit = logseqSettings.switchWideModeLimit || "";
    const SettingPageLinkedReferences = logseqSettings.switchPageLinkedReferences || "";
    const SettingPARA = logseqSettings.switchPARAfunction || "";
    if (SettingPARA === "Enable") {
        logseq.App.registerPageMenuItem("🎨 add Project", async (e) => {
            addProperties("Project", "PARA");
        });
        logseq.App.registerPageMenuItem("🏠 add Area of responsibility", async (e) => {
            addProperties("Area of responsibility", "PARA");
        });
        logseq.App.registerPageMenuItem("🌍 add Resource", async (e) => {
            addProperties("Resource", "PARA");
        });
        logseq.App.registerPageMenuItem("🧹 add Archive", async (e) => {
            addProperties("Archive", "PARA");
        });
    }
    logseq.App.registerPageMenuItem("🧺 add a page-tag by select list", async (e) => {
        addProperties("", "Select");
    });

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
    body.th-pageLinkedReferences[data-page="page"]:not(.is-tabs-loaded.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,body.th-pageLinkedReferences[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,body:not(.th-bottom)[data-page="page"]:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy{font-size:.91em;background-color:var(--ls-primary-background-color);outline-offset:2px;outline:2px solid var(--ls-table-tr-even-background-color);border-radius:10px;overflow:auto;position:fixed}
    `);

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

logseq.ready(main).then().catch(console.error);
