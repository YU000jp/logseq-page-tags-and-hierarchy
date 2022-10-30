function main(){logseq.provideStyle(String.raw`
/* Screen size */
@media screen and (max-width: 1624px) {
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative {
            margin-bottom: 2em;
            margin-top: 2em;
            margin-left: 1.5em;
        }
        /* right-space */
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            position: fixed;
            max-height: 210px;
            width: 42vw;
            overflow-y: auto;
            padding: 1.5em;
            font-size: 0.95em;
            background-color: var(--ls-primary-background-color);
            border-radius: 10px;
            z-index: var(--ls-z-index-level-3);
        }
        /* Pages-tagged-with */
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
            bottom: 0;
            right: 0.3em;
        }
        /* page-hierarchy */
        body:not(.is-pdf-active) div#main-content-container div.page-hierarchy,
        main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            right: 42vw;
            bottom: 0;
        }
}
@media screen and (min-width: 1625px) {
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open.ls-left-sidebar-open) div#main-content-container {
            display: flex;
            justify-content: flex-start;
            padding-left: 2em;
        }
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative {
            margin-bottom: 2em;
            margin-top: 2em;
            margin-left: 1.5em;
        }
        body:not(.is-pdf-active) main.ls-wide-mode div#main-content-container div.flex-1.page.relative {
            margin-right: 390px;
        }
        /* right-space */
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            position: fixed;
            width: 390px;
            max-height: 40vh;
            overflow-y: auto;
            padding: 1.5em;
            font-size: 0.95em;
            background-color: var(--ls-primary-background-color);
            border-radius: 10px;
        }
        /* Pages-tagged-with */
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
            top: 6.5em;
            right: 1em;
        }
        body:not(.is-tabs-loaded.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
            top: 4.5em;
        }
        /* page-hierarchy */
        body:not(.is-pdf-active) div#main-content-container div.page-hierarchy,
        main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            right: 1em;
            bottom: 3em;
        }
}
/* Screen size Finish */
        body.is-pdf-active div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        main.ls-right-sidebar-open div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body.is-pdf-active div#main-content-container div.page-hierarchy,
        main.ls-right-sidebar-open div#main-content-container div.page-hierarchy,
        div#right-sidebar div.relative+div.references.mt-6.flex-1.flex-row,
        div#right-sidebar div.page-hierarchy {
            display: none;
        }
`);}logseq.ready(main).catch(console.error)