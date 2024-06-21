import { TocBlock } from "./toc"

export const removeMarkdownLink = (blockContent: string) => {
  if (blockContent.includes("[["))
    blockContent = blockContent.replaceAll(/\[\[/g, "")
  if (blockContent.includes("]]"))
    blockContent = blockContent.replaceAll(/\]\]/g, "")
  return blockContent
}
export const removeMarkdownAliasLink = (blockContent: string) => {
  if (blockContent.includes("["))
    blockContent = blockContent.replaceAll(/\[([^\]]+)\]\(([^\)]+)\)/g, "$1")
  return blockContent
}
export const replaceOverCharacters = (blockContent: string) => {
  if (blockContent.length > 140)
    blockContent = blockContent.substring(0, 140) + "..."
  return blockContent
}
export const removeMarkdownImage = (blockContent: string) => {
  if (blockContent.includes("!["))
    blockContent = blockContent.replaceAll(/!\[[^\]]+\]\([^\)]+\)/g, "")
  return blockContent
}
export const removeProperties = async (tocBlocks: TocBlock[], i: number, blockContent: string): Promise<string> => {
  const properties = tocBlocks[i].properties
  if (!properties) return blockContent
  const keys = Object.keys(properties)
  for (let j = 0; j < keys.length; j++) {
    let key = keys[j]
    const values = properties[key]
    key = key.replace(/([A-Z])/g, "-$1").toLowerCase()
    blockContent = blockContent.replace(`${key}:: ${values}`, "")
    blockContent = blockContent.replace(`${key}::`, "")
  }
  return blockContent
}

export const removeListWords = (blockContent: string): string => {
  const list = (logseq.settings!.tocRemoveWordList as string).split("\n")
  for (let i = 0; i < list.length; i++) {
    if (list[i] === "") continue
    blockContent = blockContent.replaceAll(new RegExp(list[i], "g"), "")
  }
  return blockContent
}
