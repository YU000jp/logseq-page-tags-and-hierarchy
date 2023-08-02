import "@logseq/libs";

import { settingsTemplate, } from "./settings";
import { splitHierarchy, hierarchyLinksCSS, } from "./splitHierarchy";
import { LSPluginBaseInfo } from "@logseq/libs/dist/LSPlugin.user";
import { removeProvideStyle } from "./lib";
import fileHierarchy from "./hierarchyList.css?inline";
import CSSside from './side.css?inline';
import CSSbottom from './bottom.css?inline';
import CSSwide from './wide.css?inline';
const keyModifyHierarchyList = "th-modifyHierarchy";
const keySide = "th-side";
const keyBottom = "th-bottom";
const keyWide = "th-wide";

const main = () => {

    logseq.useSettingsSchema(settingsTemplate);

    //CSS minify https://csscompressor.com/
    switch (logseq.settings!.placeSelect) {
        case "unset":
            break;
        case "bottom":
            logseq.provideStyle({ key: keyBottom, style: CSSbottom });
        case "side":
            logseq.provideStyle({ key: keySide, style: CSSside });
        case "Side"://Sideミス対策
            logseq.provideStyle({ key: keySide, style: CSSside });
            logseq.updateSettings({ placeSelect: "side" }); //default値を間違えていたため修正(変更していないユーザー用)
        case "wide view":
            logseq.provideStyle({ key: keyWide, style: CSSwide });
        default:
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
        const pageName = parent.document.querySelector("h1.page-title")?.textContent as string | undefined;
        if (logseq.settings!.booleanSplitHierarchy === true && pageName && pageName.includes("/")) splitHierarchy(pageName, true, 0,);
        //Hierarchyのelementをコピーしたが、リンクやクリックイベントはコピーされない
    });


    logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
        if (oldSet.placeSelect !== newSet.placeSelect) {
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
                    removeProvideStyle(keySide);
                    removeProvideStyle(keyBottom);
                    logseq.provideStyle({ key: keyWide, style: CSSwide });
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
        }
    });

    logseq.beforeunload(async () => {
        const element = parent.document.getElementById("hierarchyLinks") as HTMLSpanElement | null;
        if (element) element.remove();
    });

};//end main

logseq.ready(main).catch(console.error);