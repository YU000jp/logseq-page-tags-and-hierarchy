import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";

export const splitHierarchy = (pageName: string, must: boolean, repeat: number,) => {
    if (parent.document.getElementById("hierarchyLinks") !== null) return;//存在していたら何もしない
    //pageNameに「/」が含まれるかチェック済み
    if (must !== true && repeat !== undefined && repeat > 10) return;
    const h1Element = parent.document.querySelector("div#main-content-container h1.page-title") as HTMLHeadElement | null;
    if (h1Element === null) {
        setTimeout(() => splitHierarchy(pageName, false, repeat + 1), 40);
        return;
    }
    const pageNameArr: string[] = pageName.split('/');
    //h1Elementの上にspan#hierarchyLinksを作成
    const hierarchyLinks: HTMLSpanElement = parent.document.createElement("span");
    hierarchyLinks.id = "hierarchyLinks";
    h1Element.insertAdjacentElement("beforebegin", hierarchyLinks);
    let parts: string = "";
    let lastPart: string = "";
    pageNameArr.forEach((part, index) => {
        if (parts === "") {
            parts = part;
        } else if (index !== pageNameArr.length - 1) {
            parts += "/" + part;
            hierarchyLinks.insertAdjacentText("beforeend", " / ");
        } else {
            lastPart = part;
            return;//最後の要素はリンクを作成しない
        }
        const link: HTMLAnchorElement = parent.document.createElement("a");
        link.className = "page-ref";
        link.dataset.checked = "";//" data-checked data-localizeは、querySelector回避用
        link.dataset.localize = "";
        link.dataset.ref = parts;
        link.textContent = part;
        hierarchyLinks.insertAdjacentElement("beforeend", link);
        link.addEventListener("click", ({ shiftKey }) => {
            if (link.dataset.ref) openPage(link.dataset.ref as string, shiftKey);
        });
    });
    if (logseq.settings!.booleanRemoveHierarchyPageTitle === true) removeHierarchyPageTitle(lastPart);
};

export const removeHierarchyPageTitle = (lastPart: string) => {
    if (parent.document.querySelector("div.is-journals") as HTMLDivElement | null) return;
    const pageTitleSelector = "div#main-content-container h1.page-title span.title";
    const pageTitleElement = parent.document.querySelector(pageTitleSelector) as HTMLDivElement | null;
    if (pageTitleElement) {
        pageTitleElement.innerText = lastPart;
        //同じ階層でspan.editingが発生し消えたらpageTitleElementを元に戻す
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeName === "SPAN") {
                            pageTitleElement.innerText = lastPart;
                            return;
                        }
                    }
                }
            };
        });
        const targetNode = pageTitleElement.parentElement;
        if (targetNode) observer.observe(targetNode, { childList: true });
    }
};

const openPage = async (pageName: string, shiftKey: boolean) => {
    const page = await logseq.Editor.getPage(pageName) as PageEntity | null;//ページの存在チェックが必要
    if (page) {
        if (shiftKey) {
            logseq.Editor.openInRightSidebar(page.uuid);
        } else {
            logseq.App.replaceState('page', { name: pageName });
        }
    }
};
export const onSettingsChangedRevertHierarchyPageTitleOnce = () => {
    const pageTitleSelector = "div#main-content-container h1.page-title span.title";
    const pageTitleElement = parent.document.querySelector(pageTitleSelector) as HTMLDivElement | null;
    if (pageTitleElement) pageTitleElement.innerText = pageTitleElement.dataset.ref as string;
};
export const onSettingsChangedRemoveHierarchyPageTitleOnce = () => {
    const pageTitleSelector = "div#main-content-container h1.page-title span.title";
    const pageTitleElement = parent.document.querySelector(pageTitleSelector) as HTMLDivElement | null;
    if (pageTitleElement) {
        const pageTitle = pageTitleElement.innerText;
        const pageTitleArr = pageTitle.split("/");
        if (pageTitleArr.length > 1) {
            const lastPart = pageTitleArr.pop() as string;
            pageTitleElement.innerText = lastPart;
            removeHierarchyPageTitle(lastPart);
        }
    }
};
