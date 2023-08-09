import removeMd from "remove-markdown";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { checkOnBlockChanged, onBlockChanged } from ".";
import { removeProperties, removeMarkdownLink, removeMarkdownAliasLink, replaceOverCharacters, removeMarkdownImage } from "./markdown";

export const displayToc = async (pageName: string) => {
  if (logseq.settings!.placeSelect !== "wide view") return;
  const pageBlocks = await logseq.Editor.getPageBlocksTree(pageName) as BlockEntity[];
  const headers = getTocBlocks(pageBlocks as Child[]);
  if (headers.length > 0) {
    //Headerが存在する場合のみ
    const element = parent.document.getElementById("tocInPage") as HTMLDivElement | null;
    if (element) element.innerHTML = "";//elementが存在する場合は中身を削除する
    else await insertElement();//elementが存在しない場合は作成する
    await headersList(parent.document.getElementById("tocInPage") as HTMLDivElement, headers, pageName);
    //toc更新用のイベントを登録する
    if (checkOnBlockChanged === false) onBlockChanged();
    //タイトルでcollapsedする処理
    tocContentTitleCollapsed(pageName);
  }
};

function tocContentTitleCollapsed(PageName: string) {
  const titleElement = parent.document.getElementById("tocContentTitle") as HTMLDivElement | null;
  if (!titleElement || titleElement.dataset.PageName === PageName) return;
  titleElement.dataset.pageName = PageName;
  titleElement.onclick = async () => {
    const elementTocInPage = parent.document.getElementById("tocInPage") as HTMLDivElement | null;
    if (!elementTocInPage) return;
    if (elementTocInPage.parentElement?.classList.contains("initial")) {
      //elementTocInPageの親要素のclassをhiddenにする
      elementTocInPage.parentElement!.classList.remove("initial");
      elementTocInPage.parentElement!.classList.add("hidden");
    } else {
      //elementTocInPageの親要素のclassをinitialにする
      elementTocInPage.parentElement!.classList.remove("hidden");
      elementTocInPage.parentElement!.classList.add("initial");
    }
  };
}

async function insertElement(): Promise<void> {
  //コンテンツに目次が存在する場合のみ処理を行う
  const elementPageRelative = parent.document.querySelector("div#main-content-container div.page.relative") as HTMLDivElement | null;
  if (!elementPageRelative || elementPageRelative.querySelector("div.th-toc") !== null) return;
  //div elementを作成する
  const tocDiv: HTMLDivElement = document.createElement("div");
  tocDiv.classList.add("th-toc");
  tocDiv.classList.add("mt-6");
  //div elementに内容を追加する
  tocDiv.innerHTML = `
    <div class="flex flex-col">
    <div class="content">
    <div id="tocContentTitle" class="flex-1 flex-row foldable-title cursor">
    <div class="flex flex-row items-center">
    <h2 class="font-medium">Table of Contents</h2>
    </div></div>
    </div>
    <div class="${logseq.settings!.booleanTableOfContentsHide === true ? "hidden" : "initial"}">
    <div id="tocInPage" class="my-2 color-level px-2 py-2 rounded ls-block"></div>
    </div>
    </div>
    `;
  //div elementを挿入する
  elementPageRelative.append(tocDiv);
}


export interface TocBlock {
  content: string;
  uuid: string;
  properties?: { [key: string]: string[] };
}

interface Child {
  content: string;
  uuid: string;
  properties?: { [key: string]: string[] };
  children?: Child[];
}

const getTocBlocks = (childrenArr: Child[]): TocBlock[] => {
  let tocBlocks: TocBlock[] = []; // Empty array to push filtered strings to

  // Recursive function to map all headers in a linear array
  const findAllHeaders = (childrenArr: Child[]) => {
    if (!childrenArr) return;
    for (let a = 0; a < childrenArr.length; a++) {
      if (
        childrenArr[a].content.startsWith("# ")
        || childrenArr[a].content.startsWith("## ")
        || childrenArr[a].content.startsWith("### ")
        || childrenArr[a].content.startsWith("#### ")
        || childrenArr[a].content.startsWith("##### ")
        || childrenArr[a].content.startsWith("###### ")
        || childrenArr[a].content.startsWith("####### ")
      ) {
        tocBlocks.push({
          content: childrenArr[a].content,
          uuid: childrenArr[a].uuid,
          properties: childrenArr[a].properties,
        });
      }
      if (childrenArr[a].children) {
        findAllHeaders(childrenArr[a].children as Child[]);
      } else {
        return;
      }
    }
  };

  findAllHeaders(childrenArr);
  return tocBlocks;
};

