import { booleanLogseqMdModel } from ".."
import {
    fileBottom,
    fileNestingPageAccessory,
    fileSide,
    fileWide,
    fileWideModeJournalQueries,
    CSSUnlinkedHidden,
    fileCSSMain,
    CSSpageSubOrder,
} from "./styles"
import { keyBottom, keyDbBreadcrumb, keyNestingPageAccessory, keyPageAccessoryOrder, keySide, keyUnlinkedReferencesHidden, keyWide, keyWideModeJournalQueries } from "../key"
import { provideStyle, removeProvideStyle } from "../lib"

// モデルに合わせて適用するスタイルを選択
export const applyModelStyles = () => {
    if (booleanLogseqMdModel() === true) {
        setStylesForFileBasedModel() //スタイルを設定
        removeProvideStyle(keyDbBreadcrumb)
    } else {
        logseq.provideStyle({
            key: keyDbBreadcrumb,
            style: `
            #main-content-container #hierarchyLinks {
                position: absolute;
                top: -1.7em;
            }
            `
        })
    }
}
export function setStylesForFileBasedModel() {
    //設定項目 > ModifyHierarchyList
    if (logseq.settings!.booleanModifyHierarchy === true)
        provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)

    //設定項目 > Unlinked Referencesを表示しない
    if (logseq.settings!.booleanUnlinkedReferences === true)
        logseq.provideStyle({
            key: keyUnlinkedReferencesHidden,
            style: CSSUnlinkedHidden
        })
    //設定項目 > Journal Queriesを表示するかどうか
    //wide viewモード以外も。
    if (logseq.settings!.booleanWideModeJournalQueries === true)
        logseq.provideStyle({
            key: keyWideModeJournalQueries,
            style: fileWideModeJournalQueries
        })

    //CSS minify https://csscompressor.com/
    switch (logseq.settings!.placeSelect) {
        case "unset":
            break
        case "bottom":
            logseq.provideStyle({
                key: keyBottom,
                style: fileBottom
            })
            break
        case "side":
            logseq.provideStyle({
                key: keySide,
                style: fileSide
            })
            break
        case "wide view":
            logseq.provideStyle({
                key: keyWide,
                style: fileWide
            })
            logseq.provideStyle({
                key: keyPageAccessoryOrder,
                style: CSSpageSubOrder(logseq.settings)
            })

            break
    }

    // ページ名の階層を分割する を含む
    logseq.provideStyle(fileCSSMain)
}