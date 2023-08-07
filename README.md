# Logseq Plugin: *Page-tags and Hierarchy (UI)*

- ~~Place page tags and hierarchy in non-standard positions (right or bottom of the page).~~
- Place page tags and hierarchy or references in non-standard positions. Choose from several modes.

 [![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-page-tags-and-hierarchy)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-page-tags-and-hierarchy?color=blue)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/blob/main/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-page-tags-and-hierarchy/total.svg)](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/releases)
 Published 2022/10/10

---

## Features

### Wide view mode [#24](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/24) 🆕

- Place page-tags and page-hierarchy, linked references, unlinked references side by side with content of the page.
  - *require scroll to right space
  - If workspace is small, zoom in or open it in the right sidebar
  - Logseq v0.9.11 or later⚠️
 
  > For Journals >> [Column Layout plugin](https://github.com/YU000jp/Logseq-column-Layout)

  ![image](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/f6b2c0d0-85bd-4629-9da9-ecc6940f2387)

#### Table of Contents in a page (Wide view mode only) [#32](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/32) 🆕

- Use the markdown of Header (`# `) (`## `) (`### `) (`#### `) (`#### `) (`##### `)

  ![WideViewMode-Toc](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/995487f5-66b1-4dc5-8556-242ccb5120de)

### Side mode

- Place page-tags and page-hierarchy side by side with ontent of the page.

  ![image](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/641562cf-d7ac-40f6-805b-9e74377daa3c)

### Bottom mode

  ![image](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/96aabe66-9f72-45ae-aa16-dce949c063b2)

### Show hierarchy links to page title [#22](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/22) 🆕

![image](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/cd236bc1-70b5-48af-a343-c86167c23c53)

---

## Getting Started

### Install from Logseq Marketplace

- Press `---` on the top right toolbar to open `Plugins`
- Select `Marketplace`
- Type `tags` in the search field, select it from the search results and install

   ![image](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/assets/111847207/829fa20a-fa4a-446e-a685-2d52ff2db3f4)


### Usage

- When this plugin install, the style be applied to non-journal pages. By default, side mode or bottom mode is turned off. it is possible to set in the plugin settings.

#### Page-Tags

- Add `tags:: AA,BB` to first block as page properties on any page

- Links
   1. [Properties (docs.logseq.com)](https://docs.logseq.com/#/page/properties)
   1. [Page-links vs Tags](https://aryansawhney.com/pages/page-links-vs-tags-in-logseq/#special-case-page-tags)

#### Hierarchy (namespaces)

- Insert slashes in a page name to create what is called "hierarchy". for example `Logseq/Plugin`

> It turns out that Logseq has a macro to show the hierarchy. Example: `{{namespace PAGE}}`

- Link
   1. [How to use namespaces](https://www.logseqmastery.com/blog/logseq-namespaces)

### Plugin Settings

- Split hierarchy of the page title link (non-journals) [#22](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/22) 🆕
  - `true` default
  - `false`
- Place on side by side or bottom: Select
  - `wide view`: *require scroll to right space [#24](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/24) 🆕
  - `side` default: *min-width 1560px
  - `bottom`: *min-width 1560px
  - `unset` : *for only use split hierarchy feature [#22](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/22) 🆕
- For non-"unset", modify the display of hierarchy to be original rather than standard: Toggle
  - `true` default
  - `false`
- Bottom mode, when the window size is less than 1560px, do not display it: Toggle
  - `true` default
  - `false`
- Enable table of contents on a page (wide view only) [#32](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/32) 🆕
  - `true` default
  - `false`
- Hide table of contents by default (wide view only) [#32](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/32) 🆕
  - `true`
  - `false` default
- Scheduled and deadline position (wide view only) [#33](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/33) 🆕
  - `1` default
  - `2`
  - `3`
  - `4`
  - `5`
  - `6`
- Table of contents position (wide view only) [#33](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/33) 🆕
  - `1`
  - `2` default
  - `3`
  - `4`
  - `5`
  - `6`
- Linked references position (wide view only) [#33](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/33) 🆕
  - `1`
  - `2`
  - `3` default
  - `4`
  - `5`
  - `6`
- Unlinked references position (wide view only) [#33](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/33) 🆕
  - `1`
  - `2`
  - `3`
  - `4` default
  - `5`
  - `6`
- Page hierarchy position (wide view only) [#33](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/33) 🆕
  - `1`
  - `2`
  - `3`
  - `4`
  - `5` default
  - `6`
- Page tags position (wide view only) [#33](https://github.com/YU000jp/logseq-page-tags-and-hierarchy/issues/33) 🆕
  - `1`
  - `2`
  - `3`
  - `4`
  - `5`
  - `6` default

---

## Author

- GitHub: [YU000jp](https://github.com/YU000jp)

---

## Prior art & Credit

- Logseq plugin

  - [hkgnp/ logseq-toc-plugin](https://github.com/hkgnp/logseq-toc-plugin/)
  - [freder/ logseq-plugin-jump-to-block](https://github.com/freder/logseq-plugin-jump-to-block/)

---

<a href="https://www.buymeacoffee.com/yu000japan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="🍌Buy Me A Coffee" style="height: 42px;width: 152px" ></a>

