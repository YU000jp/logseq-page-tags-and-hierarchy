
# Logseq プラグイン: *Page-tags and Hierarchy*

ページタグと階層のためのプラグイン
  1. ページ名称の階層を分割して そのリンクを作成します
  1. ページビューUI

<div align="right">

[English](https://github.com/YU000jp/logseq-page-tags-and-hierarchy) / [简体中文](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/blob/main/README.zhCN.md) [![最新リリースバージョン](https://img.shields.io/github/v/release/YU000jp/logseq-page-tags-and-hierarchy)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/releases)
[![ライセンス](https://img.shields.io/github/license/YU000jp/logseq-page-tags-and-hierarchy?color=blue)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/blob/main/LICENSE)
[![ダウンロード数](https://img.shields.io/github/downloads/YU000jp/logseq-page-tags-and-hierarchy/total.svg)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/releases)
 公開日: 2022/10/10 <a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
 </div>

---

- Logseqには、情報の整理と検索をおこなうための機能である **「ページタグ」** と **「階層(hierarchy)」** が備わっています。階層はまた「namespaces」とも呼ばれます。[こちらのドキュメント](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/wiki/%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%BF%E3%82%B0%E3%81%A8%E3%80%81%E3%83%9A%E3%83%BC%E3%82%B8%E5%90%8D%E7%A7%B0%E3%81%AE%E9%9A%8E%E5%B1%A4%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)

## オプション

### 1. ページ名称の階層をリンクとして分割 (デフォルト: **有効**)

- ページ名称の階層を分割し、リンクを作成します。階層の親ページに簡単にアクセスできます。
  > ホワイトボード機能のサポート [#51](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/51#issuecomment-2000623402) 🆕 (ページ名称の階層を分割する)

  ![画像](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/f7da636b-4418-4a2f-b1e9-49c6aa8ec055)

### 2. ページビューUI

- ページコンテンツに配置されるページタグと階層の位置を、通常とは異なる位置に変更します。複数のモードから選択できます。ワイドビューモード、サイドモード、ボトムモードなど... [こちらのドキュメント](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/wiki/%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%93%E3%83%A5%E3%83%BCUI)
  > Logseq バージョン0.9.11以降に対応

---

## はじめに

Logseq マーケットプレイスからインストール
  - 右上のツールバーで `---` を押して `プラグイン` を開きます。`マーケットプレイス` を選択します。検索フィールドに `tags` と入力し、検索結果から選択してインストールします。

### 使用方法

- このプラグインをインストールした後、**スタイルは日誌ページ以外に適用されます**。デフォルトではページビューモードはオフになっています。プラグインの設定で変更できます。

---

## おすすめ

1. 日誌用 => [カラムレイアウト (日誌UI) プラグイン](https://github.com/YU000jp/Logseq-column-Layout)
1. [クイック PARAメソッド プラグイン](https://github.com/YU000jp/logseq-plugin-quickly-para-method)
   * 「namespaceクエリー検索」機能があります。
     - 同じ名称を持つページを検索したり、階層構造を気にせず、関連ページを探しリストアップします。
   * 同じ階層に新しいページを作成したり、サブページを追加できる機能が提供されています。
1. [ページ名の階層を省略する プラグイン](https://github.com/YU000jp/logseq-plugin-short-namespaces)
   > 長くなりがちな階層リンクを省略して表示します。

## 先行技術とクレジット

- Logseq プラグイン >
  1. [hkgnp/ logseq-toc-plugin](https://github.com/hkgnp/logseq-toc-plugin/) (目次表示)
  1. [freder/ logseq-plugin-jump-to-block](https://github.com/freder/logseq-plugin-jump-to-block/) (目次表示)
- 製作者 > [@YU000jp](https://github.com/YU000jp)
