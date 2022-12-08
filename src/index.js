import "@logseq/libs";
import { settingUI } from "./setting";

const main = () => {
    settingUI(); /* -setting */
    /* CSS */
    logseq.provideStyle(String.raw`
    /* Logseq bugs fix */
    /* Fix "Extra space when journal queries are not active #6773" */
    div#journals div#today-queries>div.lazy-visibility {
        min-height: unset !important;
    }
    
    /* journal queries */
    div#journals div#today-queries>div.lazy-visibility>div.shadow {
        display: none;
    }
    
    /* background conflict journal queries */
    div#journals div#today-queries div.color-level div.blocks-container,
    div#journals div#today-queries div.color-level {
        background-color: unset;
    }
    
    /* CANCEL PDF view & right sidebar */
    body.is-pdf-active div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
    main.ls-right-sidebar-open div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
    body.is-pdf-active div#main-content-container div.page-hierarchy,
    main.ls-right-sidebar-open div#main-content-container div.page-hierarchy,
    div#right-sidebar div.relative+div.references.mt-6.flex-1.flex-row,
    div#right-sidebar div.page-hierarchy {
        display: none;
    }
    `);
    const Setting = logseq.settings.switch01;
    
    //Bottom
    if (Setting !== undefined && Setting === "Bottom") {
    
        logseq.provideStyle(String.raw`
    //Bottom
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
    `);

    }else{

    //Bottom < 1624 & 1625 > Side
    logseq.provideStyle(String.raw`


    /* Bottom < 1624 */
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
    

    /* 1625 > Side */
    @media screen and (min-width: 1625px) {

        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative {
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
    @media screen and (min-width: 1625px) and (max-width: 2259px) {

        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container {
            padding-right: 424px;
        }

        /* Contents Page */
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            width: 420px;
        }

    }
    @media screen and (min-width: 2260px) {

        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container {
            padding-right: 684px;
        }

        /* Contents Page */
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            width: 680px;
        }
    } 
    `);
    }

};
logseq.ready(main).catch(console.error);
