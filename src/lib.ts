
export const removeProvideStyle = (className: string) => {
    const doc = parent.document.head.querySelector(`style[data-injected-style^="${className}"]`) as HTMLStyleElement | null;
    if (doc) doc.remove();
};

export const removeElementClass = (elementClassName: string) => {
    const doc = (parent.document.getElementsByClassName(elementClassName) as HTMLCollectionOf<HTMLElement>)[0];
    if (doc) doc.remove();
};
