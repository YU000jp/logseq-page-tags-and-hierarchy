import "@logseq/libs";
import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json";
import { settingsTemplate, } from "./settings";
import { splitHierarchy, } from "./splitHierarchy";
import { BlockEntity, LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { provideStyleByVersion, removeElementClass, removeElementId, removeProvideStyle, titleCollapsedRegisterEvent, versionCheck } from "./lib";
import filePageAccessory from "./pageAccessory.css?inline";
import fileNestingPageAccessory from "./nestingPageAccessory.css?inline";
import fileSide from './side.css?inline';
import fileBottom from './bottom.css?inline';
import fileWide from './wide.css?inline';
import fileWideModeJournalQueries from './wideJournalQueries.css?inline';
import fileCSSMain from './main.css?inline';
import { displayToc } from "./toc";
export let checkOnBlockChanged: boolean = false;//一度のみ
let processBlockChanged: boolean = false;//処理中
let currentPageName: string = "";
import { CSSpageSubOrder } from "./toc";
import { onSettingsChangedRemoveHierarchyPageTitleOnce, onSettingsChangedRevertHierarchyPageTitleOnce } from "./splitHierarchy";
import { hierarchyForFirstLevelOnly, hierarchyRemoveBeginningLevel } from "./hierarchyList";
const keyPageAccessory = "th-PageAccessory";
const keyNestingPageAccessory = "th-nestingPageAccessory";
const keySide = "th-side";
const keyBottom = "th-bottom";
const keyWide = "th-wide";
const keyPageAccessoryOrder = "th-pageAccessoryOrder";
const keyWideModeJournalQueries = "th-wideModeJournalQueries";
export const keyHierarchyForFirstLevelOnly = "th-hierarchyForFirstLevelOnly";
export const keyHierarchyRemoveBeginningLevel = "th-hierarchyRemoveBeginningLevel";

let versionOver: boolean = false;

const main = async () => {
    versionOver = await versionCheck(0, 9, 11);
    await l10nSetup({ builtinTranslations: { ja } });
    /* user settings */
    logseq.useSettingsSchema(settingsTemplate());

    //unset以外
    //DisplayIfSmaller
    if (logseq.settings!.placeSelect !== "unset" && logseq.settings?.booleanDisplayIfSmaller === false) parent.document.body.classList.add('th-DisplayIfSmaller');

    //ModifyHierarchyList
    if (logseq.settings?.booleanModifyHierarchy === true) provideStyleByVersion(versionOver, keyNestingPageAccessory, fileNestingPageAccessory, keyPageAccessory, filePageAccessory);

    //CSS minify https://csscompressor.com/
    switch (logseq.settings!.placeSelect) {
        case "unset":
            break;
        case "bottom":
            logseq.provideStyle({ key: keyBottom, style: fileBottom });
            break;
        case "side":
            logseq.provideStyle({ key: keySide, style: fileSide });
            break;
        case "Side"://Sideミス対策
            logseq.provideStyle({ key: keySide, style: fileSide });
            logseq.updateSettings({ placeSelect: "side" }); //default値を間違えていたため修正(変更していないユーザー用)
            break;
        case "wide view":
            logseq.provideStyle({ key: keyWide, style: fileWide });
            logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(logseq.settings) });
            if (logseq.settings!.booleanWideModeJournalQueries === true) logseq.provideStyle({ key: keyWideModeJournalQueries, style: fileWideModeJournalQueries });
            break;
    }

    // ページタイトルの階層を分割する を含む
    logseq.provideStyle(fileCSSMain); //メインCSS

    //ページ読み込み時に実行コールバック
    logseq.App.onRouteChanged(async ({ template }) => {
        if (template === '/page/:name') onPageChanged(); //バグあり？onPageHeadActionsSlottedとともに動作保証が必要
    });

    //ページ読み込み時に実行コールバック
    logseq.App.onPageHeadActionsSlotted(async () => onPageChanged()); //バグあり？onRouteChangedとともに動作保証が必要

    //ブロック更新のコールバック
    if (logseq.settings!.placeSelect === "wide view"
        && logseq.settings!.booleanTableOfContents === true) onBlockChanged();

    //設定変更のコールバック
    onSettingsChanged();

    logseq.beforeunload(async () => {
        const element = parent.document.getElementById("hierarchyLinks") as HTMLSpanElement | null;
        if (element) element.remove();
    });

};//end main


logseq.ready(main).catch(console.error);



