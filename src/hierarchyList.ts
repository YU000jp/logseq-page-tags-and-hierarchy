import { keyHierarchyForFirstLevelOnly, keyHierarchyRemoveBeginningLevel } from "."

// Hierarchyのサブレベル1のみを表示する
// Display only sub-level 1 of Hierarchy
export const hierarchyForFirstLevelOnly = (pageNameArray: string[]) => {
    const count = pageNameArray.length
    let CSSdataRef = ""
    if (count === 1) {
        //li.my-2:has(span.page-reference[data-ref*="A/"]+span.mx-2)にマッチするliを削除する
        CSSdataRef = `&:has(span.page-reference[data-ref*="${pageNameArray[0]}/"i]+span.mx-2),`
    } else {
        //li.my-2:has(span.page-reference[data-ref*="A/B/C/"]+span.mx-2+span.page-reference[data-ref*="A/B/C/"]+span.mx-2)にマッチするliを削除する
        for (let i = 0; i < count; i++) {
            const pageName = pageNameArray.slice(0, i + 1).join("/")
            CSSdataRef += `&:has(span.page-reference[data-ref*="${pageName}/"i]+span.mx-2+span.page-reference[data-ref*="${pageName}/"i]+span.mx-2),`
        }
    }
    //最後の,を削除する
    CSSdataRef = CSSdataRef.slice(0, -1)
    logseq.provideStyle({
        key: keyHierarchyForFirstLevelOnly,
        style: `
        body>div#root>div>main div.page.relative>div.page-hierarchy ul.namespaces>li.my-2 {
            ${CSSdataRef} {
                display: none;
            }
        }
        `})
}

// Hierarchyの最初から始まるレベルを削除する
// Remove beginning level ( > ) of hierarchy
export const hierarchyRemoveBeginningLevel = (pageNameArray: string[]) => {
    let CSSdataRef = ""
    // A/B/Cの場合、AとA/B、A/B/Cの3つのレベルの次のspan.mx-2を削除する
    for (let i = 0; i < pageNameArray.length; i++) CSSdataRef += `&[data-ref="${pageNameArray.slice(0, i + 1).join("/")}"i]+span.mx-2,`
    //最後の,を削除する
    CSSdataRef = CSSdataRef.slice(0, -1)
    logseq.provideStyle({
        key: keyHierarchyRemoveBeginningLevel,
        style: `
        body>div#root>div>main div.page.relative>div.page-hierarchy ul.namespaces>li.my-2>span.page-reference {
            ${CSSdataRef} {
                display: none;
            }
        }
        `})
}