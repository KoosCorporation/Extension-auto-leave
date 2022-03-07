// background.js
let active = "false";

chrome.runtime.onInstalled.addListener(() => {
 
  chrome.storage.local.set({ active:"false" });
});

