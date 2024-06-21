import { PageEntity } from "@logseq/libs/dist/LSPlugin.user"

/**
 * Splits the hierarchy of a page name and creates links for each level of the hierarchy.
 * @param pageName - The name of the page to split the hierarchy for.
 * @returns void
 */
export const splitPageTitle = (pageName: string, querySelectorString: "singlePage" | "whiteboardTitle") => {
    if (parent.document.getElementById("hierarchyLinks") !== null)
        return//存在していたら何もしない
    //pageNameに「/」が含まれるかチェック済み
    const h1Element = parent.document.querySelector(
        querySelectorString === "singlePage" ?
            "body[data-page=page]>div#root>div>main div#main-content-container h1.page-title" //ページ
            : "div#root>div>main div#main-content-container div.whiteboard-page-title>h1.page-title" //ホワイトボードのタイトル
    ) as HTMLElement | null
    if (h1Element === null)
        return

    // ページ名を取得 (ホワイトボードの場合は、innerTextを使う)
    if (querySelectorString === "whiteboardTitle")
        pageName = (h1Element.querySelector("div.page-title-sizer-wrapper>span.title") as HTMLElement).innerText

    // 「[[」と「]]」が同時に含まれる場合は、ページ名として認識しない
    if (pageName.includes("[[")
        && pageName.includes("]]"))
        return

    createTitleLinks(pageName, h1Element)
}

const createTitleLinks = (pageName: string, h1Element: HTMLElement, flag?: { class?: boolean }) => {
    const pageNameArr: string[] = pageName.split('/')
    // pageNameArrの最後の要素
    if (logseq.settings!.booleanRemoveHierarchyPageTitle === true)
        pageTitleLastPartOnlyControl(pageNameArr.pop() as string, pageName, "singlePage") //日誌以外のページ (日誌の場合は、タイトルを弄らない)

    //h1Elementの上にspan#hierarchyLinksを作成
    const hierarchyLinks: HTMLSpanElement = document.createElement("span")
    if (flag?.class)
        hierarchyLinks.className = "hierarchyLinks"
    else
        hierarchyLinks.id = "hierarchyLinks"
    h1Element.insertAdjacentElement("beforebegin", hierarchyLinks)
    let parts: string = ""

    for (const [index, part] of pageNameArr.entries()) {
        if (parts === "")
            parts = part
        else
            if (index !== pageNameArr.length) {
                parts += "/" + part
                hierarchyLinks.insertAdjacentText("beforeend", " / ")
            } else
                return//最後の要素はリンクを作成しない
        createAnchor(parts, part, hierarchyLinks)
    }
}

// ホワイトボードの場合
let processingWhiteboard: boolean = false
export const WhiteboardCallback = () => {
    if (processingWhiteboard === true)
        return
    processingWhiteboard = true
    setTimeout(() =>
        processingWhiteboard = false, 300)
    //ダッシュボードのタイトルを分割する
    splitPageTitle("", "whiteboardTitle")//タイトルの下に階層リンクを表示する
    pageTitleLastPartOnlyControl("", "", "whiteboardTitle") // タイトルに含まれる最後のパートのみを表示するようにコントロールする

    setTimeout(() =>
        checkPageTitleOnBoardObserver(), 300)//ボード上のタイトルを監視する
}


const checkPageTitleOnBoardObserver = () => {
    // ボード上に配置された個別ページのタイトルを分割する

    const observer = new MutationObserver(checkPageTitleOnBoardCallback)

    const targetNode = parent.document.body.querySelector("div#root>div>main div#main-content-container div.whiteboard div.tl-canvas") as Node | null
    if (targetNode)
        observer.observe(targetNode, {
            subtree: true,
            attributes: true,
            childList: true,
        })
}

let whiteboardCheckPageTitleObserverFlag: boolean = false
const checkPageTitleOnBoardCallback = async () => {
    if (whiteboardCheckPageTitleObserverFlag === true)
        return
    whiteboardCheckPageTitleObserverFlag = true
    setTimeout(() => whiteboardCheckPageTitleObserverFlag = false, 3000)

    //aタグ("div.tl-logseq-portal-container[data-page-id]>div.tl-logseq-portal-header-page>div.relative>a.page-ref")が発生するので、ページ名を取得して、それを分割する
    if (parent.document.body.querySelector("div#root>div>main div#main-content-container div.tl-logseq-portal-container:not([checked])")) { //フラグのないものがあった場合
        parent.document.body.querySelectorAll("div#root>div>main div#main-content-container div.tl-logseq-portal-container:not([checked])>div.tl-logseq-portal-header-page>div.relative>a.page-ref").forEach((element) => {
            const pageName = (element as HTMLAnchorElement).innerText as string
            if (pageName.includes("/")) {

                createTitleLinks(pageName, element as HTMLElement, { class: true })

                if (logseq.settings!.booleanRemoveHierarchyPageTitle === true)
                    (element as HTMLElement).innerText = pageName.split('/').pop() as string
            }

        })
        //すべてにフラグをつける
        parent.document.body.querySelectorAll("div#root>div>main div#main-content-container div.tl-logseq-portal-container:not([checked])").forEach((element) => element.setAttribute("checked", "true"))
    }
}

