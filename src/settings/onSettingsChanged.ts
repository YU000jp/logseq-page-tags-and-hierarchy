import { LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin"
import { displayToc, onBlockChanged, setUserSettings } from "../"
import { keyBottom, keyHierarchyForFirstLevelOnly, keyNestingPageAccessory, keyPageAccessory, keyPageAccessoryOrder, keySide, keyUnlinkedReferencesHidden, keyWide, keyWideModeJournalQueries } from "../key"
import {
             fileBottom,
             fileNestingPageAccessory,
             fileSide,
             fileWide,
             fileWideModeJournalQueries,
             CSSUnlinkedHidden,
             CSSpageSubOrder,
} from "../css/styles"
import { removeOnSettingsChangedHierarchyPageTitleOnce, revertOnSettingsChangedHierarchyPageTitleOnce, splitPageTitle } from "../breadcrumb"
import { hierarchyForFirstLevelOnly } from "../hierarchyList"
import { provideStyle, removeElementClass, removeElementId, removeProvideStyle } from "../lib"
import { getCurrentPage } from "../query/advancedQuery"

const handleSplitHierarchyChanges = (
             oldSet: LSPluginBaseInfo['settings'],
             newSet: LSPluginBaseInfo['settings'],
             currentPageName: string
) => {
             if (oldSet.booleanSplitHierarchy !== newSet.booleanSplitHierarchy) {
                          if (newSet.booleanSplitHierarchy) {
                                       splitPageTitle(currentPageName, "singlePage")
                                       if (newSet.booleanRemoveHierarchyPageTitle)
                                                    removeOnSettingsChangedHierarchyPageTitleOnce()
                          } else {
                                       removeElementId("hierarchyLinks")
                                       revertOnSettingsChangedHierarchyPageTitleOnce()
                          }
             }

             if (oldSet.booleanSplitHierarchy) {
                          if (!oldSet.booleanRemoveHierarchyPageTitle && newSet.booleanRemoveHierarchyPageTitle)
                                       removeOnSettingsChangedHierarchyPageTitleOnce()
                          else if (oldSet.booleanRemoveHierarchyPageTitle && !newSet.booleanRemoveHierarchyPageTitle)
                                       revertOnSettingsChangedHierarchyPageTitleOnce()
             }
}

const handleUIChanges = async (newSet: LSPluginBaseInfo['settings']) => {
             // TOC表示処理
             const current = await getCurrentPage() as { name: PageEntity["name"] } | null
             if (current?.name) displayToc(current.name)
             onBlockChanged()

             // 階層修飾の処理
             if (newSet.booleanModifyHierarchy &&
                          !parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`)) {
                          provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)
             } else if (!newSet.booleanModifyHierarchy) {
                          removeProvideStyle(keyPageAccessory)
                          removeProvideStyle(keyNestingPageAccessory)
             }

             // スタイル適用
             switch (newSet.placeSelect) {
                          case "bottom":
                                       removeProvideStyle(keySide)
                                       removeProvideStyle(keyWide)
                                       removeProvideStyle(keyPageAccessoryOrder)
                                       removeProvideStyle(keyWideModeJournalQueries)
                                       logseq.provideStyle({ key: keyBottom, style: fileBottom })
                                       break
                          case "side":
                                       removeProvideStyle(keyBottom)
                                       removeProvideStyle(keyWide)
                                       removeProvideStyle(keyPageAccessoryOrder)
                                       logseq.provideStyle({ key: keySide, style: fileSide })
                                       break
                          case "wide view":
                                       removeProvideStyle(keySide)
                                       removeProvideStyle(keyBottom)
                                       logseq.provideStyle({ key: keyWide, style: fileWide })
                                       logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(logseq.settings) })
                                       break
                          case "unset":
                                       removeProvideStyle(keySide)
                                       removeProvideStyle(keyBottom)
                                       removeProvideStyle(keyWide)
                                       removeProvideStyle(keyPageAccessoryOrder)
                                       removeProvideStyle(keyWideModeJournalQueries)
                                       removeProvideStyle(keyPageAccessory)
                                       removeProvideStyle(keyNestingPageAccessory)
                                       break
             }
}

const handleOtherSettings = async (
             oldSet: LSPluginBaseInfo['settings'],
             newSet: LSPluginBaseInfo['settings'],
             currentPageName: string
) => {
             // Unlinked References の処理
             if (oldSet.booleanUnlinkedReferences !== newSet.booleanUnlinkedReferences) {
                          if (newSet.booleanUnlinkedReferences) {
                                       logseq.provideStyle({ key: keyUnlinkedReferencesHidden, style: CSSUnlinkedHidden })
                          } else {
                                       removeProvideStyle(keyUnlinkedReferencesHidden)
                          }
             }

             // 階層の第一レベルのみ表示
             if (oldSet.booleanHierarchyForFirstLevelOnly !== newSet.booleanHierarchyForFirstLevelOnly) {
                          if (newSet.booleanHierarchyForFirstLevelOnly && currentPageName) {
                                       hierarchyForFirstLevelOnly(currentPageName.split("/"), currentPageName)
                          } else {
                                       removeProvideStyle(keyHierarchyForFirstLevelOnly)
                          }
             }

             // 階層修飾の処理
             if (oldSet.booleanModifyHierarchy !== newSet.booleanModifyHierarchy) {
                          if (newSet.booleanModifyHierarchy &&
                                       !parent.document.head.querySelector(`style[data-injected-style^="${keyPageAccessory}"]`) &&
                                       !parent.document.head.querySelector(`style[data-injected-style^="${keyNestingPageAccessory}"]`)) {
                                       provideStyle(keyNestingPageAccessory, fileNestingPageAccessory)
                          } else if (!newSet.booleanModifyHierarchy) {
                                       removeProvideStyle(keyPageAccessory)
                                       removeProvideStyle(keyNestingPageAccessory)
                          }
             }

             // Table of Contents の処理
             if (oldSet.booleanTableOfContents !== newSet.booleanTableOfContents) {
                          if (newSet.booleanTableOfContents) {
                                       const current = await getCurrentPage() as { name: PageEntity["name"] } | null
                                       if (current?.name) displayToc(current.name)
                                       onBlockChanged()
                          } else {
                                       removeElementClass("th-toc")
                          }
             }

             // Wide Mode Journal Queries の処理
             if (oldSet.booleanWideModeJournalQueries !== newSet.booleanWideModeJournalQueries) {
                          if (newSet.booleanWideModeJournalQueries) {
                                       logseq.provideStyle({ key: keyWideModeJournalQueries, style: fileWideModeJournalQueries })
                          } else {
                                       removeProvideStyle(keyWideModeJournalQueries)
                          }
             }

             // Wide View での position CSS 変更
             if (newSet.placeSelect === "wide view") {
                          const orderChanged = [
                                       'enumScheduleDeadline', 'enumTableOfContents', 'enumLinkedReferences',
                                       'enumUnlinkedReferences', 'enumPageHierarchy', 'enumPageTags'
                          ].some(key => oldSet[key] !== newSet[key])

                          if (orderChanged) {
                                       removeProvideStyle(keyPageAccessoryOrder)
                                       logseq.provideStyle({ key: keyPageAccessoryOrder, style: CSSpageSubOrder(newSet) })
                          }
             }
}

export const onSettingsChangedCallback = (logseqDbGraph: boolean, logseqMdModel: boolean, currentPageName: string) => {
             logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

                          // DB グラフまたは MD モデルの場合は階層処理のみ
                          if (logseqDbGraph === true || logseqMdModel === false) {
                                       handleSplitHierarchyChanges(oldSet, newSet, currentPageName)
                                       return
                          }

                          // 表示場所の変更
                          if (oldSet.placeSelect !== newSet.placeSelect) {
                                       // TOC の表示/非表示制御
                                       if (oldSet.placeSelect === "wide view" && newSet.placeSelect !== "wide view") {
                                                    removeElementClass("th-toc")
                                       } else if (oldSet.placeSelect !== "wide view" && newSet.placeSelect === "wide view") {
                                                    await handleUIChanges(newSet)
                                       }

                                       await handleUIChanges(newSet)

                                       setTimeout(() => {
                                                    setUserSettings(logseqDbGraph, logseqMdModel, newSet.placeSelect as string)
                                                    logseq.showSettingsUI()
                                       }, 100)
                          } else {
                                       // その他の設定変更
                                       await handleOtherSettings(oldSet, newSet, currentPageName)
                                       handleSplitHierarchyChanges(oldSet, newSet, currentPageName)
                          }
             })
}
