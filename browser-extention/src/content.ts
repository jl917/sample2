/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

const browserAPI = typeof chrome !== 'undefined' ? chrome : browser;

const getPageImages = () => {
  const images = Array.from(document.getElementsByTagName('img'));
  return images.map(img => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height
  }));
};

browserAPI.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_IMAGES') {
    sendResponse(getPageImages());
  }
});