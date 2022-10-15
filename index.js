function main(){logseq.provideStyle(String.raw`
/* Screen size */
@media screen and (min-width: 1580px) {
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative {
            margin-right: 390px;
            margin-bottom: 2em;
            margin-top: 2em;
            margin-left: 1.5em;
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
        body.is-pdf-active div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        main.ls-right-sidebar-open div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
            display: none;
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
        body.is-pdf-active div#main-content-container div.page-hierarchy,
        main.ls-right-sidebar-open div#main-content-container div.page-hierarchy {
            display: none;
        }
}
/* Screen size Finish */
`);}logseq.ready(main).catch(console.error)