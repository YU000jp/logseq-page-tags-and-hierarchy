import "@logseq/libs";
import { settingUI } from "./setting";

const main = () => {

    settingUI(); /* -setting */


    logseq.provideStyle(String.raw`
    /* Logseq bugs fix */
    
    /* Fix "Extra space when journal queries are not active #6773" */
    body[data-page="home"] div#today-queries>div.lazy-visibility {
        min-height: unset !important;
    }
    
    /* journal queries No shadow */
    body[data-page="home"] div#today-queries>div.lazy-visibility>div.shadow {
        display: none;
    }
    
    /* background conflict journal queries */
    body[data-page="home"] div#today-queries div.color-level div.blocks-container,
    body[data-page="home"] div#today-queries div.color-level {
        background-color: unset;
    }
    
    /* CANCEL PDF view & right sidebar */
    body[data-page="page"].is-pdf-active div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
    body[data-page="page"] main.ls-right-sidebar-open div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
    body[data-page="page"].is-pdf-active div#main-content-container div.page-hierarchy,
    body[data-page="page"] main.ls-right-sidebar-open div#main-content-container div.page-hierarchy,
    body[data-page="page"] div#right-sidebar div.relative+div.references.mt-6.flex-1.flex-row,
    body[data-page="page"] div#right-sidebar div.page-hierarchy {
        display: none;
    }
    `);


    const SettingMain = logseq.settings.switchMain;
    const SettingWideModeLimit = logseq.settings.switchWideModeLimit;


    //wide mode limit
    if (SettingWideModeLimit !== "Normal") {
        logseq.provideStyle(String.raw`
        main.ls-wide-mode div#main-content-container div.cp__sidebar-main-content {
            max-width: 1450px;
        }
        `);
    }
    

    //Bottom
    if (SettingMain !== undefined && SettingMain === "Bottom") {
    
        logseq.provideStyle(String.raw`
    //Bottom
    body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative {
        margin-bottom: 2em;
        margin-top: 2em;
        margin-left: 1.5em;
    }

    /* right-space */
    body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
    body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
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
    body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
        bottom: 0;
        right: 0.3em;
    }

    /* page-hierarchy */
    body[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,
    body[data-page="page"] main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
        right: 42vw;
        bottom: 0;
    }
    `);


    }else{


    //Bottom < 1624 & 1625 > Side
    logseq.provideStyle(String.raw`

    /* Bottom < 1624 */
    @media screen and (max-width: 1624px) {

        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative {
            margin-bottom: 2em;
            margin-top: 2em;
            margin-left: 1.5em;
        }
    
        /* right-space */
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
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
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
            bottom: 0;
            right: 0.3em;
        }
    
        /* page-hierarchy */
        body[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,
        body[data-page="page"] main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            right: 42vw;
            bottom: 0;
        }
    }
    

    /* 1625 > Side */
    @media screen and (min-width: 1625px) {

        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.flex-1.page.relative {
            margin-bottom: 2em;
            margin-top: 2em;
            margin-left: 1.5em;
        }
    
        /* right-space */
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
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
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
            top: 6.5em;
            right: 1em;
        }
    
        body[data-page="page"]:not(.is-tabs-loaded.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row {
            top: 4.5em;
        }
    
        /* page-hierarchy */
        body[data-page="page"]:not(.is-pdf-active) div#main-content-container div.page-hierarchy,
        body[data-page="page"]:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            right: 1em;
            bottom: 3em;
        }
    
    } 

    @media screen and (min-width: 1625px) and (max-width: 2259px) {

        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container {
            padding-right: 424px;
        }

        /* Contents Page */
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            width: 420px;
        }

    }

    @media screen and (min-width: 2260px) {

        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-container {
            padding-right: 684px;
        }

        /* Contents Page */
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.relative+div.references.mt-6.flex-1.flex-row,
        body[data-page="page"]:not(.is-pdf-active) main:not(.ls-right-sidebar-open) div#main-content-container div.page-hierarchy {
            width: 680px;
        }
    } 

    `);
    }

};

logseq.ready(main).catch(console.error);
