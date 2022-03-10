var checkparticipants = document.getElementById("activate");
var deactivate = document.getElementById("deactivate");
var spanWrite = document.getElementById("writeP")
console.log(spanWrite)

checkparticipants.addEventListener("click", async () => {

  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      function: checkingParticipants,
    },
    (injectionResults) => {
      //for (const frameResult of injectionResults)
      if (injectionResults[0].result){
        spanWrite.innerHTML = "Activado"
      }else{
        spanWrite.innerHTML = "No pudo activarse"
      }
      console.log(injectionResults[0].result);
    });
});


function checkingParticipants() {
  let divParticipants = document.getElementsByClassName("uGOf1d")[0]
  let hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"
  let hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]

  var toreturn = ''
  if (divParticipants != undefined & hangoutbutton != undefined) {
    console.log("todo bien")

    chrome.storage.local.get("active", ({
      active
    }) => {
      if (active == "false") {
        return1 = active
        console.log("Activating")
        chrome.storage.local.set({
          active: "true"
        });
        //setInterval(() => {
        let divParticipants = document.getElementsByClassName("uGOf1d")
        let number = divParticipants[0].innerHTML
        console.log(number)
        if (number < 3) {
          let hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"
          let hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]
          chrome.storage.local.set({
            active: "false"
          });
          hangoutbutton.click();
          var token = "5217446941:AAFp8Iiw_Nl8I3IqExyku4CmVSE74-jgnts"
          var chatid = "1144214477"
          var text = "Fuera de la reunion"
          var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`
          let api = new XMLHttpRequest();
          api.open("GET", url, true);
          api.send();
        }
        //}, 1000);
        var return0 = return1
      } else if (active == "true") {
        console.log("Already active")
        toreturn = "Already active"
      }
    });
    var toreturn = true
    console.log("no definidos")
  }
  return toreturn





}