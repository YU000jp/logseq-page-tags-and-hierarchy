import "@logseq/libs";
import CSSmain from './main.css?inline';
import { settingsTemplate, } from "./settings";
import { splitHierarchy, hierarchyLinksCSS, } from "./splitHierarchy";
import { LSPluginBaseInfo } from "@logseq/libs/dist/LSPlugin.user";
import { removeProvideStyle } from "./lib";

const main = () => {

    logseq.useSettingsSchema(settingsTemplate);

    //CSS minify https://csscompressor.com/
    if (logseq.settings!.placeSelect !== "unset") logseq.provideStyle({ key: "th-main", style: CSSmain });

    if (logseq.settings!.placeSelect !== "unset" && logseq.settings!.booleanSplitHierarchy === true) logseq.provideStyle(hierarchyLinksCSS);
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

    //ページ読み込み時のダブルチェック用
    logseq.App.onPageHeadActionsSlotted(() => {
        if (parent.document.getElementById("hierarchyLinks") !== null) return;
        const pageName = parent.document.querySelector("h1.page-title")?.textContent as string | undefined;
        if (logseq.settings!.booleanSplitHierarchy === true && pageName && pageName.includes("/")) splitHierarchy(pageName, true, 0,);
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
        if (oldSet.placeSelect === "unset" && newSet.placeSelect !== "unset") logseq.provideStyle({ key: "th-main", style: CSSmain });
        else
            if (oldSet.placeSelect !== "unset" && newSet.placeSelect === "unset") removeProvideStyle("th-main");
        if (oldSet.placeSelect === "bottom" && newSet.placeSelect !== "bottom") parent.document.body.classList!.remove('th-bottom');
        else
            if (oldSet.placeSelect !== "bottom" && newSet.placeSelect === "bottom") parent.document.body.classList!.add('th-bottom');

        if (oldSet.booleanWideModeLimit !== true && newSet.booleanWideModeLimit === true) parent.document.body.classList!.add('th-WideModeLimit');
        else
            if (oldSet.booleanWideModeLimit !== false && newSet.booleanWideModeLimit === false) parent.document.body.classList!.remove('th-WideModeLimit');

        if (oldSet.booleanDisplayIfSmaller !== true && newSet.booleanDisplayIfSmaller === true) parent.document.body.classList!.remove('th-DisplayIfSmaller');
        else
            if (oldSet.booleanDisplayIfSmaller !== false && newSet.booleanDisplayIfSmaller === false) parent.document.body.classList!.add('th-DisplayIfSmaller');

        if (oldSet.booleanModifyHierarchy !== true && newSet.booleanModifyHierarchy === true) parent.document.body.classList!.remove('th-DisModifyHierarchy');
        else
            if (oldSet.booleanModifyHierarchy !== false && newSet.booleanModifyHierarchy === false) parent.document.body.classList!.add('th-DisModifyHierarchy');
    });

    logseq.beforeunload(async () => {
        const element = parent.document.getElementById("hierarchyLinks") as HTMLSpanElement | null;
        if (element) element.remove();
    });

};//end main

logseq.ready(main).catch(console.error);