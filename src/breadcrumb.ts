import { PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { booleanDbGraph, booleanLogseqMdModel } from "."

/**
 * Splits and processes a Logseq page title, inserting breadcrumb links into the DOM if appropriate.
 *
 * This function checks for the existence of a hierarchy links element, locates the page title element
 * based on the context (single page or whiteboard), and creates clickable breadcrumb links for hierarchical
 * page names. It avoids processing if the page name contains both "[[" and "]]", which indicates a non-standard title.
 *
 * @param logseqDbGraph - Indicates if the Logseq database graph model is used.
 * @param logseqMdModel - Indicates if the Logseq Markdown model is used.
 * @param pageName - The name of the current page to process.
 * @param querySelectorString - Determines the selector context: "singlePage" for regular pages or "whiteboardTitle" for whiteboard pages.
 */
export const splitPageTitle = (logseqDbGraph: boolean, logseqMdModel: boolean, pageName: string, querySelectorString: "singlePage" | "whiteboardTitle") => {
    // console.log("splitPageTitle", pageName, querySelectorString)

    if (parent.document.getElementById("hierarchyLinks") !== null)
        return//存在していたら何もしない
    //pageNameに「/」が含まれるかチェック済み
    const h1Element = parent.document.querySelector(
        querySelectorString === "singlePage" ?
            `${logseqMdModel === true ? "body[data-page='page']" : "body[data-page]"} #main-content-container h1.page-title` //ページ
            : "#main-content-container div.whiteboard-page-title>h1.page-title" //ホワイトボードのタイトル
    ) as HTMLElement | null
    // console.log("h1Element", h1Element) 
    if (h1Element === null)
        return

    // ページ名を取得 (ホワイトボードの場合は、innerTextを使う)
    if (querySelectorString === "whiteboardTitle")
        pageName = (h1Element.querySelector("div.page-title-sizer-wrapper>span.title") as HTMLElement).innerText

    // 「[[」と「]]」が同時に含まれる場合は、ページ名として認識しない
    if (pageName.includes("[[")
        && pageName.includes("]]"))
        return

    createTitleLinks(logseqDbGraph, logseqMdModel, pageName, h1Element)
}

/**
 * Creates breadcrumb-style links for a hierarchical page title and inserts them above the given h1 element.
 * 
 * This function splits the provided `pageName` by slashes (`/`) to determine hierarchy levels,
 * optionally modifies the page title based on settings, and generates clickable anchor elements
 * for each hierarchy part except the last one. The links are inserted into a span element
 * placed before the specified `h1Element`.
 * 
 * @param pageName - The hierarchical name of the page, with levels separated by slashes.
 * @param h1Element - The HTML heading element above which the breadcrumb links will be inserted.
 * @param flag - Optional configuration object:
 *   - `class`: If true, assigns the class "hierarchyLinks" to the span; otherwise, sets its id to "hierarchyLinks".
 */
const createTitleLinks = (logseqDbGraph: boolean, logseqMdModel: boolean, pageName: string, h1Element: HTMLElement, flag?: { class?: boolean }) => {
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
export const WhiteboardCallback = (logseqDbGraph: boolean, logseqMdModel: boolean) => {
    if (processingWhiteboard === true)
        return
    processingWhiteboard = true
    setTimeout(() =>
        processingWhiteboard = false, 300)
    //ダッシュボードのタイトルを分割する
    splitPageTitle(logseqDbGraph, logseqMdModel, "", "whiteboardTitle")//タイトルの下に階層リンクを表示する
    pageTitleLastPartOnlyControl("", "", "whiteboardTitle") // タイトルに含まれる最後のパートのみを表示するようにコントロールする

    setTimeout(() =>
        checkPageTitleOnBoardObserver(), 300)//ボード上のタイトルを監視する
}


const checkPageTitleOnBoardObserver = () => {
    // ボード上に配置された個別ページのタイトルを分割する

    const observer = new MutationObserver(checkPageTitleOnBoardCallback)

    const targetNode = parent.document.body.querySelector("#main-content-container div.whiteboard div.tl-canvas") as Node | null
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

    //aタグ("#main-content-container div.tl-logseq-portal-container[data-page-id]>div.tl-logseq-portal-header-page>div.relative>a.page-ref")が発生するので、ページ名を取得して、それを分割する
    if (parent.document.body.querySelector("#main-content-container div.tl-logseq-portal-container:not([checked])")) { //フラグのないものがあった場合
        parent.document.body.querySelectorAll("#main-content-container div.tl-logseq-portal-container:not([checked])>div.tl-logseq-portal-header-page>div.relative>a.page-ref").forEach((element) => {
            const pageName = (element as HTMLAnchorElement).innerText as string
            if (pageName.includes("/")) {

                createTitleLinks(booleanDbGraph(), booleanLogseqMdModel(), pageName, element as HTMLElement, { class: true })

                if (logseq.settings!.booleanRemoveHierarchyPageTitle === true)
                    (element as HTMLElement).innerText = pageName.split('/').pop() as string
            }

        })
        //すべてにフラグをつける
        parent.document.body.querySelectorAll("#main-content-container div.tl-logseq-portal-container:not([checked])").forEach((element) => element.setAttribute("checked", "true"))
    }
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
    const logseqMdModel = booleanLogseqMdModel()

    // 共通でpageTitleElementを取得する関数
    const getPageTitleElement = (): HTMLDivElement | null => {
        if (element) return element as HTMLDivElement
        return parent.document.body.querySelector(
            querySelector === "singlePage"
                ? "#main-content-container div.page:not(.is-journals) h1.page-title span.title"
                : "#main-content-container div.whiteboard-page-title>h1.page-title>div.page-title-sizer-wrapper>span.title"
        ) as HTMLDivElement | null
    }

    let pageTitleElement = getPageTitleElement()

    // ホワイトボードの場合は、innerTextから取得
    if (querySelector === "whiteboardTitle" || querySelector === "pageOnBoard") {
        if (pageTitleElement) {
            fullName = pageTitleElement.innerText
            lastPart = pageTitleElement.innerText.split("/").pop() as string
        }
    }

    if (!pageTitleElement || pageTitleElement.innerText === lastPart)
        return

    pageTitleElement.innerText = lastPart

    setTimeout(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations)
                if (mutation.type === "childList")
                    for (const node of mutation.removedNodes) {
                        if (logseqMdModel == true) {
                            // MD model

                            // span.editingが消えたら元に戻す
                            if (node.nodeName === "SPAN") {
                                const currentTitleElement = getPageTitleElement()
                                if (currentTitleElement && currentTitleElement.innerText === fullName) {
                                    currentTitleElement.innerText = lastPart
                                    return
                                } else
                                    observer.disconnect()
                            }
                        } else {
                            // DB model

                            // input.editingが消えたら元に戻す
                            if (node.nodeName === "INPUT") {
                                setTimeout(() => {
                                    const currentTitleElement = getPageTitleElement()
                                    if (!currentTitleElement) {
                                        observer.disconnect()
                                        return
                                    }
                                    if (currentTitleElement.innerText === fullName) {
                                        currentTitleElement.innerText = lastPart
                                        return
                                    }
                                }, 100)
                            }
                        }
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
    const pageEntity = await logseq.Editor.getPage(pageName) as { uuid: PageEntity["uuid"] } | null//ページの存在チェックが必要
    if (pageEntity) {
        if (shiftKey)
            logseq.Editor.openInRightSidebar(pageEntity.uuid)
        else
            logseq.App.replaceState('page', { name: pageName })
    }
}

/**
 * Reverts the hierarchy in the page title once when the settings are changed.
 * @returns void
 */
export const revertOnSettingsChangedHierarchyPageTitleOnce = () => {
    const pageTitleElement = parent.document.body.querySelector("#main-content-container h1.page-title span.title") as HTMLDivElement | null
    if (pageTitleElement)
        pageTitleElement.innerText = pageTitleElement.dataset.ref as string
}

/**
 * Removes the hierarchy from the page title once when the settings are changed.
 * @returns void
 */
export const removeOnSettingsChangedHierarchyPageTitleOnce = () => {
    const pageTitleElement = parent.document.body.querySelector("#main-content-container h1.page-title span.title") as HTMLDivElement | null
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
export const removeBreadCrumb = () => {
    const element = parent.document.getElementById("hierarchyLinks") as HTMLSpanElement | null
    if (element) element.remove()
}

