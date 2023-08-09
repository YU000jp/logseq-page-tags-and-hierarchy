import { TocBlock } from "./toc";

export function removeMarkdownLink(blockContent: string) {
  if (blockContent.includes("[[")) {
    blockContent = blockContent.replaceAll(/\[\[/g, "");
  }
  if (blockContent.includes("]]")) {
    blockContent = blockContent.replaceAll(/\]\]/g, "");
  }
  return blockContent;
}
export function removeMarkdownAliasLink(blockContent: string) {
  //マークダウン形式の[タイトル](リンク名)の場合、正規表現で[と]と(リンク名)を取り除く
  if (blockContent.includes("[")) {
    blockContent = blockContent.replaceAll(/\[([^\]]+)\]\(([^\)]+)\)/g, "$1");
  }
  return blockContent;
}
export function replaceOverCharacters(blockContent: string) {
  if (blockContent.length > 140) {
    blockContent = blockContent.substring(0, 140) + "...";
  }
  return blockContent;
}
export function removeMarkdownImage(blockContent: string) {
  if (blockContent.includes("![")) {
    blockContent = blockContent.replaceAll(/!\[[^\]]+\]\([^\)]+\)/g, "");
  }
  return blockContent;
}
export async function removeProperties(tocBlocks: TocBlock[], i: number, blockContent: string): Promise<string> {
  const properties = tocBlocks[i].properties;
  if (!properties) return blockContent;
  const keys = Object.keys(properties);
  for (let j = 0; j < keys.length; j++) {
    let key = keys[j];
    const values = properties[key];
    //backgroundColorをbackground-colorにする
    //キーの途中で一文字大文字になっている場合は小文字にしてその前にハイフンを追加する
    key = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    blockContent = blockContent.replace(`${key}:: ${values}`, "");
    blockContent = blockContent.replace(`${key}::`, "");
  }
  return blockContent;
}
