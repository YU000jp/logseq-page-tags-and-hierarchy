import "@logseq/libs"
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user"
import { splitPageTitle } from "./breadcrumb"
import { firstLoadPlugin } from "./firstLoadPlugin"
import { hierarchyForFirstLevelOnly, hierarchyRemoveBeginningLevel } from "./hierarchyList"
import { titleCollapsedRegisterEvent } from "./lib"
import { logseqModelCheck } from "./logseqModelCheck"
import { getCurrentPageForMd } from "./query/advancedQuery"
import { settingsTemplate, } from "./settings/settings"
import { Child, getTocBlocks, headersList, insertElement, tocContentTitleCollapsed } from "./toc"

export let currentPageName: string = ""
export const getCurrentPageNameString = () => currentPageName //ページ名を取得
export const changeCurrentPageTitle = (name: string) => {
    currentPageName = name
    // console.log("replaceCurrentPageName", currentPageName)
}
// 変数 (同じモジュール内で使用するため、exportしない)
let logseqVersion: string = "" //バージョンチェック用
let logseqMdModel: boolean = false //モデルチェック用
let logseqDbGraph: boolean = false //DBグラフチェック用
// 外部から参照するためにexportする
export const getLogseqVersion = () => logseqVersion //バージョンチェック用
export const replaceLogseqVersion = (version: string) => logseqVersion = version
export const booleanLogseqMdModel = () => logseqMdModel //モデルチェック用
export const replaceLogseqMdModel = (mdModel: boolean) => logseqMdModel = mdModel

export const booleanDbGraph = () => logseqDbGraph //DBグラフチェック用
export const replaceLogseqDbGraph = (dbGraph: boolean) => logseqDbGraph = dbGraph


const main = async () => {

    // Logseqモデルのチェックを実行
    const [logseqDbGraph, logseqMdModel] = await logseqModelCheck()

    // 初期ロード
    await firstLoadPlugin(logseqDbGraph, logseqMdModel)

}//end main


export const setUserSettings = (logseqDbGraph: boolean, logseqMdModel: boolean, setting: string) => {
    logseq.useSettingsSchema(settingsTemplate(logseqDbGraph, logseqMdModel, setting === "wide view" ? true : false)) //設定を登録
}


let processingOnPageChanged: boolean = false //処理中
//ページ読み込み時に実行コールバック
export const onPageChangedCallback = async (logseqDbGraph: boolean, logseqMdModel: boolean) => {

    if (processingOnPageChanged === true)
        return
    processingOnPageChanged = true
    // return 禁止
    //処理中断対策
    setTimeout(() => processingOnPageChanged = false, 1000)

    const currentTitle = logseqMdModel === false ?
        (parent.document.body.dataset["page"] || null) // DBモデル
        : await getCurrentPageForMd() as string | null // MDモデル
    if (currentTitle) {
        if (logseqMdModel === false && currentTitle === "Logseq") return // DBモデルの場合、Logseqページは除外
        currentPageName = currentTitle as string
        // console.log("onPageChangedCallback currentPageName", currentPageName)
        //Hierarchy Links
        if (logseq.settings!.booleanSplitHierarchy === true
            && currentPageName !== ""
            && currentPageName.includes("/") as boolean === true
            && !((parent.document.body.querySelector("#main-content-container div.journal.page") as HTMLDivElement | null)
                && currentPageName.includes(",")) // Journalかつ,が含まれる場合は除外
        ) splitPageTitle(logseqDbGraph, logseqMdModel, currentPageName, "singlePage")

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
    if (onBlockChangedOnce === true || logseqDbGraph === true || logseqMdModel === false) return //DBグラフ、MDモデルでは実行しない
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


// Logseqの準備ができたらmainを実行
logseq.ready(main).catch(console.error)