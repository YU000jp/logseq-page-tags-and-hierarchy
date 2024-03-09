import "@logseq/libs"
import { BlockEntity, LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import fileBottom from './bottom.css?inline'
import { hierarchyForFirstLevelOnly, hierarchyRemoveBeginningLevel } from "./hierarchyList"
import { provideStyle, removeElementClass, removeElementId, removeProvideStyle, titleCollapsedRegisterEvent } from "./lib"
import fileCSSMain from './main.css?inline'
import fileNestingPageAccessory from "./pageAccessory.css?inline"
import { settingsTemplate, } from "./settings"
import fileSide from './side.css?inline'
import { removeOnSettingsChangedHierarchyPageTitleOnce, revertOnSettingsChangedHierarchyPageTitleOnce, splitHierarchy } from "./breadcrumb"
import { CSSpageSubOrder, Child, getTocBlocks, headersList, insertElement, tocContentTitleCollapsed } from "./toc"
import ja from "./translations/ja.json"
import ko from "./translations/ko.json"
import zhCN from "./translations/zh-CN.json"
import zhHant from "./translations/zh-Hant.json"
import CSSUnlinkedHidden from './unlinkedHidden.css?inline'
import fileWide from './wide.css?inline'
import fileWideModeJournalQueries from './wideJournalQueries.css?inline'
let currentPageName: string = ""
const keyPageAccessory = "th-PageAccessory"
const keyNestingPageAccessory = "th-nestingPageAccessory"
const keySide = "th-side"
const keyBottom = "th-bottom"
const keyWide = "th-wide"
const keyPageAccessoryOrder = "th-pageAccessoryOrder"
const keyWideModeJournalQueries = "th-wideModeJournalQueries"
const keyUnlinkedReferencesHidden = "th-unlinkedReferences-hidden"
export const keyHierarchyForFirstLevelOnly = "th-hierarchyForFirstLevelOnly"
export const keyHierarchyRemoveBeginningLevel = "th-hierarchyRemoveBeginningLevel"

const main = async () => {
    await l10nSetup({ builtinTranslations: { ja, ko, "zh-Hant": zhHant, "zh-CN": zhCN } })
    /* user settings */
    logseq.useSettingsSchema(settingsTemplate())

    //設定項目 > ModifyHierarchyList
    if (logseq.settings?.booleanModifyHierarchy === true) provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)

    //設定項目 > Unlinked Referencesを表示しない
    if (logseq.settings!.booleanUnlinkedReferences === true) logseq.provideStyle({
        key: keyUnlinkedReferencesHidden, style: CSSUnlinkedHidden
    })

    //CSS minify https://csscompressor.com/
    switch (logseq.settings!.placeSelect) {
        case "unset":
            break
        case "bottom":
            logseq.provideStyle({ key: keyBottom, style: fileBottom })
            break
        case "side":
            logseq.provideStyle({ key: keySide, style: fileSide })
            break
        case "Side"://Sideミス対策
            logseq.provideStyle({ key: keySide, style: fileSide })
            logseq.updateSettings({ placeSelect: "side" }) //default値を間違えていたため修正(変更していないユーザー用)
            break
        case "wide view":
            logseq.provideStyle({ key: keyWide, style: fileWide })
            logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(logseq.settings) })
            if (logseq.settings!.booleanWideModeJournalQueries === true) logseq.provideStyle({ key: keyWideModeJournalQueries, style: fileWideModeJournalQueries })
            break
    }

    // ページ名の階層を分割する を含む
    logseq.provideStyle(fileCSSMain) //メインCSS

    //ページ読み込み時に実行コールバック
    logseq.App.onRouteChanged(async ({ template }) => {
        if (template === '/page/:name') onPageChanged() //バグあり？onPageHeadActionsSlottedとともに動作保証が必要
    })

    //ページ読み込み時に実行コールバック
    logseq.App.onPageHeadActionsSlotted(async () => onPageChanged()) //バグあり？onRouteChangedとともに動作保証が必要

    //ブロック更新のコールバック
    if (logseq.settings!.placeSelect === "wide view"
        && logseq.settings!.booleanTableOfContents === true) onBlockChanged()

    //設定変更のコールバック
    onSettingsChanged()

    //ツールバーに設定画面を開くボタンを追加
    logseq.App.registerUIItem('toolbar', {
        key: 'toolbarPageTagsAndHierarchy',
        template: `<div><a class="button icon" data-on-click="toolbarPageTagsAndHierarchy" style="font-size:15px;color:#1f9ee1;opacity:unset" title="Page-tags and Hierarchy: ${t("plugin settings")}">🏷️</a></div>`,
    })
    //ツールバーボタンのクリックイベント
    logseq.provideModel({
        toolbarPageTagsAndHierarchy: () => logseq.showSettingsUI(),
    })

    //プラグインオフの場合はページ名の階層リンクを削除する
    logseq.beforeunload(async () => {
        const element = parent.document.getElementById("hierarchyLinks") as HTMLSpanElement | null
        if (element) element.remove()
    })

}//end main



