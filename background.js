// background.js
let color = '#3aa757';
let participants = '2';
let active = "false"

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`)

  chrome.storage.local.set({participants}, function() {
    console.log('Value is set to ' + participants)
  });
  chrome.storage.local.set({ active:"false" });
});

