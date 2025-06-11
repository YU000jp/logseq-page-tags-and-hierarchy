import { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user"

// クエリを実行する共通関数
const advancedQuery = async <T>(query: string, ...input: Array<any>): Promise<T | null> => {
  try {
    const result = await logseq.DB.datascriptQuery(query, ...input)
    return result?.flat() as T
  } catch (err) {
    console.warn("Query execution failed:", err)
    return null
  }
}

export const getPageUuid = async (pageName: string): Promise<PageEntity["uuid"] | null> => {
  const result = await advancedQuery<{ uuid: PageEntity["uuid"] }[]>(`
    [:find (pull ?p [:block/uuid])
     :in $ ?input
     :where
     [?p :block/name ?name]
     [(= ?name ?input)]
     [?p :block/uuid ?uuid]]
     `  , `"${pageName}"`)
  return result?.[0]?.uuid ?? null
}

export const getContentFromUuid = async (uuid: BlockEntity["uuid"]): Promise<BlockEntity["content"] | null> => {
  const result = await advancedQuery<{ content: BlockEntity["content"] }>(`
    [:find (pull ?p [:block/content])
     :where
     [?p :block/uuid ?uuid]
     [(str ?uuid) ?str]
     [(= ?str "${uuid}")]]
     ` )
  return result?.[0]?.content ?? null
}

export const getParentFromUuid = async (uuid: BlockEntity["uuid"]): Promise<BlockEntity["uuid"] | null> => {
  const result = await advancedQuery<{ parent: BlockEntity["parent"] }>(`
    [:find (pull ?p [{:block/parent [:block/uuid]}])
     :where
     [?p :block/uuid ?uuid]
     [(str ?uuid) ?str]
     [(= ?str "${uuid}")]]
     `)
  if (result?.[0]?.parent) {
    const parentUuid = result[0].parent.uuid
    return parentUuid
  }
  return null
}

export const getCurrentPage = async (): Promise<{ name: PageEntity["name"], uuid: PageEntity["uuid"] } | null> => {
  // nameを取得
  const result = await advancedQuery<{ name: PageEntity["name"], uuid: PageEntity["uuid"] }[]>(`
      [:find (pull ?p [:block/name :block/uuid])
       :in $ ?current
       :where
       [?p :block/name ?name]
       [(= ?name ?current)]
       [?p :block/uuid ?uuid]]
       `, ":current-page")
  if (result?.[0]) {
    const { name, uuid } = result[0]
    return { name, uuid }
  }
  return null
}

// export const getCurrentPageNameForDb = async (): Promise<string | null> => {
//   //:current-pageで、:block/titleが存在する場合は、dbバージョンかつページを開いていると認識する
//   const result = await advancedQuery<{ title: string }>(`
//     [:find (pull ?p [:block/title])
//      :in $ ?current
//      :where
//      [?p :block/title ?title]
//      [?p :block/uuid ?uuid]
//      [?p :block/name ?name]
//      [(= ?name ?current)]]
//      ` , ":current-page")
//   if (result?.[0]?.title)
//     return result[0].title
//   return null
// }

// MD バージョン用の関数

export const getCurrentPageForMd = async (): Promise<string | null> => {
  // mdバージョンの場合は original-nameが取得できる
  const result = await advancedQuery<{ "original-name": PageEntity["originalName"] }[]>(`
      [:find (pull ?p [:block/original-name])
       :in $ ?current
       :where
       [?p :block/name ?name]
       [(= ?name ?current)]
       [?p :block/uuid ?uuid]
       [?p :block/original-name ?original-name]]
       `, ":current-page")
  if (result?.[0])
    return result[0]["original-name"]
  return null
}

export const getCurrentZoomForMd = async (): Promise<{ uuid: BlockEntity["uuid"], page: { originalName: PageEntity["originalName"], uuid: PageEntity["uuid"] } } | null> => {
  // mdバージョンの場合は original-nameが取得できる
  const result = await advancedQuery<{ uuid: BlockEntity["uuid"], page: { originalName: PageEntity["originalName"], uuid: PageEntity["uuid"] } }[]>(`
      [:find (pull ?b [:block/uuid {:block/page [:block/uuid :block/original-name]}])
       :in $ ?current
       :where
       [?b :block/uuid ?uuid]
       [(str ?uuid) ?str]
       [(= ?str ?current)]]
       ` , ":current-page")
  if (result?.[0] && result[0].page)
    return { uuid: result[0].uuid, page: { originalName: result[0].page["original-name"], uuid: result[0].page.uuid } }
  return null
}



// DB バージョン用の関数


export const zoomBlockWhenDb = async (uuid: BlockEntity["uuid"]): Promise<{ uuid: PageEntity["uuid"], title: string } | null> => {
  const result = await advancedQuery<{ uuid: PageEntity["uuid"], title: string }>(`
    [:find (pull ?p [{:block/page [:block/uuid :block/title]}])
     :where
     [?p :block/uuid ?uuid]
     [(str ?uuid) ?str]
     [(= ?str "${uuid}")]]
     ` )
  if (result)
    return result[0] ?
      { uuid: result[0].page.uuid, title: result[0].page.title }
      : null
  return null
}


// :current-pageで、:block/pageが返ってくる場合はズーム中として認識する
export const CurrentCheckPageOrZoom = async (): Promise<{ check: "page" | "zoom", page?: { title: string, uuid: PageEntity["uuid"] } }> => {

  //:current-pageで、:block/titleが存在する場合は、dbバージョンかつページを開いていると認識する
  const result = await advancedQuery<{ title: string, uuid: PageEntity["uuid"] }>(`
    [:find (pull ?p [:block/title :block/uuid])
     :in $ ?current
     :where
     [?p :block/title ?title]
     [?p :block/uuid ?uuid]
     [?p :block/name ?name]
     [(= ?name ?current)]]
     ` , ":current-page")
  if (result?.[0]?.title) // titleが存在する場合はdbグラフかつページと認識する
    return { check: "page", page: { title: result[0].title, uuid: result[0].uuid } }
  return { check: "zoom" } // :current-pageが存在しない場合はズーム中と認識する

}