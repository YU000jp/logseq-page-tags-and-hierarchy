export const removeProvideStyle = (className: string) => {
  const doc = parent.document.head.querySelector(
    `style[data-injected-style^="${className}"]`
  ) as HTMLStyleElement | null
  if (doc) doc.remove()
}

export const removeElementClass = (elementClassName: string) => {
  const doc = (
    parent.document.getElementsByClassName(
      elementClassName
    ) as HTMLCollectionOf<HTMLElement>
  )[0]
  if (doc) doc.remove()
}
export const removeElementId = (elementId: string) => {
  const doc = parent.document.getElementById(elementId) as HTMLElement
  if (doc) doc.remove()
}

export const versionCheck = async (
  first: number,
  second: number,
  third: number
): Promise<boolean> => {
  let version: string = await logseq.App.getInfo("version")
  //0.9.13-nightly.20230811のような文字列であった場合、-nightly以降を削除する
  if (version?.includes("-")) {
    const versionArr = version?.split("-") as string[]
    version = versionArr[0]
  }
  const versionArr = version?.split(".") as string[]
  if (
    Number(versionArr[0]) > first ||
    (Number(versionArr[0]) === first && Number(versionArr[1]) > second) ||
    (Number(versionArr[1]) === second && Number(versionArr[2]) >= third)
  ) {
    return true //指定した以上のバージョンの場合
  } else return false //指定より古いバージョンの場合
}

export const provideStyleByVersion = (
  versionOver: boolean,
  newKey: string,
  newStyle: string,
  oldKey: string,
  oldStyle: string
) => {
  if (versionOver === true)
    logseq.provideStyle({ key: newKey, style: newStyle })
  //指定した以上のバージョンの場合
  else logseq.provideStyle({ key: oldKey, style: oldStyle }) //指定より古いバージョンの場合
}

export const titleCollapsedRegisterEvent = (
  titleElement: HTMLElement,
  targetElement: HTMLElement
) => {
  //titleElementをクリックしたらtargetElementのclassを変更する
  if (!titleElement || !targetElement) return
  titleElement.onclick = async () => {
    if (targetElement.classList.contains("initial")) {
      //classをhiddenにする
      targetElement.classList.remove("initial")
      targetElement.classList.add("hidden")
    } else {
      //classをinitialにする
      targetElement.classList.remove("hidden")
      targetElement.classList.add("initial")
    }
  }
}
