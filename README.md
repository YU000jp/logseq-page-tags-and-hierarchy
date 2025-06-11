# Logseq Plugin: *Page-tags and Hierarchy*

> [!NOTE]
This plugin only works on file-based graph.

<div align="right">

[English](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/)/[日本語](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/blob/main/README.ja.md) [![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-page-tags-and-hierarchy)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-page-tags-and-hierarchy?color=blue)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/blob/main/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-page-tags-and-hierarchy/total.svg)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/releases)
 Published 20221010 <a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"/></a>
</div>

---

- Logseq has page tags and a hierarchical structure to show how pages are related to each other. They provide links within the page content, but not enough. This plugin improves on that. [For more information.](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/wiki/Logseq-features-Page-Tags-and-Hierarchy)

## Overview

### 1. Breadcrumb of page title  (default: *enable*)

> Available in Logseq file-based graph
- Split the hierarchy of a page name into links
  > It also works on whiteboards. [#51](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/51#issuecomment-2000623402) 🆕

   ![image](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/f7da636b-4418-4a2f-b1e9-49c6aa8ec055)

### 2. Customizing Page Tags and Hierarchy Display (Page view UI)

> Logseq DB model is not supported
- Logseq standard displays page tags and hierarchy at the end of page content, but it is inconvenient to scroll to the end. This plugin provides placement options to eliminate that inconvenience:
  > [For more information.](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/wiki/Page-View-UI)

---

## Getting Started

- Install from Logseq Marketplace
  - Press `---` on the top right toolbar to open `Plugins`. Select `Marketplace`. Type `tags` in the search field, select it from the search results and install.

### Usage

- Configure various settings in the plugin settings.

---

## Showcase / Questions / Ideas / Help

> Go to the [Discussions](https://github.com/YU000jp/Logseq-column-Layout/discussions) tab to ask and find this kind of things.

1. This plugin relies on Logseq's DOM (Document Object Model) structure. If the DOM structure changes due to a Logseq version update, styles may not be applied. We will adjust the CSS to deal with it. If you notice something, please raise an issue.
1. Related Item
   1. For journals => [Column Layout plugin](https://github.com/YU000jp/Logseq-column-Layout)
   1. [Short namespaces plugin](https://github.com/YU000jp/logseq-plugin-short-namespaces)
      - Displays abbreviated hierarchical links, which tend to be lengthy.

## Prior art / Credit

- "Table of contents" feature:
  1. [@hkgnp/ logseq-toc plugin](https://github.com/hkgnp/logseq-toc-plugin/)
  1. [@freder/ logseq-plugin-jump-to-block plugin](https://github.com/freder/logseq-plugin-jump-to-block/)
- Author > [@YU000jp](https://github.com/YU000jp)
