import "@logseq/libs";
import { SettingSchemaDesc, LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import CSSmain from './main.css?inline';

const main = () => {

    logseq.useSettingsSchema(settingsTemplate);

    //CSS minify https://csscompressor.com/
    logseq.provideStyle({ key: "th-main", style: CSSmain });


    logseq.App.onRouteChanged(({ template }) => {
        if (logseq.settings!.booleanModifyHierarchy === true && template === '/page/:name') {
            //page only
            (async () => {
                const current = await logseq.Editor.getCurrentPage() as PageEntity;
                //ページ名が2023/06/24の形式にマッチする場合
                if (current.name
                    && (
                        current.name.match(/^\d{4}/)
                        || current.name.match(/^(\d{4}\/\d{2})/)
                        || current.name.match(/^(\d{4}\/\d{2}\/\d{2})/)
                    )
                )
                    (parent.document.querySelector("div.page-hierarchy") as HTMLDivElement)!.classList.add('th-journal');
            })();
        }
    });

    //Bottom
    if (logseq.settings?.placeSelect === "bottom") parent.document.body.classList.add('th-bottom');
    //WideModeLimit
    if (logseq.settings?.booleanWideModeLimit === true) parent.document.body.classList.add('th-WideModeLimit');
    //DisplayIfSmaller
    if (logseq.settings?.booleanDisplayIfSmaller === false) parent.document.body.classList.add('th-DisplayIfSmaller');
    //ModifyHierarchy
    if (logseq.settings?.booleanModifyHierarchy === false) parent.document.body.classList.add('th-DisModifyHierarchy');

    logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
        if (oldSet.placeSelect !== "side" && newSet.placeSelect === "side") {
            parent.document.body.classList!.remove('th-bottom');
        } else
            if (oldSet.placeSelect !== "bottom" && newSet.placeSelect === "bottom") {
                parent.document.body.classList!.add('th-bottom');
            }
        if (oldSet.booleanWideModeLimit !== true && newSet.booleanWideModeLimit === true) {
            parent.document.body.classList!.add('th-WideModeLimit');
        } else
            if (oldSet.booleanWideModeLimit !== false && newSet.booleanWideModeLimit === false) {
                parent.document.body.classList!.remove('th-WideModeLimit');
            }
        if (oldSet.booleanDisplayIfSmaller !== true && newSet.booleanDisplayIfSmaller === true) {
            parent.document.body.classList!.remove('th-DisplayIfSmaller');
        } else
            if (oldSet.booleanDisplayIfSmaller !== false && newSet.booleanDisplayIfSmaller === false) {
                parent.document.body.classList!.add('th-DisplayIfSmaller');
            }
        if (oldSet.booleanModifyHierarchy !== true && newSet.booleanModifyHierarchy === true) {
            parent.document.body.classList!.remove('th-DisModifyHierarchy');
        }
        else
            if (oldSet.booleanModifyHierarchy !== false && newSet.booleanModifyHierarchy === false) {
                parent.document.body.classList!.add('th-DisModifyHierarchy');
            }
    });
};

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
    {//ウィンドウサイズが1560px未満だった場合は表示しない
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

logseq.ready(main).catch(console.error);
