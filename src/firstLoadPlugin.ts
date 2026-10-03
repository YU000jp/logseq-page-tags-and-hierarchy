import { t } from "logseq-l10n"
import { booleanDbGraph, booleanLogseqMdModel, changeCurrentPageTitle, getCurrentPageNameString, onBlockChanged, onPageChangedCallback, setUserSettings } from "."
import { WhiteboardCallback, removeBreadCrumb } from "./breadcrumb"
import { applyModelStyles } from "./css/applyModelStyles"
import { onSettingsChangedCallback } from "./settings/onSettingsChanged"
import { loadLogseqL10n } from "./translations/l10nSetup"

export const firstLoadPlugin = async (logseqDbGraph: boolean, logseqMdModel: boolean) => {

    // ユーザー設定言語を取得し、L10Nをセットアップ
    await loadLogseqL10n()

    /* user settings */
    setUserSettings(logseqDbGraph, logseqMdModel, logseq.settings!.placeSelect as string) //設定を登録


    //モデルに合わせてスタイルを設定
    await applyModelStyles()

    //ページ読み込み時に実行コールバック
    // グラフ切替に追従するため、コールバック内ではゲッターで現在のグラフ種別を参照する
    logseq.App.onRouteChanged(async ({ template }) => {
        if (booleanDbGraph() === true) return // DBグラフでは実行しない


        //TODO:
        switch (template) {
            case '/home':
                changeCurrentPageTitle("")
                break
            case '/page/:name':
                onPageChangedCallback(booleanDbGraph(), booleanLogseqMdModel())
                break
            case '/whiteboard/:name':
                //Whiteboardの場合
                if (logseq.settings!.booleanWhiteboardSplitHierarchy === true)
                    WhiteboardCallback(booleanDbGraph(), booleanLogseqMdModel())
                break
        }
    })

    //ページ読み込み時に実行コールバック
    logseq.App.onPageHeadActionsSlotted(async () => {
        onPageChangedCallback(booleanDbGraph(), booleanLogseqMdModel())
        setTimeout(() => {
            if (booleanDbGraph() === true || booleanLogseqMdModel() === false) return // DBグラフの場合と、ファイルベースグラフではない場合は実行しない
            const node: Node | null = parent.document.body.querySelector("#main-content-container div.whiteboard") as Node | null
            if (Node
                && logseq.settings!.booleanWhiteboardSplitHierarchy === true)
                WhiteboardCallback(booleanDbGraph(), booleanLogseqMdModel())
        }, 1)

    }) //バグあり？onRouteChangedとともに動作保証が必要


    //ブロック更新のコールバック
    if (logseq.settings!.placeSelect === "wide view"
        && logseq.settings!.booleanTableOfContents === true)
        onBlockChanged()

    //設定変更のコールバック
    onSettingsChangedCallback(logseqDbGraph, logseqMdModel, getCurrentPageNameString())

    //ツールバーに設定画面を開くボタンを追加
    logseq.App.registerUIItem('toolbar', {
        key: 'toolbarPageTagsAndHierarchy',
        template: `<div><a class="button icon" data-on-click="toolbarPageTagsAndHierarchy" style="font-size:15px;color:#1f9ee1;opacity:unset" title="Page-tags and Hierarchy: ${t("plugin settings")}">🏷️</a></div>`,
    })
    //ツールバーボタンのクリックイベント
    logseq.provideModel({
        toolbarPageTagsAndHierarchy: () => logseq.showSettingsUI(),
    })

    //プラグインオフの場合はページ名の階層リンクを削除する
    logseq.beforeunload(async () => {
        removeBreadCrumb()
    })
}
