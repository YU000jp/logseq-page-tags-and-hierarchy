import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";


export const hierarchyLinksCSS = `
div#main-content-container div.is-journals>div.relative div div.ls-page-title span#hierarchyLinks {
    position: absolute;
    margin-top: -4em;
}
`;


export const splitHierarchy = (pageName: string, must: boolean, repeat: number,) => {
    if (parent.document.getElementById("hierarchyLinks") !== null) return;//存在していたら何もしない
    //pageNameに「/」が含まれるかチェック済み
    if (must !== true && repeat !== undefined && repeat > 30) return;
    const h1Element = parent!.document.querySelector("div#main-content-container h1.page-title") as HTMLHeadElement | null;
    if (h1Element === null) {
        setTimeout(() => {
            splitHierarchy(pageName, false, repeat + 1);
        }, 10);
        return;
    }
    const pageNameArr: string[] = pageName.split('/');
    //h1Elementの上にspan#hierarchyLinksを作成
    const hierarchyLinks: HTMLSpanElement = document.createElement("span");
    hierarchyLinks.id = "hierarchyLinks";
    h1Element.insertAdjacentElement("beforebegin", hierarchyLinks);
    let parts: string = "";
    pageNameArr.forEach((part, index) => {
        if (parts === "") {
            parts += part;
            const link: HTMLAnchorElement = document.createElement("a");
            link.className = "page-ref";
            link.dataset.checked = "";//" data-checked data-localizeは、querySelector回避用
            link.dataset.localize = "";
            link.dataset.ref = parts;
            link.textContent = part;
            hierarchyLinks.insertAdjacentElement("beforeend", link);
            link.addEventListener("click", ({ shiftKey }) => {
                openPage(parts, shiftKey);
            });
        } else if (index !== pageNameArr.length - 1) {
            parts += "/" + part;
            const link: HTMLAnchorElement = document.createElement("a");
            link.className = "page-ref";
            link.dataset.checked = "";//" data-checked data-localizeは、querySelector回避用
            link.dataset.localize = "";
            link.dataset.ref = parts;
            link.textContent = part;
            hierarchyLinks.insertAdjacentText("beforeend", " / ");
            hierarchyLinks.insertAdjacentElement("beforeend", link);
            link.addEventListener("click", ({ shiftKey }) => {
                openPage(parts, shiftKey);
            });
        }
    });
};



async function openPage(pageName: string, shiftKey: boolean) {
    const page = await logseq.Editor.getPage(pageName) as PageEntity | null;//ページの存在チェックが必要
    if (page) {
        if (shiftKey) {
            logseq.Editor.openInRightSidebar(page.uuid);
        } else {
            logseq.App.pushState('page', { name: pageName });
        }
    }
}