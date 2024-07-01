const BrowserLangDetect = () => {
  const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages[0]
  return browserLocales
}

export default BrowserLangDetect
