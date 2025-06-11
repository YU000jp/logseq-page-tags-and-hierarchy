export const removeProvideStyle = (className: string) => {
  const doc = parent.document.head.querySelector(`style[data-injected-style^="${className}"]`) as HTMLStyleElement | null
  if (doc) doc.remove()
}

export const removeProvideStyles = (classNameArray: string[]) => {
  const docs = parent.document.head.querySelectorAll(`style:is(${classNameArray.map(className => `[data-injected-style^="${className}"]`).join(", ")})`) as NodeListOf<HTMLStyleElement>
  docs.forEach(doc => doc.remove())
}


export const removeElementClass = (elementClassName: string) => {
  const doc = (parent.document.getElementsByClassName(elementClassName) as HTMLCollectionOf<HTMLElement>)[0]
  if (doc) doc.remove()
}
export const removeElementId = (elementId: string) => {
  const doc = parent.document.getElementById(elementId) as HTMLElement
  if (doc) doc.remove()
}

export const provideStyle = (
  key: string,
  style: string,
) => {
  logseq.provideStyle({ key: key, style: style })
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
