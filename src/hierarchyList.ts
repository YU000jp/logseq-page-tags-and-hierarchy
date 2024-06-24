import { keyHierarchyForFirstLevelOnly, keyHierarchyRemoveBeginningLevel } from "."

// Hierarchyのサブレベル1のみを表示する
// Display only sub-level 1 of Hierarchy
export const hierarchyForFirstLevelOnly = (pageNameArray: string[], pageName: string) => {
    const count = pageNameArray.length

    // 除外するページを指定する
    if (pageName.match(/^\d{4}\/\d{2}\/\d{2}$/) // yyyy/MM/dd
        || pageName.match(/^\d{4}\/\d{2}$/) // yyyy/MM
        || pageName.match(/^\d{4}$/)) // yyyy
        return

    const CSSdataRef = count === 1 ?
        `&:has(span.page-reference[data-ref*="${pageNameArray[0]}/"i]+span.mx-2)`
        : `&:has(span.page-reference[data-ref*="${pageNameArray[count - 1]}/"i]+span.mx-2)`

    logseq.provideStyle({
        key: keyHierarchyForFirstLevelOnly,
        style: `
        body[data-page="page"]>div#root>div>main div.page.relative>div.page-hierarchy ul.namespaces>li.my-2 {
            ${CSSdataRef} {
                display: none;
            }
        }
        `})
}

// Hierarchyの最初から始まるレベルを削除する
// Remove beginning level ( > ) of hierarchy
export const hierarchyRemoveBeginningLevel = (pageNameArray: string[], pageName: string) => {
    let CSSdataRef = ""
    // A/B/Cの場合、AとA/B、A/B/Cの3つのレベルの次のspan.mx-2を削除する
    for (let i = 0; i < pageNameArray.length; i++) {
        const dataRef = pageNameArray.slice(0, i + 1).join("/")

        // 除外するページを指定する
        if (dataRef.match(/^\d{4}\/\d{2}\/\d{2}$/) // yyyy/MM/dd
            || dataRef.match(/^\d{4}\/\d{2}$/) // yyyy/MM
            || dataRef.match(/^\d{4}$/)) // yyyy
            continue

        CSSdataRef += `&[data-ref="${dataRef}"i],&[data-ref="${dataRef}"i]+span.mx-2,`
    }
    //最後の,を削除する
    CSSdataRef = CSSdataRef.slice(0, -1)
    logseq.provideStyle({
        key: keyHierarchyRemoveBeginningLevel,
        style: `
    body[data-page="page"]>div#root>div>main div.page.relative>div.page-hierarchy ul.namespaces>li.my-2 {
        &>span.page-reference {
            ${CSSdataRef} {
                display: none;
            }
        }
    }
        `})
}