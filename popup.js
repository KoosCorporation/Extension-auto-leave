var checkparticipants = document.getElementById("activate");
var deactivate = document.getElementById("deactivate");
var spanWrite = document.getElementById("writeP")

checkparticipants.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    function: checkingParticipants,
  });
});

function checkingParticipants() {
  chrome.storage.local.get("active", ({
    active
  }) => {
    if (active == "false") {
      console.log("Activating")
      chrome.storage.local.set({
        active: "true"
      });
      setInterval(() => {
        var divParticipants = document.getElementsByClassName("uGOf1d")
        var number = divParticipants[0].innerHTML
        console.log(number)
        if (number < 3) {
          var hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"

          var hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]
          chrome.storage.local.set({
            active: "false"
          });
          hangoutbutton.click();
        }
      }, 1000);
    } else if (active == "true") {
      console.log("Already active")
    }
  });
}