export const splitPageTitleOnBoard = (pageName: string, element: HTMLElement) => {
    if (parent.document.getElementById("hierarchyLinks") !== null)
        return//存在していたら何もしない

    // 「[[」と「]]」が同時に含まれる場合は、ページ名として認識しない
    if (pageName.includes("[[")
        && pageName.includes("]]"))
        return

    createTitleLinks(pageName, element)
}

/**
 * Removes the hierarchy from the page title.
 * @param lastPart - The last part of the page name.
 * @param fullName - The full name of the page.
 * @param querySelector - The query selector to use.
 * @returns void
 */
export const pageTitleLastPartOnlyControl = async (
    lastPart: string,
    fullName: string,
    querySelector: "singlePage" | "whiteboardTitle" | "pageOnBoard",
    element?: HTMLElement
) => {

    // 日誌は除外の個別ページ
    const pageTitleElement = element ?
        element
        : parent.document.body.querySelector(
            querySelector === "singlePage" ?
                "div#root>div>main div#main-content-container div.page:not(.is-journals) div.ls-page-title h1.page-title span.title"
                // ホワイトボード
                : "div#root>div>main div#main-content-container div.whiteboard-page-title>h1.page-title>div.page-title-sizer-wrapper>span.title"
        ) as HTMLDivElement | null

    // 最後の要素
    if (querySelector === "whiteboardTitle"
        || querySelector === "pageOnBoard") { // ホワイトボードの場合は、innerTextを使う
        fullName = pageTitleElement?.innerText as string
        lastPart = pageTitleElement?.innerText.split("/").pop() as string
    }

    if (!pageTitleElement
        || pageTitleElement.innerText === lastPart)
        return
    pageTitleElement.innerText = lastPart

    setTimeout(() => {
        //同じ階層でspan.editingが発生し消えたらpageTitleElementを元に戻す
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations)
                if (mutation.type === "childList")
                    for (const node of mutation.removedNodes)
                        if (node.nodeName === "SPAN") {
                            if (pageTitleElement.innerText === fullName) {
                                pageTitleElement.innerText = lastPart
                                return
                            } else
                                observer.disconnect()//名前が変わっていたら監視を終了
                        }
        })
        const targetNode = pageTitleElement.parentElement
        if (targetNode)
            observer.observe(targetNode, { childList: true })
    }, 300)

}

/**
 * Opens a page in Logseq.
 * @param pageName - The name of the page to open.
 * @param shiftKey - Whether the shift key is pressed.
 * @returns void
 */
const openPageEvent = async (pageName: string, shiftKey: boolean) => {
    const page = await logseq.Editor.getPage(pageName) as { uuid: PageEntity["uuid"] } | null//ページの存在チェックが必要
    if (page) {
        if (shiftKey)
            logseq.Editor.openInRightSidebar(page.uuid)
        else
            logseq.App.replaceState('page', { name: pageName })
    }
}

/**
 * Reverts the hierarchy in the page title once when the settings are changed.
 * @returns void
 */
export const revertOnSettingsChangedHierarchyPageTitleOnce = () => {
    const pageTitleElement = parent.document.body.querySelector("div#root>div>main div#main-content-container h1.page-title span.title") as HTMLDivElement | null
    if (pageTitleElement)
        pageTitleElement.innerText = pageTitleElement.dataset.ref as string
}

/**
 * Removes the hierarchy from the page title once when the settings are changed.
 * @returns void
 */
export const removeOnSettingsChangedHierarchyPageTitleOnce = () => {
    const pageTitleElement = parent.document.body.querySelector("div#root>div>main div#main-content-container h1.page-title span.title") as HTMLDivElement | null
    if (pageTitleElement) {
        const pageTitle = pageTitleElement.innerText
        const pageTitleArr = pageTitle.split("/")
        if (pageTitleArr.length > 1) {
            const lastPart = pageTitleArr.pop() as string
            pageTitleElement.innerText = lastPart
            pageTitleLastPartOnlyControl(lastPart, pageTitle, "singlePage")
        }
    }
}

const createAnchor = (parts: string, part: string, hierarchyLinks: HTMLSpanElement) => {
    const link: HTMLAnchorElement = document.createElement("a")
    link.className = "page-ref"
    link.dataset.checked = "" //" data-checked data-localizeは、querySelector回避用
    link.dataset.localize = ""
    link.dataset.ref = parts
    link.textContent = part
    hierarchyLinks.insertAdjacentElement("beforeend", link)
    link.addEventListener("click", ({ shiftKey }) => {
        if (link.dataset.ref)
            openPageEvent(link.dataset.ref as string, shiftKey)
    })
}