const headersList = async (targetElement: HTMLElement, tocBlocks: TocBlock[], thisPageName: string): Promise<void> => {

  // To top
  const elementTop = document.createElement("div");
  elementTop.classList.add("cursor");
  elementTop.innerHTML = "To top ⬆️";
  elementTop.style.padding = "1em";
  targetElement.append(elementTop);
  elementTop.addEventListener('click', () => parent.document.querySelector("div#main-content-container h1.page-title")!.scrollIntoView({ behavior: 'smooth' }));

  // Create list
  for (let i = 0; i < tocBlocks.length; i++) {
    let blockContent: string = tocBlocks[i].content;
    if (blockContent.includes("((") && blockContent.includes("))")) {
      // Get content if it's q block reference
      const rxGetId = /\(([^(())]+)\)/;
      const blockId = rxGetId.exec(blockContent);
      if (!blockId) continue;
      const block = await logseq.Editor.getBlock(blockId[1], {
        includeChildren: true,
      });
      if (!block) continue;
      blockContent = blockContent.replace(
        `((${blockId[1]}))`,
        block.content.substring(0, block.content.indexOf("id::"))
      );
    }

    //プロパティを取り除く
    blockContent = await removeProperties(tocBlocks, i, blockContent);


    if (blockContent.includes("id:: ")) {
      blockContent = blockContent.substring(0, blockContent.indexOf("id:: "));
    }

    //文字列のどこかで「[[」と「]]」で囲まれているもいのがある場合は、[[と]]を削除する
    blockContent = removeMarkdownLink(blockContent);
    //文字列のどこかで[]()形式のリンクがある場合は、[と]を削除する
    blockContent = removeMarkdownAliasLink(blockContent);
    //文字数が200文字を超える場合は、200文字以降を「...」に置き換える
    blockContent = replaceOverCharacters(blockContent);
    //マークダウンの画像記法を全体削除する
    blockContent = removeMarkdownImage(blockContent);

    // Header
    if (blockContent.startsWith("# ")
      || blockContent.startsWith("## ")
      || blockContent.startsWith("### ")
      || blockContent.startsWith("#### ")
      || blockContent.startsWith("##### ")
      || blockContent.startsWith("###### ")
      || blockContent.startsWith("####### ")) {
      const element: HTMLDivElement =
        (blockContent.startsWith("# ")) ? document.createElement("h1") :
          (blockContent.startsWith("## ")) ? document.createElement("h2") :
            (blockContent.startsWith("### ")) ? document.createElement("h3") :
              (blockContent.startsWith("#### ")) ? document.createElement("h4") :
                (blockContent.startsWith("##### ")) ? document.createElement("h5") :
                  document.createElement("h6");
      element.classList.add("cursor");
      element.innerHTML = removeMd(`${(blockContent.includes("collapsed:: true") &&
        blockContent.substring(2, blockContent.length - 16)) ||
        blockContent.substring(2)}`);
      setTimeout(() => {
        element.addEventListener('click', ({ shiftKey }) => selectBlock(shiftKey, thisPageName, tocBlocks[i].uuid));
      }, 800);
      targetElement.append(element);
    }
  }
};

async function selectBlock(shiftKey: boolean, pageName: string, blockUuid: string) {
  if (shiftKey) {
    logseq.Editor.openInRightSidebar(blockUuid);
  } else {
    //https://github.com/freder/logseq-plugin-jump-to-block/blob/master/src/components/App.tsx#L39
    const elem = parent.document.getElementById('block-content-' + blockUuid) as HTMLDivElement | null;
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => logseq.Editor.selectBlock(blockUuid), 50);
    } else {
      //親ブロックがcollapsedの場合
      await parentBlockToggleCollapsed(blockUuid);
    }
  }
}

async function parentBlockToggleCollapsed(blockUuidOrId): Promise<void> {
  const block = await logseq.Editor.getBlock(blockUuidOrId) as BlockEntity | null;
  if (!block) return;
  const parentBlock = await logseq.Editor.getBlock(block.parent.id) as BlockEntity | null;
  if (!parentBlock) return;
  await logseq.Editor.setBlockCollapsed(parentBlock.uuid, false);
  const element = parent.document.getElementById('block-content-' + block.uuid) as HTMLDivElement | null;
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => logseq.Editor.selectBlock(block.uuid), 50);
  } else {
    //さらに親ブロックがcollapsedの場合
    if (parentBlock.parent) {
      const parentParentBlock = await logseq.Editor.getBlock(parentBlock.parent.id);
      if (parentParentBlock) {
        await logseq.Editor.setBlockCollapsed(parentParentBlock.uuid, false);
        const element = parent.document.getElementById('block-content-' + parentParentBlock.uuid) as HTMLDivElement | null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => logseq.Editor.selectBlock(block.uuid), 50);
        } else {
          //さらに親ブロックがcollapsedの場合
          if (parentParentBlock.parent) {
            const parentParentParentBlock = await logseq.Editor.getBlock(parentParentBlock.parent.id);
            if (parentParentParentBlock) {
              await logseq.Editor.setBlockCollapsed(parentParentParentBlock.uuid, false);
              const element = parent.document.getElementById('block-content-' + parentParentParentBlock.uuid) as HTMLDivElement | null;
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => logseq.Editor.selectBlock(block.uuid), 50);
              } else {
                //さらに親ブロックがcollapsedの場合
                if (parentParentParentBlock.parent) {
                  const parentParentParentParentBlock = await logseq.Editor.getBlock(parentParentParentBlock.parent.id);
                  if (parentParentParentParentBlock) {
                    await logseq.Editor.setBlockCollapsed(parentParentParentParentBlock.uuid, false);
                    const element = parent.document.getElementById('block-content-' + parentParentParentParentBlock.uuid) as HTMLDivElement | null;
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => logseq.Editor.selectBlock(block.uuid), 50);
                    } else {
                      //さらに親ブロックがcollapsedの場合
                      //処理しない
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
export const CSSpageSupportContentPosition = (settings) => `
div#root div.page.relative>div.lazy-visibility:has(div.scheduled-or-deadlines){order:${settings.enumScheduleDeadline}}
div#root div.page.relative>div.th-toc{order:${settings.enumTableOfContents}}
div#root div.page.relative>div:has(div.page-linked){order:${settings.enumLinkedReferences}}
div#root div.page.relative>div:has(div.page-unlinked){order:${settings.enumUnlinkedReferences}}
div#root div.page.relative>div.page-hierarchy{order:${settings.enumPageHierarchy}}
div#root div.page.relative>div.page-tags{order:${settings.enumPageTags}}
`;