let processingOnPageChanged: boolean = false //処理中
const onPageChanged = async () => {
    if (processingOnPageChanged === true) return
    processingOnPageChanged = true
    // return 禁止
    //処理中断対策
    setTimeout(() => processingOnPageChanged = false, 1000)


    const current = await logseq.Editor.getCurrentPage() as { originalName: PageEntity["originalName"], journal?: PageEntity["journal?"] } | null
    if (current) {
        currentPageName = current.originalName
        //Hierarchy Links
        if (logseq.settings!.booleanSplitHierarchy === true
            && currentPageName
            && currentPageName.includes("/") as boolean === true
            && !(current.journal === true
                && currentPageName.includes(",")) // Journalかつ,が含まれる場合は除外
        ) splitHierarchy(currentPageName)
        //Hierarchyのelementをコピーしたが、リンクやクリックイベントはコピーされない
        if (logseq.settings!.placeSelect === "wide view"
            && logseq.settings!.booleanTableOfContents === true) displayToc(currentPageName)



    }
    //ページ名が2023/06/24の形式にマッチする場合
    if (logseq.settings!.booleanModifyHierarchy === true
        && currentPageName
        && (currentPageName.match(/^\d{4}/)
            || currentPageName.match(/^(\d{4}\/\d{2})/)
            //|| currentPageName.match(/^(\d{4}\/\d{2}\/\d{2})/) //Journalの場合はもともと表示されない
        )) {
        parent.document!.querySelector("body[data-page=\"page\"]>div#root>div>main div#main-content-container div.page-hierarchy")?.classList.add('th-journal')
    }

    setTimeout(() => { //あとからでもいい処理
        //ページタグの折りたたみを有効にする
        const pageTagsElement = parent.document.querySelector("body[data-page=\"page\"]>div#root>div>main div#main-content-container div.page.relative div.page-tags") as HTMLElement | null
        if (pageTagsElement) {
            const titleElement = pageTagsElement.querySelector("body[data-page=\"page\"]>div#root>div>main div.content div.foldable-title h2") as HTMLElement | null
            const eleInitial = pageTagsElement.querySelector("div.initial") as HTMLElement | null
            if (titleElement && eleInitial) titleCollapsedRegisterEvent(titleElement, eleInitial)
        }
        if (logseq.settings!.booleanHierarchyForFirstLevelOnly === true
            || logseq.settings!.booleanRemoveBeginningLevel === true) {
            // Hierarchyのサブレベル1のみを表示する
            if (logseq.settings!.booleanHierarchyForFirstLevelOnly === true) hierarchyForFirstLevelOnly(currentPageName.split("/"))
            // Hierarchyの最初から始まるレベルを削除する
            hierarchyRemoveBeginningLevel(currentPageName.split("/"))
        }
    }, 100)

    // wide view modeのみ
    if (logseq.settings!.placeSelect === "wide view") {
        // Linked References 遅延ロード
        setTimeout(() => {
            const ele = (parent.document.querySelector("body[data-page=\"page\"]>div#root>div>main div#main-content-container div.page.relative>div>div.lazy-visibility>div>div.fade-enter-active>div.references.page-linked") as HTMLDivElement | null)
            if (ele) ele.style.display = "block"
        }, 300)
    }

    processingOnPageChanged = false
}