const onPageChanged = async () => {
    const current = await logseq.Editor.getCurrentPage() as PageEntity | null;
    if (current) {
        currentPageName = current.originalName; //index.tsの値を書き換える
        //Hierarchy Links
        if (parent.document.getElementById("hierarchyLinks") as HTMLSpanElement | null === null
            && logseq.settings!.booleanSplitHierarchy === true
            && currentPageName
            && currentPageName.includes("/")
            && !(currentPageName.includes(","))) splitHierarchy(currentPageName, true, 0,);
        //Hierarchyのelementをコピーしたが、リンクやクリックイベントはコピーされない
        if (logseq.settings!.placeSelect === "wide view"
            && logseq.settings!.booleanTableOfContents === true) displayToc(currentPageName);
        //ページタグの折りたたみを有効にする
        const pageTagsElement = parent.document.querySelector("div#main-content-container div.page.relative div.page-tags") as HTMLElement | null;
        if (pageTagsElement) {
            const titleElement = pageTagsElement.querySelector("div.content div.foldable-title h2") as HTMLElement | null;
            if (titleElement) titleCollapsedRegisterEvent(titleElement, pageTagsElement.querySelector("div.initial") as HTMLElement);
        }
        if (logseq.settings!.booleanHierarchyForFirstLevelOnly === true || logseq.settings!.booleanRemoveBeginningLevel === true && (currentPageName.match(/\//g) || []).length !== 0) {
            // Hierarchyのサブレベル1のみを表示する
            if (logseq.settings!.booleanHierarchyForFirstLevelOnly === true) hierarchyForFirstLevelOnly(currentPageName.split("/"));
            // Hierarchyの最初から始まるレベルを削除する
            hierarchyRemoveBeginningLevel(currentPageName.split("/"));
        }
    }
    //ページ名が2023/06/24の形式にマッチする場合
    if (logseq.settings!.booleanModifyHierarchy === true
        && currentPageName
        && (currentPageName.match(/^\d{4}/)
            || currentPageName.match(/^(\d{4}\/\d{2})/)
            //|| currentPageName.match(/^(\d{4}\/\d{2}\/\d{2})/) //Journalの場合はもともと表示されない
        )) {
        parent.document!.querySelector("div#main-content-container div.page-hierarchy")?.classList.add('th-journal');
    }

};

export const onBlockChanged = () => {
    if (checkOnBlockChanged === true) return;
    checkOnBlockChanged = true; //index.tsの値を書き換える
    logseq.DB.onChanged(async ({ blocks }) => {
        if (processBlockChanged === true || currentPageName === "" || logseq.settings!.booleanTableOfContents === false) return;
        //headingがあるブロックが更新されたら
        const findBlock = blocks.find((block) => block.properties?.heading) as BlockEntity | null; //uuidを得るためsomeではなくfindをつかう
        if (!findBlock) return;
        const uuid = findBlock ? findBlock!.uuid : null;
        updateToc();//toc更新を抑制

        //ブロック更新のコールバック
        if (uuid) logseq.DB.onBlockChanged(uuid, async () => updateToc());
    });
}

const updateToc = () => {
    if (processBlockChanged === true) return;
    processBlockChanged = true; //index.tsの値を書き換える
    setTimeout(async () => {
        await displayToc(currentPageName); //toc更新
        processBlockChanged = false;
    }, 300);
}


const onSettingsChanged = () => {
    logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

        // 表示場所の変更
        if (oldSet.placeSelect !== newSet.placeSelect) { //tocはwide viewのみ
            if (oldSet.placeSelect === "wide view" && newSet.placeSelect !== "wide view") removeElementClass("th-toc");
            else if (oldSet.placeSelect !== "wide view" && newSet.placeSelect === "wide view") {
                const current = await logseq.Editor.getCurrentPage() as PageEntity | null;
                if (current && current.name) displayToc(current.name);
                onBlockChanged();
            }

            if (newSet.booleanModifyHierarchy === true
                && !parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`))
                provideStyleByVersion(versionOver, keyNestingPageAccessory, fileNestingPageAccessory, keyPageAccessory, filePageAccessory);
            else if (newSet.booleanModifyHierarchy === false) {
                removeProvideStyle(keyPageAccessory);
                removeProvideStyle(keyNestingPageAccessory);
            }

            switch (newSet.placeSelect) {
                case "bottom":
                    removeProvideStyle(keySide);
                    removeProvideStyle(keyWide);
                    removeProvideStyle(keyPageAccessoryOrder);
                    removeProvideStyle(keyWideModeJournalQueries);
                    logseq.provideStyle({ key: keyBottom, style: fileBottom });
                    break;
                case "side":
                    removeProvideStyle(keyBottom);
                    removeProvideStyle(keyWide);
                    removeProvideStyle(keyPageAccessoryOrder);
                    logseq.provideStyle({ key: keySide, style: fileSide });
                    break;
                case "wide view":
                    if (versionOver === true) {
                        removeProvideStyle(keySide);
                        removeProvideStyle(keyBottom);
                        logseq.provideStyle({ key: keyWide, style: fileWide });
                        logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(logseq.settings) });
                        if (newSet.booleanWideModeJournalQueries === true) logseq.provideStyle({ key: keyWideModeJournalQueries, style: fileWideModeJournalQueries });
                    } else {
                        logseq.UI.showMsg("Wide view mode is available from Logseq v0.9.11");
                        setTimeout(() => { logseq.updateSettings({ placeSelect: oldSet.placeSelect }); }, 300);
                    }
                    break;
                case "unset":
                    removeProvideStyle(keySide);
                    removeProvideStyle(keyBottom);
                    removeProvideStyle(keyWide);
                    removeProvideStyle(keyPageAccessoryOrder);
                    removeProvideStyle(keyWideModeJournalQueries);
                    removeProvideStyle(keyPageAccessory);
                    removeProvideStyle(keyNestingPageAccessory);
                    break;
            }


            //表示場所の変更以外
        } else {


            // 階層のサブレベル1のみを表示する
            if (oldSet.booleanHierarchyForFirstLevelOnly === true && newSet.booleanHierarchyForFirstLevelOnly === false) removeProvideStyle(keyHierarchyForFirstLevelOnly);
            else if (oldSet.booleanHierarchyForFirstLevelOnly === false && newSet.booleanHierarchyForFirstLevelOnly === true && currentPageName && (currentPageName.match(/\//g) || []).length !== 0) hierarchyForFirstLevelOnly(currentPageName.split("/"));

            if (oldSet.booleanDisplayIfSmaller === false
                && newSet.booleanDisplayIfSmaller === true) parent.document.body.classList!.remove('th-DisplayIfSmaller');

            else if (oldSet.booleanDisplayIfSmaller !== false
                && newSet.booleanDisplayIfSmaller === false) parent.document.body.classList!.add('th-DisplayIfSmaller');

            if (oldSet.booleanModifyHierarchy === false
                && newSet.booleanModifyHierarchy === true) {
                if (!parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`) && !parent.document.head.querySelector(`style[data-injected-style^="${keyNestingPageAccessory}"]`)) provideStyleByVersion(versionOver, keyNestingPageAccessory, fileNestingPageAccessory, keyPageAccessory, filePageAccessory);
            }
            else if (oldSet.booleanModifyHierarchy === true
                && newSet.booleanModifyHierarchy === false) {
                removeProvideStyle(keyPageAccessory);
                removeProvideStyle(keyNestingPageAccessory);
            }
            if (oldSet.booleanTableOfContents === false && newSet.booleanTableOfContents === true) {
                const current = await logseq.Editor.getCurrentPage() as PageEntity | null;
                if (current && current.name) displayToc(current.name);
                onBlockChanged();
            }
            else if (oldSet.booleanTableOfContents === true && newSet.booleanTableOfContents === false) removeElementClass("th-toc");

            //positionのCSSを変更
            if (newSet.placeSelect === "wide view") {
                if (oldSet.enumScheduleDeadline !== newSet.enumScheduleDeadline
                    || oldSet.enumTableOfContents !== newSet.enumTableOfContents
                    || oldSet.enumLinkedReferences !== newSet.enumLinkedReferences
                    || oldSet.enumUnlinkedReferences !== newSet.enumUnlinkedReferences
                    || oldSet.enumPageHierarchy !== newSet.enumPageHierarchy
                    || oldSet.enumPageTags !== newSet.enumPageTags) {
                    removeProvideStyle(keyPageAccessoryOrder);
                    logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(newSet) });
                }
                if (oldSet.booleanWideModeJournalQueries === false && newSet.booleanWideModeJournalQueries === true)
                    logseq.provideStyle({ key: keyWideModeJournalQueries, style: fileWideModeJournalQueries });
                else if (oldSet.booleanWideModeJournalQueries === true && newSet.booleanWideModeJournalQueries === false)
                    removeProvideStyle(keyWideModeJournalQueries);
            }
            if (oldSet.booleanSplitHierarchy !== newSet.booleanSplitHierarchy) {
                if (newSet.booleanSplitHierarchy === true) {
                    splitHierarchy(currentPageName, true, 0);
                    if (newSet.booleanRemoveHierarchyPageTitle === true)
                        onSettingsChangedRemoveHierarchyPageTitleOnce(); //ページタイトルの階層を削除
                } else if (newSet.booleanSplitHierarchy === false) {
                    removeElementId("hierarchyLinks");
                    onSettingsChangedRevertHierarchyPageTitleOnce(); //元に戻す
                }
            }
            if (oldSet.booleanSplitHierarchy === true) { //Hierarchy Linksが有効な場合のみ
                if (oldSet.booleanRemoveHierarchyPageTitle === false && newSet.booleanRemoveHierarchyPageTitle === true)
                    onSettingsChangedRemoveHierarchyPageTitleOnce(); //ページタイトルの階層を削除
                else if (oldSet.booleanRemoveHierarchyPageTitle === true && newSet.booleanRemoveHierarchyPageTitle === false)
                    onSettingsChangedRevertHierarchyPageTitleOnce();
            }
        }
    });
};


