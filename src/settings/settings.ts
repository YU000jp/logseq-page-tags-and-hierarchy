import { SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user"
import { hierarchySettings } from "./hierarchySettings"
import { pageContentHierarchySettings } from "./pageContentHierarchySettings"
import { uiLayoutSettings } from "./uiLayoutSettings"
import { wideViewSettings } from "./wideViewSettings"

export const settingsTemplate = (logseqDbGraph: boolean, logseqMdModel: boolean, enabledWideView: boolean): SettingSchemaDesc[] => [
    ...hierarchySettings(logseqDbGraph, logseqMdModel),
    ...(logseqMdModel ? pageContentHierarchySettings() : []),
    ...(logseqMdModel ? uiLayoutSettings() : []),
    ...(logseqMdModel && enabledWideView ? wideViewSettings() : []),
]