let processingBlockChanged: boolean = false//処理中 TOC更新中にブロック更新が発生した場合に処理を中断する
let onBlockChangedOnce: boolean = false//一度のみ
export const onBlockChanged = () => {
    if (onBlockChangedOnce === true) return
    onBlockChangedOnce = true //index.tsの値を書き換える
    logseq.DB.onChanged(async ({ blocks }) => {
        if (processingBlockChanged === true
            || currentPageName === ""
            || logseq.settings!.booleanTableOfContents === false) return
        //headingがあるブロックが更新されたら
        const findBlock = blocks.find((block) => block.properties?.heading) as BlockEntity | null //uuidを得るためsomeではなくfindをつかう
        if (!findBlock) return
        const uuid = findBlock ? findBlock!.uuid : null
        updateToc()//toc更新を抑制

        //ブロック更新のコールバック
        if (uuid) logseq.DB.onBlockChanged(uuid, async () => updateToc())
    })
}


const updateToc = () => {
    if (processingBlockChanged === true) return
    processingBlockChanged = true //index.tsの値を書き換える
    setTimeout(async () => {
        await displayToc(currentPageName) //toc更新
        processingBlockChanged = false
    }, 300)
}


const onSettingsChanged = () => {
    logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

        // 表示場所の変更
        if (oldSet.placeSelect !== newSet.placeSelect) { //tocはwide viewのみ
            if (oldSet.placeSelect === "wide view"
                && newSet.placeSelect !== "wide view") removeElementClass("th-toc")
            else
                if (oldSet.placeSelect !== "wide view"
                    && newSet.placeSelect === "wide view") {
                    const current = await logseq.Editor.getCurrentPage() as { name: PageEntity["name"] } | null
                    if (current && current.name) displayToc(current.name)
                    onBlockChanged()
                }

            if (newSet.booleanModifyHierarchy === true
                && !parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`))
                provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)
            else if (newSet.booleanModifyHierarchy === false) {
                removeProvideStyle(keyPageAccessory)
                removeProvideStyle(keyNestingPageAccessory)
            }

            switch (newSet.placeSelect) {
                case "bottom":
                    removeProvideStyle(keySide)
                    removeProvideStyle(keyWide)
                    removeProvideStyle(keyPageAccessoryOrder)
                    removeProvideStyle(keyWideModeJournalQueries)
                    logseq.provideStyle({ key: keyBottom, style: fileBottom })
                    break
                case "side":
                    removeProvideStyle(keyBottom)
                    removeProvideStyle(keyWide)
                    removeProvideStyle(keyPageAccessoryOrder)
                    logseq.provideStyle({ key: keySide, style: fileSide })
                    break
                case "wide view":
                    removeProvideStyle(keySide)
                    removeProvideStyle(keyBottom)
                    logseq.provideStyle({ key: keyWide, style: fileWide })
                    logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(logseq.settings) })
                    if (newSet.booleanWideModeJournalQueries === true) logseq.provideStyle({ key: keyWideModeJournalQueries, style: fileWideModeJournalQueries })
                    break
                case "unset":
                    removeProvideStyle(keySide)
                    removeProvideStyle(keyBottom)
                    removeProvideStyle(keyWide)
                    removeProvideStyle(keyPageAccessoryOrder)
                    removeProvideStyle(keyWideModeJournalQueries)
                    removeProvideStyle(keyPageAccessory)
                    removeProvideStyle(keyNestingPageAccessory)
                    break
            }


            //表示場所の変更以外
        } else {


            if (oldSet.booleanUnlinkedReferences === true
                && newSet.booleanUnlinkedReferences === false) removeProvideStyle(keyUnlinkedReferencesHidden)
            else
                if (oldSet.booleanUnlinkedReferences === false
                    && newSet.booleanUnlinkedReferences === true) logseq.provideStyle({ key: keyUnlinkedReferencesHidden, style: CSSUnlinkedHidden })

            // 階層のサブレベル1のみを表示する
            if (oldSet.booleanHierarchyForFirstLevelOnly === true
                && newSet.booleanHierarchyForFirstLevelOnly === false) removeProvideStyle(keyHierarchyForFirstLevelOnly)
            else
                if (oldSet.booleanHierarchyForFirstLevelOnly === false
                    && newSet.booleanHierarchyForFirstLevelOnly === true && currentPageName) hierarchyForFirstLevelOnly(currentPageName.split("/"))

            if (oldSet.booleanModifyHierarchy === false
                && newSet.booleanModifyHierarchy === true) {
                if (!parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`)
                    && !parent.document.head.querySelector(`style[data-injected-style^="${keyNestingPageAccessory}"]`)) provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)
            }
            else
                if (oldSet.booleanModifyHierarchy === true
                    && newSet.booleanModifyHierarchy === false) {
                    removeProvideStyle(keyPageAccessory)
                    removeProvideStyle(keyNestingPageAccessory)
                }
            if (oldSet.booleanTableOfContents === false
                && newSet.booleanTableOfContents === true) {
                const current = await logseq.Editor.getCurrentPage() as { name: PageEntity["name"] } | null
                if (current && current.name) displayToc(current.name)
                onBlockChanged()
            }
            else
                if (oldSet.booleanTableOfContents === true
                    && newSet.booleanTableOfContents === false) removeElementClass("th-toc")

            //positionのCSSを変更
            if (newSet.placeSelect === "wide view") {
                if (oldSet.enumScheduleDeadline !== newSet.enumScheduleDeadline
                    || oldSet.enumTableOfContents !== newSet.enumTableOfContents
                    || oldSet.enumLinkedReferences !== newSet.enumLinkedReferences
                    || oldSet.enumUnlinkedReferences !== newSet.enumUnlinkedReferences
                    || oldSet.enumPageHierarchy !== newSet.enumPageHierarchy
                    || oldSet.enumPageTags !== newSet.enumPageTags) {
                    removeProvideStyle(keyPageAccessoryOrder)
                    logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(newSet) })
                }
                if (oldSet.booleanWideModeJournalQueries === false
                    && newSet.booleanWideModeJournalQueries === true)
                    logseq.provideStyle({ key: keyWideModeJournalQueries, style: fileWideModeJournalQueries })
                else
                    if (oldSet.booleanWideModeJournalQueries === true
                        && newSet.booleanWideModeJournalQueries === false)
                        removeProvideStyle(keyWideModeJournalQueries)
            }
            if (oldSet.booleanSplitHierarchy !== newSet.booleanSplitHierarchy) {
                if (newSet.booleanSplitHierarchy === true) {
                    splitHierarchy(currentPageName)
                    if (newSet.booleanRemoveHierarchyPageTitle === true)
                        removeOnSettingsChangedHierarchyPageTitleOnce() //ページ名の階層を削除
                } else
                    if (newSet.booleanSplitHierarchy === false) {
                        removeElementId("hierarchyLinks")
                        revertOnSettingsChangedHierarchyPageTitleOnce() //元に戻す
                    }
            }
            if (oldSet.booleanSplitHierarchy === true) { //Hierarchy Linksが有効な場合のみ
                if (oldSet.booleanRemoveHierarchyPageTitle === false
                    && newSet.booleanRemoveHierarchyPageTitle === true)
                    removeOnSettingsChangedHierarchyPageTitleOnce() //ページ名の階層を削除
                else
                    if (oldSet.booleanRemoveHierarchyPageTitle === true
                        && newSet.booleanRemoveHierarchyPageTitle === false)
                        revertOnSettingsChangedHierarchyPageTitleOnce()
            }
        }
    })
}


export const displayToc = async (pageName: string) => {
    if (logseq.settings!.placeSelect !== "wide view") return //wide viewのみ


    //ページの全ブロックからheaderがあるかどうかを確認する
    const headers = getTocBlocks(await logseq.Editor.getPageBlocksTree(pageName) as BlockEntity[] as Child[])
    if (headers.length > 0) {
        //Headerが存在する場合のみ
        const element = parent.document.getElementById("tocInPage") as HTMLDivElement | null
        if (element) element.innerHTML = "" //elementが存在する場合は中身を削除する
        else await insertElement() //elementが存在しない場合は作成する
        await headersList(parent.document.getElementById("tocInPage") as HTMLDivElement, headers, pageName)
        //toc更新用のイベントを登録する
        if (onBlockChangedOnce === false) onBlockChanged()
        //タイトルでcollapsedする処理
        tocContentTitleCollapsed(pageName)
    }
}


logseq.ready(main).catch(console.error)