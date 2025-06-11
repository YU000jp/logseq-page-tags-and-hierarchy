import { AppInfo } from "@logseq/libs/dist/LSPlugin"
import { replaceLogseqDbGraph, replaceLogseqMdModel, replaceLogseqVersion, setUserSettings } from "."
import { applyModelStyles } from "./css/applyModelStyles"
import { keyBottom, keyHierarchyForFirstLevelOnly, keyHierarchyRemoveBeginningLevel, keyNestingPageAccessory, keyPageAccessory, keyPageAccessoryOrder, keySide, keyUnlinkedReferencesHidden, keyWide, keyWideModeJournalQueries } from "./key"
import { removeProvideStyles } from "./lib"


// MDモデルかどうかのチェック DBモデルはfalse
const checkLogseqVersion = async (): Promise<boolean> => {
    const logseqInfo = (await logseq.App.getInfo("version")) as AppInfo | any
    //  0.11.0もしくは0.11.0-alpha+nightly.20250427のような形式なので、先頭の3つの数値(1桁、2桁、2桁)を正規表現で取得する
    const version = logseqInfo.match(/(\d+)\.(\d+)\.(\d+)/)
    if (version) {
        replaceLogseqVersion(version[0]) //バージョンを更新
        // console.log("logseq version: ", logseqVersion)
        // もし バージョンが0.10.*系やそれ以下ならば、logseqVersionMdをtrueにする
        if (version[0].match(/0\.([0-9]|10)\.\d+/)) {
            // console.log("logseq version is 0.10.* or lower")
            return true
        }
    } else
        replaceLogseqVersion("0.0.0") //バージョンを更新
    return false
}
// DBグラフかどうかのチェック
// DBグラフかどうかのチェック DBグラフだけtrue
const checkLogseqDbGraph = async (): Promise<boolean> => (logseq.App as any).checkCurrentIsDbGraph() as boolean || false // DBグラフかどうかのチェック

const showDbGraphIncompatibilityMsg = () => {
    if (!logseq.settings!.warningMessageShownDbGraph || logseq.settings!.warningMessageShownDbGraph as number >= 3) {
        // 通知3回目以降は表示しない カウント
        logseq.updateSettings({
            warningMessageShownDbGraph: logseq.settings!.warningMessageShownDbGraph ? logseq.settings!.warningMessageShownDbGraph as number + 1 : 1
        })
        logseq.UI.showMsg("The ’Page-tags and Hierarchy’ plugin does not support Logseq DB graph.", "warning", { timeout: 5000 })
    }
    return
}
/**
 * Checks the Logseq model type (Markdown or DB graph) and handles related state and UI updates.
 * @returns Promise<boolean[]> - [isDbGraph, isMdModel]
 */
export const logseqModelCheck = async (): Promise<boolean[]> => {
    const logseqMdModel = await checkLogseqVersion() // Check if it's an MD model
    replaceLogseqMdModel(logseqMdModel)
    const logseqDbGraph = logseqMdModel === true ?
        false
        : await checkLogseqDbGraph() // Check if it's a DB graph
    replaceLogseqDbGraph(logseqDbGraph)
    // Wait for 100ms
    await new Promise(resolve => setTimeout(resolve, 100))

    if (logseqDbGraph === true) {
        // Not supported for DB graph
        showDbGraphIncompatibilityMsg()
    }

    logseq.App.onCurrentGraphChanged(async () => { // Callback when the graph changes

        const logseqDbGraph = await checkLogseqDbGraph()
        if (logseqDbGraph === true) {
            // Not supported for DB graph
            showDbGraphIncompatibilityMsg()

            // Remove unused <style> elements
            removeProvideStyles([
                keyBottom,
                keySide,
                keyWide,
                keyPageAccessoryOrder,
                keyNestingPageAccessory,
                keyWideModeJournalQueries,
                keyUnlinkedReferencesHidden,
                keyPageAccessory,
                keyHierarchyForFirstLevelOnly,
                keyHierarchyRemoveBeginningLevel
            ])

        } else {
            applyModelStyles() // Set styles according to the model
        }
        /* user settings */
        setUserSettings(logseqDbGraph, logseqMdModel, logseq.settings!.placeSelect as string)
    })
    return [logseqDbGraph, logseqMdModel] // Return [isDbGraph, isMdModel]
}
