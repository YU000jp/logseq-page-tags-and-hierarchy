import "@logseq/libs"
import { BlockEntity, LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import fileBottom from './bottom.css?inline'
import { removeOnSettingsChangedHierarchyPageTitleOnce, revertOnSettingsChangedHierarchyPageTitleOnce, splitPageTitle, WhiteboardCallback } from "./breadcrumb"
import { hierarchyForFirstLevelOnly, hierarchyRemoveBeginningLevel } from "./hierarchyList"
import { provideStyle, removeElementClass, removeElementId, removeProvideStyle, titleCollapsedRegisterEvent } from "./lib"
import fileCSSMain from './main.css?inline'
import fileNestingPageAccessory from "./pageAccessory.css?inline"
import CSSLinkedRefHiddenTagsProperty from "./refHiddenTags.css?inline"
import { settingsTemplate, } from "./settings"
import fileSide from './side.css?inline'
import { Child, CSSpageSubOrder, getTocBlocks, headersList, insertElement, tocContentTitleCollapsed } from "./toc"
import ja from "./translations/ja.json"
import af from "./translations/af.json"
import de from "./translations/de.json"
import es from "./translations/es.json"
import fr from "./translations/fr.json"
import id from "./translations/id.json"
import it from "./translations/it.json"
import ko from "./translations/ko.json"
import nbNO from "./translations/nb-NO.json"
import nl from "./translations/nl.json"
import pl from "./translations/pl.json"
import ptBR from "./translations/pt-BR.json"
import ptPT from "./translations/pt-PT.json"
import ru from "./translations/ru.json"
import sk from "./translations/sk.json"
import tr from "./translations/tr.json"
import uk from "./translations/uk.json"
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
const keyLinkedRefHiddenTagsProperty = "th-linkedRefHiddenTagsProperty"
export const keyHierarchyForFirstLevelOnly = "th-hierarchyForFirstLevelOnly"
export const keyHierarchyRemoveBeginningLevel = "th-hierarchyRemoveBeginningLevel"


const main = async () => {

    await l10nSetup({
        builtinTranslations: {//Full translations
            ja, af, de, es, fr, id, it, ko, "nb-NO": nbNO, nl, pl, "pt-BR": ptBR, "pt-PT": ptPT, ru, sk, tr, uk, "zh-CN": zhCN, "zh-Hant": zhHant
        }
    })
    /* user settings */
    logseq.useSettingsSchema(settingsTemplate())

    //設定項目 > ModifyHierarchyList
    if (logseq.settings!.booleanModifyHierarchy === true)
        provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)

    //設定項目 > Unlinked Referencesを表示しない
    if (logseq.settings!.booleanUnlinkedReferences === true)
        logseq.provideStyle({
            key: keyUnlinkedReferencesHidden,
            style: CSSUnlinkedHidden
        })

    //設定項目 > Linked Referencesのページタグのみが含まれる場合、そのプロパティを省略する
    if (logseq.settings!.booleanLinkedRefRemoveTagsProperty === true)
        logseq.provideStyle({
            key: keyLinkedRefHiddenTagsProperty,
            style: CSSLinkedRefHiddenTagsProperty
        })
    //設定項目 > Journal Queriesを表示するかどうか
    //wide viewモード以外も。
    if (logseq.settings!.booleanWideModeJournalQueries === true)
        logseq.provideStyle({
            key: keyWideModeJournalQueries,
            style: fileWideModeJournalQueries
        })

    //CSS minify https://csscompressor.com/
    switch (logseq.settings!.placeSelect) {
        case "unset":
            break
        case "bottom":
            logseq.provideStyle({
                key: keyBottom,
                style: fileBottom
            })
            break
        case "side":
            logseq.provideStyle({
                key: keySide,
                style: fileSide
            })
            break
        case "Side"://Sideミス対策
            logseq.provideStyle({
                key: keySide,
                style: fileSide
            })
            logseq.updateSettings({
                placeSelect: "side"
            }) //default値を間違えていたため修正(変更していないユーザー用)
            break
        case "wide view":
            logseq.provideStyle({
                key: keyWide,
                style: fileWide
            })
            logseq.provideStyle({
                key: keyPageAccessoryOrder,
                style: CSSpageSubOrder(logseq.settings)
            })

            break
    }

    // ページ名の階層を分割する を含む
    logseq.provideStyle(fileCSSMain) //メインCSS

    //ページ読み込み時に実行コールバック
    logseq.App.onRouteChanged(async ({ template }) => {
        switch (template) {
            case '/home':
                currentPageName = ""
                break
            case '/page/:name':
                onPageChangedCallback()
                break
            case '/whiteboard/:name':
                //Whiteboardの場合
                if (logseq.settings!.booleanWhiteboardSplitHierarchy === true)
                    WhiteboardCallback()
                break
        }
    })

    //ページ読み込み時に実行コールバック
    logseq.App.onPageHeadActionsSlotted(async () => {
        onPageChangedCallback()
        setTimeout(() => {
            const node: Node | null = parent.document.body.querySelector("div#root>div>main div#main-content-container div.whiteboard") as Node | null
            if (Node
                && logseq.settings!.booleanWhiteboardSplitHierarchy === true)
                WhiteboardCallback()
        }, 1)

    }) //バグあり？onRouteChangedとともに動作保証が必要

    //ブロック更新のコールバック
    if (logseq.settings!.placeSelect === "wide view"
        && logseq.settings!.booleanTableOfContents === true)
        onBlockChanged()

    //設定変更のコールバック
    onSettingsChangedCallback()

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
//ページ読み込み時に実行コールバック
const onPageChangedCallback = async () => {

    if (processingOnPageChanged === true)
        return
    processingOnPageChanged = true
    // return 禁止
    //処理中断対策
    setTimeout(() => processingOnPageChanged = false, 1000)


    const current = await logseq.Editor.getCurrentPage() as {
        originalName: PageEntity["originalName"],
        journal?: PageEntity["journal?"]
    } | null
    if (current) {
        currentPageName = current.originalName
        //Hierarchy Links
        if (logseq.settings!.booleanSplitHierarchy === true
            && currentPageName
            && currentPageName.includes("/") as boolean === true
            && !(current.journal === true
                && currentPageName.includes(",")) // Journalかつ,が含まれる場合は除外
        ) splitPageTitle(currentPageName, "singlePage")

        //Hierarchyのelementをコピーしたが、リンクやクリックイベントはコピーされない
        if (logseq.settings!.placeSelect === "wide view"
            && logseq.settings!.booleanTableOfContents === true)
            displayToc(currentPageName)
    }

    let flagYearOrMonth: boolean = false
    //ページ名が2023/06/24の形式にマッチする場合
    if (logseq.settings!.booleanModifyHierarchy === true
        && currentPageName
        && (currentPageName.match(/^\d{4}/)
            || currentPageName.match(/^(\d{4}\/\d{2})/)
        )) {
        parent.document.body.querySelector("div#root>div>main div#main-content-container div.page-hierarchy")?.classList.add('th-journal')
        flagYearOrMonth = true
    }

    setTimeout(() => { //あとからでもいい処理
        //ページタグの折りたたみを有効にする
        const pageTagsElement = parent.document.body.querySelector("div#root>div>main div#main-content-container div.page.relative div.page-tags") as HTMLElement | null
        if (pageTagsElement) {
            const titleElement = pageTagsElement.querySelector("div.content div.foldable-title h2") as HTMLElement | null
            const eleInitial = pageTagsElement.querySelector("div.initial") as HTMLElement | null
            if (titleElement
                && eleInitial)
                titleCollapsedRegisterEvent(titleElement, eleInitial)
        }

        if (flagYearOrMonth === false) { // 年と月のページの場合は処理しない
            if (logseq.settings!.booleanHierarchyForFirstLevelOnly === true)// Hierarchyのサブレベル1のみを表示する
                hierarchyForFirstLevelOnly(currentPageName.split("/"))
            if (logseq.settings!.booleanRemoveBeginningLevel === true)// Hierarchyの最初から始まるレベルを削除する
                hierarchyRemoveBeginningLevel(currentPageName.split("/"), currentPageName)
        }
    }, 1)

    // wide view modeのみ
    if (logseq.settings!.placeSelect === "wide view")
        // Linked References 遅延ロード
        setTimeout(() => {
            const ele = (parent.document.body.querySelector("div#root>div>main div#main-content-container div.page.relative>div>div.lazy-visibility>div>div.fade-enter-active>div.references.page-linked") as HTMLDivElement | null)
            if (ele) ele.style.display = "block"
        }, 300)

    processingOnPageChanged = false
}


let processingBlockChanged: boolean = false//処理中 TOC更新中にブロック更新が発生した場合に処理を中断する
let onBlockChangedOnce: boolean = false//一度のみ
export const onBlockChanged = () => {
    if (onBlockChangedOnce === true)
        return
    onBlockChangedOnce = true //index.tsの値を書き換える
    logseq.DB.onChanged(async ({ blocks }) => {
        if (processingBlockChanged === true
            || currentPageName === ""
            || logseq.settings!.booleanTableOfContents === false)
            return
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
    if (processingBlockChanged === true)
        return
    processingBlockChanged = true //index.tsの値を書き換える
    setTimeout(async () => {
        await displayToc(currentPageName) //toc更新
        processingBlockChanged = false
    }, 300)
}


const onSettingsChangedCallback = () => {

    logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

        // 表示場所の変更
        if (oldSet.placeSelect !== newSet.placeSelect) { //tocはwide viewのみ
            if (oldSet.placeSelect === "wide view"
                && newSet.placeSelect !== "wide view")
                removeElementClass("th-toc")
            else
                if (oldSet.placeSelect !== "wide view"
                    && newSet.placeSelect === "wide view") {
                    const current = await logseq.Editor.getCurrentPage() as { name: PageEntity["name"] } | null
                    if (current
                        && current.name)
                        displayToc(current.name)
                    onBlockChanged()
                }

            if (newSet.booleanModifyHierarchy === true
                && !parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`))
                provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)
            else
                if (newSet.booleanModifyHierarchy === false) {
                    removeProvideStyle(keyPageAccessory)
                    removeProvideStyle(keyNestingPageAccessory)
                }

            // UIの変更
            switch (newSet.placeSelect) {
                case "bottom":
                    removeProvideStyle(keySide)
                    removeProvideStyle(keyWide)
                    removeProvideStyle(keyPageAccessoryOrder)
                    removeProvideStyle(keyWideModeJournalQueries)
                    logseq.provideStyle({
                        key: keyBottom,
                        style: fileBottom
                    })
                    break
                case "side":
                    removeProvideStyle(keyBottom)
                    removeProvideStyle(keyWide)
                    removeProvideStyle(keyPageAccessoryOrder)
                    logseq.provideStyle({
                        key: keySide,
                        style: fileSide
                    })
                    break
                case "wide view":
                    removeProvideStyle(keySide)
                    removeProvideStyle(keyBottom)
                    logseq.provideStyle({
                        key: keyWide,
                        style: fileWide
                    })
                    logseq.provideStyle({
                        key: keyPageAccessoryOrder,
                        style: CSSpageSubOrder(logseq.settings)
                    })
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
                && newSet.booleanUnlinkedReferences === false)
                removeProvideStyle(keyUnlinkedReferencesHidden)
            else
                if (oldSet.booleanUnlinkedReferences === false
                    && newSet.booleanUnlinkedReferences === true)
                    logseq.provideStyle({
                        key: keyUnlinkedReferencesHidden,
                        style: CSSUnlinkedHidden
                    })

            if (oldSet.booleanLinkedRefRemoveTagsProperty === true
                && newSet.booleanLinkedRefRemoveTagsProperty === false)
                removeProvideStyle(keyLinkedRefHiddenTagsProperty)
            else
                if (oldSet.booleanLinkedRefRemoveTagsProperty === false
                    && newSet.booleanLinkedRefRemoveTagsProperty === true)
                    logseq.provideStyle({
                        key: keyLinkedRefHiddenTagsProperty,
                        style: CSSLinkedRefHiddenTagsProperty
                    })

            // 階層のサブレベル1のみを表示する
            if (oldSet.booleanHierarchyForFirstLevelOnly === true
                && newSet.booleanHierarchyForFirstLevelOnly === false)
                removeProvideStyle(keyHierarchyForFirstLevelOnly)
            else
                if (oldSet.booleanHierarchyForFirstLevelOnly === false
                    && newSet.booleanHierarchyForFirstLevelOnly === true
                    && currentPageName)
                    hierarchyForFirstLevelOnly(currentPageName.split("/"))

            if (oldSet.booleanModifyHierarchy === false
                && newSet.booleanModifyHierarchy === true) {
                if (!parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`)
                    && !parent.document.head.querySelector(`style[data-injected-style^="${keyNestingPageAccessory}"]`))
                    provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)
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
                if (current
                    && current.name)
                    displayToc(current.name)
                onBlockChanged()
            }
            else
                if (oldSet.booleanTableOfContents === true
                    && newSet.booleanTableOfContents === false)
                    removeElementClass("th-toc")

            if (oldSet.booleanWideModeJournalQueries === false
                && newSet.booleanWideModeJournalQueries === true)
                logseq.provideStyle({
                    key: keyWideModeJournalQueries,
                    style: fileWideModeJournalQueries
                })
            else
                if (oldSet.booleanWideModeJournalQueries === true
                    && newSet.booleanWideModeJournalQueries === false)
                    removeProvideStyle(keyWideModeJournalQueries)

            //positionのCSSを変更
            if (newSet.placeSelect === "wide view") {
                if (oldSet.enumScheduleDeadline !== newSet.enumScheduleDeadline
                    || oldSet.enumTableOfContents !== newSet.enumTableOfContents
                    || oldSet.enumLinkedReferences !== newSet.enumLinkedReferences
                    || oldSet.enumUnlinkedReferences !== newSet.enumUnlinkedReferences
                    || oldSet.enumPageHierarchy !== newSet.enumPageHierarchy
                    || oldSet.enumPageTags !== newSet.enumPageTags) {
                    removeProvideStyle(keyPageAccessoryOrder)
                    logseq.provideStyle({
                        key: keyPageAccessoryOrder,
                        style: CSSpageSubOrder(newSet)
                    })
                }

            }
            if (oldSet.booleanSplitHierarchy !== newSet.booleanSplitHierarchy) {
                if (newSet.booleanSplitHierarchy === true) {
                    splitPageTitle(currentPageName, "singlePage")
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
        if (element)
            element.innerHTML = "" //elementが存在する場合は中身を削除する
        else
            await insertElement() //elementが存在しない場合は作成する
        await headersList(parent.document.getElementById("tocInPage") as HTMLDivElement, headers, pageName)
        //toc更新用のイベントを登録する
        if (onBlockChangedOnce === false)
            onBlockChanged()
        //タイトルでcollapsedする処理
        tocContentTitleCollapsed(pageName)
    }
}


logseq.ready(main).catch(console.error)