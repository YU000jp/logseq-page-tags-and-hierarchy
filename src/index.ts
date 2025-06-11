import "@logseq/libs"
import { AppInfo, BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { applyModelStyles } from "./css/applyModelStyles"
import { splitPageTitle } from "./breadcrumb"
import { hierarchyForFirstLevelOnly, hierarchyRemoveBeginningLevel } from "./hierarchyList"
import { keyBottom, keyHierarchyForFirstLevelOnly, keyHierarchyRemoveBeginningLevel, keyNestingPageAccessory, keyPageAccessory, keyPageAccessoryOrder, keySide, keyUnlinkedReferencesHidden, keyWide, keyWideModeJournalQueries } from "./key"
import { removeProvideStyles, titleCollapsedRegisterEvent } from "./lib"
import { getCurrentPageName } from "./query/advancedQuery"
import { settingsTemplate, } from "./settings/settings"
import { Child, getTocBlocks, headersList, insertElement, tocContentTitleCollapsed } from "./toc"
import { firstLoadPlugin } from "./firstLoadPlugin"

export let currentPageName: string = ""
export const getCurrentPageNameString = () => currentPageName //ページ名を取得
export const replaceCurrentPageName = (name: string) => {
    currentPageName = name
    // console.log("replaceCurrentPageName", currentPageName)
}
let logseqVersion: string = "" //バージョンチェック用
export let logseqMdModel: boolean = false //モデルチェック用
export let logseqDbGraph: boolean = false
// export const getLogseqVersion = () => logseqVersion //バージョンチェック用
export const booleanLogseqMdModel = () => logseqMdModel //モデルチェック用
export const booleanDbGraph = () => logseqDbGraph //バージョンチェック用


const main = async () => {

    // Logseqモデルのチェックを実行
    await firstLoadLogseqModelCheck()

    // 初期ロード
    await firstLoadPlugin()

}//end main


export const setUserSettings = (setting: string) => {
    logseq.useSettingsSchema(settingsTemplate(logseqDbGraph, logseqMdModel, setting === "wide view" ? true : false)) //設定を登録
}


let processingOnPageChanged: boolean = false //処理中
//ページ読み込み時に実行コールバック
export const onPageChangedCallback = async () => {

    if (processingOnPageChanged === true)
        return
    processingOnPageChanged = true
    // return 禁止
    //処理中断対策
    setTimeout(() => processingOnPageChanged = false, 1000)


    const current = await getCurrentPageName() as {
        title: string,
        journal?: PageEntity["journal?"]
    } | null
    // console.log("onPageChangedCallback current", current)
    if (current) {
        currentPageName = current.title as string
        // console.log("onPageChangedCallback currentPageName", currentPageName)
        //Hierarchy Links
        if (logseq.settings!.booleanSplitHierarchy === true
            && currentPageName !== ""
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
        parent.document.body.querySelector("#main-content-container div.page-hierarchy")?.classList.add('th-journal')
        flagYearOrMonth = true
    }

    setTimeout(() => { //あとからでもいい処理
        //ページタグの折りたたみを有効にする
        const pageTagsElement = parent.document.body.querySelector("#main-content-container div.page div.page-tags") as HTMLElement | null
        if (pageTagsElement) {
            const titleElement = pageTagsElement.querySelector("div.content div.foldable-title h2") as HTMLElement | null
            const eleInitial = pageTagsElement.querySelector("div.initial") as HTMLElement | null
            if (titleElement
                && eleInitial)
                titleCollapsedRegisterEvent(titleElement, eleInitial)
        }

        if (flagYearOrMonth === false) { // 年と月のページの場合は処理しない
            if (logseq.settings!.booleanHierarchyForFirstLevelOnly === true)// Hierarchyのサブレベル1のみを表示する
                hierarchyForFirstLevelOnly(currentPageName.split("/"), currentPageName)
            if (logseq.settings!.booleanRemoveBeginningLevel === true)// Hierarchyの最初から始まるレベルを削除する
                hierarchyRemoveBeginningLevel(currentPageName.split("/"), currentPageName)
        }
    }, 1)

    // wide view modeのみ
    if (logseq.settings!.placeSelect === "wide view")
        // Linked References 遅延ロード
        setTimeout(() => {
            const ele = (parent.document.body.querySelector("#main-content-container div.page>div>div.lazy-visibility>div>div.fade-enter-active>div.references.page-linked") as HTMLDivElement | null)
            if (ele) ele.style.display = "block"
        }, 300)

    processingOnPageChanged = false
}


let processingBlockChanged: boolean = false//処理中 TOC更新中にブロック更新が発生した場合に処理を中断する
let onBlockChangedOnce: boolean = false//一度のみ
export const onBlockChanged = () => {
    if (onBlockChangedOnce === true || logseqDbGraph === true)
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
    if (processingBlockChanged === true || logseqDbGraph === true || logseqMdModel === false) return //処理中、DBグラフ、DBモデルは更新しない
    processingBlockChanged = true //index.tsの値を書き換える
    setTimeout(async () => {
        await displayToc(currentPageName) //toc更新
        processingBlockChanged = false
    }, 300)
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



// ここからはLogseqのバージョンチェックとモデルチェック


// MDモデルかどうかのチェック DBモデルはfalse
const checkLogseqVersion = async (): Promise<boolean> => {
    const logseqInfo = (await logseq.App.getInfo("version")) as AppInfo | any
    //  0.11.0もしくは0.11.0-alpha+nightly.20250427のような形式なので、先頭の3つの数値(1桁、2桁、2桁)を正規表現で取得する
    const version = logseqInfo.match(/(\d+)\.(\d+)\.(\d+)/)
    if (version) {
        logseqVersion = version[0] //バージョンを取得
        // console.log("logseq version: ", logseqVersion)

        // もし バージョンが0.10.*系やそれ以下ならば、logseqVersionMdをtrueにする
        if (logseqVersion.match(/0\.([0-9]|10)\.\d+/)) {
            logseqMdModel = true
            // console.log("logseq version is 0.10.* or lower")
            return true
        } else logseqMdModel = false
    } else logseqVersion = "0.0.0"
    return false
}
// DBグラフかどうかのチェック
// DBグラフかどうかのチェック DBグラフだけtrue
const checkLogseqDbGraph = async (): Promise<boolean> => {
    const element = parent.document.querySelector(
        "div.block-tags",
    ) as HTMLDivElement | null // ページ内にClassタグが存在する  WARN:: ※DOM変更の可能性に注意
    if (element) {
        logseqDbGraph = true
        return true
    } else logseqDbGraph = false
    return false
}

const showDbGraphIncompatibilityMsg = () => {
    logseq.UI.showMsg("The ’Page-tags and Hierarchy’ plugin does not support Logseq DB graph.", "warning", { timeout: 5000 })
    return
}

const firstLoadLogseqModelCheck = async () => {
    // バージョンチェック
    logseqMdModel = await checkLogseqVersion()
    // console.log("logseq version: ", logseqVersion)
    // console.log("logseq version is MD model: ", logseqVersionMd)
    // 100ms待つ
    await new Promise(resolve => setTimeout(resolve, 100))

    // if (logseqVersionMd === false) {
    //   // Logseq ver 0.10.*以下にしか対応していない
    //   logseq.UI.showMsg("The ’Page-tags and Hierarchy’ plugin only supports Logseq ver 0.10.* and below.", "warning", { timeout: 5000 })
    //   return
    // }

    // // DBグラフチェック
    logseqDbGraph = await checkLogseqDbGraph()
    if (logseqDbGraph === true) {
        // DBグラフには対応していない
        return showDbGraphIncompatibilityMsg()
    }

    logseq.App.onCurrentGraphChanged(async () => {
        logseqDbGraph = await checkLogseqDbGraph()
        if (logseqDbGraph === true) {
            // DBグラフには対応していない
            showDbGraphIncompatibilityMsg() //メッセージを通知

            // 使わない<style>をまとめて削除
            removeProvideStyles([
                keyBottom,
                keySide,
                keyWide,
                keyPageAccessoryOrder,
                keyNestingPageAccessory,
                keyWideModeJournalQueries,
                keyUnlinkedReferencesHidden,
                keyPageAccessory,
                keyHierarchyForFirstLevelOnly,
                keyHierarchyRemoveBeginningLevel
            ])

        } else {
            applyModelStyles() // モデルに合わせてスタイルを設定
        }
        /* user settings */
        setUserSettings(logseq.settings!.placeSelect as string) //設定を再登録
    })
}

// ここまで はLogseqのバージョンチェックとモデルチェック



// Logseqの準備ができたらmainを実行
logseq.ready(main).catch(console.error)