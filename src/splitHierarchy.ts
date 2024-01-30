import { PageEntity } from "@logseq/libs/dist/LSPlugin.user"

/**
 * Splits the hierarchy of a page name and creates links for each level of the hierarchy.
 * @param pageName - The name of the page to split the hierarchy for.
 * @returns void
 */
export const splitHierarchy = async (pageName: string) => {
    if (parent.document.getElementById("hierarchyLinks") !== null) return//存在していたら何もしない
    //pageNameに「/」が含まれるかチェック済み
    const h1Element = parent.document.body.querySelector("div#root>div>main div#main-content-container h1.page-title") as HTMLHeadElement | null
    if (h1Element === null) return

    // 「[[」と「]]」が同時に含まれる場合は、ページ名として認識しない
    if(pageName.includes("[[") && pageName.includes("]]")) return

    const pageNameArr: string[] = pageName.split('/')
    // pageNameArrの最後の要素
    if (logseq.settings!.booleanRemoveHierarchyPageTitle === true) removeHierarchyPageTitle(pageNameArr.pop() as string, pageName)
    //h1Elementの上にspan#hierarchyLinksを作成
    const hierarchyLinks: HTMLSpanElement = document.createElement("span")
    hierarchyLinks.id = "hierarchyLinks"
    h1Element.insertAdjacentElement("beforebegin", hierarchyLinks)
    let parts: string = ""
    for (const [index, part] of pageNameArr.entries()) {
        if (parts === "") {
            parts = part
        } else
            if (index !== pageNameArr.length) {
                parts += "/" + part
                hierarchyLinks.insertAdjacentText("beforeend", " / ")
            } else {
                return//最後の要素はリンクを作成しない
            }
        const link: HTMLAnchorElement = document.createElement("a")
        link.className = "page-ref"
        link.dataset.checked = ""//" data-checked data-localizeは、querySelector回避用
        link.dataset.localize = ""
        link.dataset.ref = parts
        link.textContent = part
        hierarchyLinks.insertAdjacentElement("beforeend", link)
        link.addEventListener("click", ({ shiftKey }) => {
            if (link.dataset.ref) openPage(link.dataset.ref as string, shiftKey)
        })
    }
}

/**
 * Removes the hierarchy from the page title.
 * @param lastPart - The last part of the page name.
 * @param fullName - The full name of the page.
 * @returns void
 */
export const removeHierarchyPageTitle = async (lastPart: string, fullName: string) => {
    // 日誌は除外
    const pageTitleElement = parent.document.querySelector("body>div#root>div>main div#main-content-container div.page.relative:not(.is-journals) div.ls-page-title h1.page-title span.title") as HTMLDivElement | null
    if (!pageTitleElement
        || pageTitleElement.innerText === lastPart) return
    pageTitleElement.innerText = lastPart

    setTimeout(() => {
        //同じ階層でspan.editingが発生し消えたらpageTitleElementを元に戻す
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeName === "SPAN") {
                            if (pageTitleElement.innerText === fullName) {
                                pageTitleElement.innerText = lastPart
                                return
                            } else {
                                //名前が変わっていたら監視を終了
                                observer.disconnect()
                            }
                        }
                    }
                }
            };
        })
        const targetNode = pageTitleElement.parentElement
        if (targetNode) observer.observe(targetNode, { childList: true })
    }, 300)

}

/**
 * Opens a page in Logseq.
 * @param pageName - The name of the page to open.
 * @param shiftKey - Whether the shift key is pressed.
 * @returns void
 */
const openPage = async (pageName: string, shiftKey: boolean) => {
    const page = await logseq.Editor.getPage(pageName) as PageEntity | null//ページの存在チェックが必要
    if (page) {
        if (shiftKey) {
            logseq.Editor.openInRightSidebar(page.uuid)
        } else {
            logseq.App.replaceState('page', { name: pageName })
        }
    }
}

/**
 * Reverts the hierarchy in the page title once when the settings are changed.
 * @returns void
 */
export const revertOnSettingsChangedHierarchyPageTitleOnce = () => {
    const pageTitleSelector = "div#main-content-container h1.page-title span.title"
    const pageTitleElement = parent.document.querySelector(pageTitleSelector) as HTMLDivElement | null
    if (pageTitleElement) pageTitleElement.innerText = pageTitleElement.dataset.ref as string
}

/**
 * Removes the hierarchy from the page title once when the settings are changed.
 * @returns void
 */
export const removeOnSettingsChangedHierarchyPageTitleOnce = () => {
    const pageTitleSelector = "div#main-content-container h1.page-title span.title"
    const pageTitleElement = parent.document.querySelector(pageTitleSelector) as HTMLDivElement | null
    if (pageTitleElement) {
        const pageTitle = pageTitleElement.innerText
        const pageTitleArr = pageTitle.split("/")
        if (pageTitleArr.length > 1) {
            const lastPart = pageTitleArr.pop() as string
            pageTitleElement.innerText = lastPart
            removeHierarchyPageTitle(lastPart, pageTitle)
        }
    }
}
