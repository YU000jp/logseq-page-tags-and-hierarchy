import "@logseq/libs";

import { settingsTemplate, } from "./settings";
import { splitHierarchy, hierarchyLinksCSS, } from "./splitHierarchy";
import { LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { removeElementClass, removeProvideStyle } from "./lib";
import fileHierarchy from "./pageHierarchyList.css?inline";
import CSSside from './side.css?inline';
import CSSbottom from './bottom.css?inline';
import CSSwide from './wide.css?inline';
import { displayToc } from "./toc";
const keyModifyHierarchyList = "th-modifyHierarchy";
const keySide = "th-side";
const keyBottom = "th-bottom";
const keyWide = "th-wide";
let checkOnBlockChanged: boolean = false;//一度飲み
let processBlockChanged: boolean = false;//処理中

const main = () => {

    if (!logseq.settings) {
        (async () => {
            //初回バージョンチェック
            const version: string = await logseq.App.getInfo("version");
            console.log(version);
            const versionArr = version?.split(".") as string[];
            if (Number(versionArr[0]) > 0 ||
                (Number(versionArr[0]) === 0 && Number(versionArr[1]) > 9) ||
                (Number(versionArr[0]) === 0 && Number(versionArr[1]) === 9 && Number(versionArr[2]) >= 11)) {
                logseq.useSettingsSchema(settingsTemplate("wide view"));
            } else {
                logseq.useSettingsSchema(settingsTemplate("side"));
            }
        })();
    } else {
        logseq.useSettingsSchema(settingsTemplate("side"));
    }

    //CSS minify https://csscompressor.com/
    switch (logseq.settings!.placeSelect) {
        case "unset":
            break;
        case "bottom":
            logseq.provideStyle({ key: keyBottom, style: CSSbottom });
            break;
        case "side":
            logseq.provideStyle({ key: keySide, style: CSSside });
            break;
        case "Side"://Sideミス対策
            logseq.provideStyle({ key: keySide, style: CSSside });
            logseq.updateSettings({ placeSelect: "side" }); //default値を間違えていたため修正(変更していないユーザー用)
            break;
        case "wide view":
            logseq.provideStyle({ key: keyWide, style: CSSwide });
            break;
    }
    if (logseq.settings!.placeSelect !== "unset") {
        //unset以外
        //DisplayIfSmaller
        if (logseq.settings?.booleanDisplayIfSmaller === false) parent.document.body.classList.add('th-DisplayIfSmaller');
        //ModifyHierarchyList
        if (logseq.settings?.booleanModifyHierarchy === true) logseq.provideStyle({ key: keyModifyHierarchyList, style: fileHierarchy });
    }

    if (logseq.settings!.booleanSplitHierarchy === true) logseq.provideStyle(hierarchyLinksCSS);

    logseq.App.onRouteChanged(async ({ template, path }) => {
        if (template === '/page/:name') {
            let pageName = path.replace(/\/page\//, '');
            pageName = pageName.replaceAll("%2F", '/');
            //page only
            //ページ名が2023/06/24の形式にマッチする場合
            if (logseq.settings!.booleanModifyHierarchy === true
                && pageName
                && (pageName.match(/^\d{4}/)
                    || pageName.match(/^(\d{4}\/\d{2})/)
                    || pageName.match(/^(\d{4}\/\d{2}\/\d{2})/))) //Journalの場合はもともと表示されない
                parent.document!.querySelector("div#main-content-container div.page-hierarchy")?.classList.add('th-journal');
            if (logseq.settings!.booleanSplitHierarchy === true && pageName.includes("/")) splitHierarchy(pageName, true, 0,);
        }
    });

    //ページ読み込み時に実行
    logseq.App.onPageHeadActionsSlotted(() => {
        //Hierarchy linksの表示
        if (parent.document.getElementById("hierarchyLinks") !== null) return;
        const pageName = parent.document.querySelector("h1.page-title")?.textContent as string | null | undefined;
        if (!pageName) return;
        if (logseq.settings!.booleanSplitHierarchy === true && pageName.includes("/")) splitHierarchy(pageName, true, 0,);
        //Hierarchyのelementをコピーしたが、リンクやクリックイベントはコピーされない
        if (logseq.settings!.placeSelect === "wide view" && logseq.settings!.booleanTableOfContents === true) displayToc(pageName);
    });

    //toc更新用
    //ブロック更新のコールバック
    if (logseq.settings!.placeSelect === "wide view" && logseq.settings!.booleanTableOfContents === true && checkOnBlockChanged === false) onBlockChanged();

    //設定変更のコールバック
    logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

        if (oldSet.placeSelect !== newSet.placeSelect) {//tocはwide viewのみ
            if (oldSet.placeSelect === "wide view" && newSet.placeSelect !== "wide view") removeElementClass("th-toc")
            else if (oldSet.placeSelect !== "wide view" && newSet.placeSelect === "wide view") {
                const current = await logseq.Editor.getCurrentPage() as PageEntity | null;
                if (current && current.name) displayToc(current.name);
                onBlockChanged();
            }

            switch (newSet.placeSelect) {
                case "side" || "bottom":
                    if (newSet.booleanModifyHierarchy === true
                        && !parent.document.head.querySelector(`style[data-injected-style^="${keyModifyHierarchyList}"]`))
                        logseq.provideStyle({ key: keyModifyHierarchyList, style: fileHierarchy });
                    else
                        if (newSet.booleanModifyHierarchy === false)
                            removeProvideStyle(keyModifyHierarchyList);
            }
            switch (newSet.placeSelect) {
                case "bottom":
                    removeProvideStyle(keySide);
                    removeProvideStyle(keyWide);
                    logseq.provideStyle({ key: keyBottom, style: CSSbottom });
                    break;
                case "side":
                    removeProvideStyle(keyBottom);
                    removeProvideStyle(keyWide);
                    logseq.provideStyle({ key: keySide, style: CSSside });
                    break;
                case "wide view":
                    //バージョンチェック
                    const version: string = await logseq.App.getInfo("version");
                    console.log(version);
                    const versionArr = version?.split(".") as string[];
                    if (Number(versionArr[0]) > 0 ||
                        (Number(versionArr[0]) === 0 && Number(versionArr[1]) > 9) ||
                        (Number(versionArr[0]) === 0 && Number(versionArr[1]) === 9 && Number(versionArr[2]) >= 11)) {
                        removeProvideStyle(keySide);
                        removeProvideStyle(keyBottom);
                        logseq.provideStyle({ key: keyWide, style: CSSwide });
                    } else {
                        logseq.UI.showMsg("Wide view mode is available from Logseq v0.9.11");
                        setTimeout(() => { logseq.updateSettings({ placeSelect: oldSet.placeSelect }) }, 300);
                    }
                    break;
                case "unset":
                    removeProvideStyle(keySide);
                    removeProvideStyle(keyBottom);
                    removeProvideStyle(keyWide);
                    break;
            }
        } else {
            if (oldSet.booleanDisplayIfSmaller !== true
                && newSet.booleanDisplayIfSmaller === true) parent.document.body.classList!.remove('th-DisplayIfSmaller');
            else
                if (oldSet.booleanDisplayIfSmaller !== false
                    && newSet.booleanDisplayIfSmaller === false) parent.document.body.classList!.add('th-DisplayIfSmaller');

            if (oldSet.booleanModifyHierarchy !== true
                && newSet.booleanModifyHierarchy === true
                && newSet.placeSelect !== "unset"
                && !parent.document.head.querySelector(`style[data-injected-style^="${keyModifyHierarchyList}"]`))
                logseq.provideStyle({ key: keyModifyHierarchyList, style: fileHierarchy });
            else
                if (oldSet.booleanModifyHierarchy !== false
                    && newSet.booleanModifyHierarchy === false)
                    removeProvideStyle(keyModifyHierarchyList);
            if (oldSet.booleanTableOfContents === false && newSet.booleanTableOfContents === true) {
                const current = await logseq.Editor.getCurrentPage() as PageEntity | null;
                if (current && current.name) displayToc(current.name);
                onBlockChanged();
            }
            else if (oldSet.booleanTableOfContents === true && newSet.booleanTableOfContents === false) removeElementClass("th-toc");
        }
    });

    logseq.beforeunload(async () => {
        const element = parent.document.getElementById("hierarchyLinks") as HTMLSpanElement | null;
        if (element) element.remove();
    });

};//end main


function onBlockChanged() {
    if (checkOnBlockChanged === true) return;
    checkOnBlockChanged = true;
    logseq.DB.onChanged(async ({ blocks }) => {
        if (processBlockChanged === true) return;
        if (logseq.settings!.booleanTableOfContents === true) {
            //headingがあるブロックが更新されたら
            const findBlock = blocks.find((block) => block.properties?.heading);//uuidを得るためsomeではなくfindをつかう
            if (!findBlock) return;
            const pageName = parent.document.querySelector("h1.page-title")?.textContent as string | null | undefined;
            if (!pageName) return;
            processBlockChanged = true;
            await displayToc(pageName);//toc更新
            processBlockChanged = false;
            //ブロック更新のコールバック
            logseq.DB.onBlockChanged(findBlock.uuid, async (block) => {
                if (!block.properties?.heading) await displayToc(pageName);
            });
        }
    });
}


logseq.ready(main).catch(console.error);