export const removeProvideStyle = (className: string) => {
  const doc = parent.document.head.querySelector(
    `style[data-injected-style^="${className}"]`
  ) as HTMLStyleElement | null;
  if (doc) doc.remove();
};

export const removeElementClass = (elementClassName: string) => {
  const doc = (
    parent.document.getElementsByClassName(
      elementClassName
    ) as HTMLCollectionOf<HTMLElement>
  )[0];
  if (doc) doc.remove();
};

export async function versionCheck(
  first: number,
  second: number,
  third: number
): Promise<boolean> {
  const version: string = await logseq.App.getInfo("version");
  const versionArr = version?.split(".") as string[];
  if (
    Number(versionArr[0]) > first ||
    (Number(versionArr[0]) === first && Number(versionArr[1]) > second) ||
    (Number(versionArr[1]) === second && Number(versionArr[2]) >= third)
  ) {
    return true; //指定した以上のバージョンの場合
  } else return false; //指定より古いバージョンの場合
}

export function provideStyleByVersion(
  versionOver: boolean,
  newKey: string,
  newStyle: string,
  oldKey: string,
  oldStyle: string
) {
  if (versionOver === true)
    logseq.provideStyle({ key: newKey, style: newStyle });
  //指定した以上のバージョンの場合
  else logseq.provideStyle({ key: oldKey, style: oldStyle }); //指定より古いバージョンの場合
}

export function titleCollapsedRegisterEvent(
  titleElement: HTMLElement,
  targetElement: HTMLElement
) {
  //titleElementをクリックしたらtargetElementのclassを変更する
  if (!titleElement || !targetElement) return;
  titleElement.onclick = async () => {
    if (targetElement.classList.contains("initial")) {
      //elementTocInPageの親要素のclassをhiddenにする
      targetElement.classList.remove("initial");
      targetElement.classList.add("hidden");
    } else {
      //elementTocInPageの親要素のclassをinitialにする
      targetElement.classList.remove("hidden");
      targetElement.classList.add("initial");
    }
  };
}
