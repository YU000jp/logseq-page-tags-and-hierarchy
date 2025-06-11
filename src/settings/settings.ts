import { SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user"
import { hierarchySettings } from "./hierarchySettings"
import { pageContentHierarchySettings } from "./pageContentHierarchySettings"
import { uiLayoutSettings } from "./uiLayoutSettings"
import { wideViewSettings } from "./wideViewSettings"

export const settingsTemplate = (logseqDbGraph: boolean, logseqMdModel: boolean, enabledWideView: boolean): SettingSchemaDesc[] => {
    // LogseqDbGraphがtrueのときは、DBグラフモードであることを警告する設定を追加
    if (logseqDbGraph)
        return [logseqDbGraphWarningSetting()] // DBグラフモードのときは、警告を表示する (機能動作なし・設定項目なし)
    else
        return [
            ...(logseqMdModel === false ? [logseqMdModelWarningSetting()] : []), // DBモデルかつfile-basedグラフのときは警告を表示
            ...hierarchySettings(logseqDbGraph, logseqMdModel), // 階層設定は、LogseqDbGraphがfalseのときのみ有効
            ...(logseqMdModel ? pageContentHierarchySettings() : []), // ページコンテンツの階層設定は、LogseqMdModelがtrueのときのみ有効
            ...(logseqMdModel ? uiLayoutSettings() : []), // UIレイアウト設定は、LogseqMdModelがtrueのときのみ有効
            ...(logseqMdModel && enabledWideView ? wideViewSettings() : []), // Wide View設定は、LogseqMdModelがtrueかつWide Viewが有効なときのみ有効
        ]
}


// LogseqDbGraphのときは何も機能しない。それをユーザーに知らせるための設定を追加する
export const logseqDbGraphWarningSetting = (): SettingSchemaDesc => ({
    key: "warningLogseqModelOrDbGraph",
    type: "heading",
    default: "",
    title: "⚠️Logseq DB Graph Mode",
    description: "Note: This plugin does not support Logseq DB Graph mode.",
})

// LogseqMdModel===falseのとき。file-basedグラフのみ、機能が使用できる。ただし、DBモデルの場合は、一部機能が利用できない。それをユーザーに知らせるための設定を追加する
export const logseqMdModelWarningSetting = (): SettingSchemaDesc => ({
    key: "warningLogseqModelOrDbGraph",
    type: "heading",
    default: "",
    title: "⚠️Logseq File-based Graph Mode (DB Model)",
    description: "Note: This plugin is designed for Logseq file-based Graph mode or Logseq file-based model. Some features may not work in Logseq DB model.",
})
