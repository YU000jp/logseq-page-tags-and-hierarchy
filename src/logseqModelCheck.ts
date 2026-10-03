import { replaceAppDbEra, replaceLogseqDbGraph, replaceLogseqMdModel, replaceLogseqVersion, setUserSettings } from "."
import { applyModelStyles } from "./css/applyModelStyles"
import { keyBottom, keyHierarchyForFirstLevelOnly, keyHierarchyRemoveBeginningLevel, keyNestingPageAccessory, keyPageAccessory, keyPageAccessoryOrder, keySide, keyUnlinkedReferencesHidden, keyWide, keyWideModeJournalQueries } from "./key"
import { removeProvideStyles } from "./lib"

// Fetch the app version and store it (informational only; never used for graph-type detection).
// Also derives the app era (new UI = DB-era app: 0.11.x or 2.x) for DOM/UI-dependent code.
const fetchAppVersion = async (): Promise<void> => {
    const logseqInfo = (await logseq.App.getInfo("version")) as unknown
    // The version format is like "0.11.0" or "0.11.0-alpha+nightly.20250427".
    const version = typeof logseqInfo === "string" ? logseqInfo : "0.0.0"
    const match = version.match(/(\d+)\.(\d+)\.(\d+)/)
    replaceLogseqVersion(match ? match[0] : version)
    // DB-era apps report 0.11+ or 2.x. Legacy file-based apps are 0.0.x - 0.10.x, and Logseq OG is 1.x.
    replaceAppDbEra(match ? (Number(match[1]) >= 2 || (Number(match[1]) === 0 && Number(match[2]) >= 11)) : false)
}

// Check if the current graph is a DB graph. Returns true only for DB graphs.
// The official API does not exist on 0.10.x hosts (logseq.App is a dynamic proxy, so a typeof
// guard is useless): a rejected call or a non-boolean value means the host is a legacy app
// that cannot open DB graphs.
const checkLogseqDbGraph = async (): Promise<boolean> => {
    try {
        const value = await (logseq.App as any).checkCurrentIsDbGraph()
        return typeof value === "boolean" ? value : false
    } catch {
        return false
    }
}

// Show a warning message if the graph is a DB graph (shown only once).
const showDbGraphIncompatibilityMsg = () => {
    if (!logseq.settings!.warningMessageShownDbGraph) {
        logseq.updateSettings({
            warningMessageShownDbGraph: true
        })
        logseq.UI.showMsg("The ’Page-tags and Hierarchy’ plugin does not support Logseq DB graph.", "warning", { timeout: 5000 })
    }
    return
}

/**
 * Checks whether the current graph is a DB graph or a file-based graph, and handles related state and UI updates.
 * @returns Promise<boolean[]> - [isDbGraph, isFileGraph]
 */
export const logseqModelCheck = async (): Promise<boolean[]> => {
    await fetchAppVersion() // アプリバージョンと世代を保存(情報用。グラフ種別には使わない)
    const logseqDbGraph = await checkLogseqDbGraph() // 現在のグラフがDBグラフか
    const logseqMdModel = !logseqDbGraph // 現在のグラフがファイルベースか(= !isDbGraph)
    replaceLogseqDbGraph(logseqDbGraph)
    replaceLogseqMdModel(logseqMdModel)
    // Wait for 100ms
    await new Promise(resolve => setTimeout(resolve, 100))

    if (logseqDbGraph === true) {
        // Not supported for DB graph
        showDbGraphIncompatibilityMsg()
    }

    logseq.App.onCurrentGraphChanged(async () => { // Callback when the graph changes

        const isDbGraph = await checkLogseqDbGraph()
        const isFileGraph = !isDbGraph
        // グラフ切替後はグローバルフラグを更新する
        replaceLogseqDbGraph(isDbGraph)
        replaceLogseqMdModel(isFileGraph)

        if (isDbGraph === true) {
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
        /* Update user settings */
        setUserSettings(isDbGraph, isFileGraph, logseq.settings!.placeSelect as string)
    })
    return [logseqDbGraph, logseqMdModel] // Return [isDbGraph, isFileGraph]
}
