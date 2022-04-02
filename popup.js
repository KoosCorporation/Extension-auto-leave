import { THETOKEN, THECHATID } from "./env.js";

var checkparticipants = document.getElementById("activate");
var deactivate = document.getElementById("deactivate");
var spanWrite = document.getElementById("writeP")
var inputNumMin = document.getElementById("nmin")
var meetButton = document.getElementById("meet-button")
var teamsButton = document.getElementById("teams-button")
var discordButton = document.getElementById("discord-button")
var platformHtml = document.getElementById("writeP2")
var thePlatform = ""
var checkingParticipantsFunction  =  checkingParticipantsMeet

//-------------FOCUS ON INPUT DE NUMERO MINIMO
inputNumMin.focus()


//-------------REVISION DE ESTADO
chrome.storage.local.get("active", ({
  active
}) => {
  if (active == "true") {
    chrome.storage.local.get("number", ({
      number
    }) => {
      spanWrite.innerHTML = "Activado a: " + number
    })
  } else {
    spanWrite.innerHTML = "Desactivado"
  }
});

//-------------REVISION DE PLATAFORMA SELECCIONADA
chrome.storage.local.get("platform", ({
  platform
}) => {
  thePlatform = platform
  if (platform == "meet"){
    platformHtml.innerHTML = "Plataforma: Google meet"
    meetButton.setAttribute('class', 'icon-box selected')
    teamsButton.setAttribute('class', 'icon-box')
  } else if (platform == "teams"){
    platformHtml.innerHTML = "Plataforma: Microsoft Teams"
    teamsButton.setAttribute('class', 'icon-box selected')
    meetButton.setAttribute('class', 'icon-box')
  }
});

//-------------lISTENER DE SELECCION DE PLATAFORMA MEET
meetButton.addEventListener("click", () => {
  chrome.storage.local.set({ platform:"meet" });
  chrome.storage.local.get("platform", ({
    platform
  }) => {
    thePlatform = platform
    checkingParticipantsFunction = checkingParticipantsMeet
    platformHtml.innerHTML = "Plataforma: Google meet"
    meetButton.setAttribute('class', 'icon-box selected')
    teamsButton.setAttribute('class', 'icon-box')
  });
});

//-------------lISTENER DE SELECCION DE PLATAFORMA TEAMS
teamsButton.addEventListener("click", () => {
  chrome.storage.local.set({ platform:"teams" });
  chrome.storage.local.get("platform", ({
    platform
  }) => {
    thePlatform = platform
    checkingParticipantsFunction = checkingParticipantsTeams
    platformHtml.innerHTML = "Plataforma: Microsoft Teams"
    teamsButton.setAttribute('class', 'icon-box selected')
    meetButton.setAttribute('class', 'icon-box')
  });
});

//-------------LISTENER DE PRESIONAR BOTON DE ACTIVACION
checkparticipants.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  //-------------TOMA DE NUMERO MINIMO DE PARTICIPANTES INGRESADOS POR EL USUARIO
  var NumMin = inputNumMin.value
  if (NumMin < 1) {
    spanWrite.innerHTML = "No puede ser inferior a 1"
  } else {
    chrome.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        function: checkingParticipantsFunction,
        args: [NumMin, THETOKEN, THECHATID]
      },
      (injectionResults) => {
        //-------------for (const frameResult of injectionResults)
        if (injectionResults[0].result) {
          chrome.storage.local.get("number", ({
            number
          }) => {
            spanWrite.innerHTML = "Activado a: " + number
          })
        } else {
          spanWrite.innerHTML = "No pudo activarse"
        }
        console.log(injectionResults[0].result);
      });
  }
});

//-------------LISTENER DE PRESIONAR BOTON DE DESACTICACION
deactivate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      function: deactivating
    },
    (injectionResults) => {
      //-------------for (const frameResult of injectionResults)
      if (injectionResults[0].result) {
        spanWrite.innerHTML = "Desactivado"
      } else {
        spanWrite.innerHTML = "No pudo desactivarse"
      }
    });
});

//-------------FUNCION DE CONTROL PARA GOOGLE MEET
function checkingParticipantsMeet(NumMin, THETOKEN, THECHATID) {
  let divParticipants = document.getElementsByClassName("uGOf1d")[0]
  let hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"
  let hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]
  console.log(divParticipants)
  console.log(hangoutbutton)
  console.log("buenos dias")
  // -------------VERIFIACION DE ENCUENMTRO DE ELEMENTOS PARA CONTROL 
  var toreturn = ''
  if (divParticipants != undefined & hangoutbutton != undefined) {
    // -------------TOMA LA VARIABLE ACTIVE DE STORAGE PARA VERIFICAR SI ESTA YA EN FUNCIONAMIENTO EL BOT
    chrome.storage.local.get("active", ({
      active
    }) => {
      // -------------VERIFICACION DE ACTIVIDAD
      if (active == "false") {
        console.log("Activating")
        chrome.storage.local.set({
          active: "true"
        });
        //-------------NOTIFICACION DE ACTIVACION
        chrome.storage.local.set({
          number: NumMin
        })
        var text = "Activado en Meet correctamente con: " + NumMin
        sendNotTelegram(text)
        // -------------INTERVALO DE 1 SEGUNDO PARA VERIFICAR LOS PARTICIPANTES CONSTANTEMENTE
        var intervalo = setInterval(() => {
          let divParticipants = document.getElementsByClassName("uGOf1d")
          let number = divParticipants[0].innerHTML
          console.log(number)
          console.log(NumMin)
          // -------------VERIFICACION DE SOLICITUD DE INACTIVIDAD
          chrome.storage.local.get("active", ({
            active
          }) => {
            if (active == "false") {
              clearInterval(intervalo)
            }
          })
          // -------------CONTROL DE NUMERO MINIMO DE PARTICIPANTES ANTES DE COLGAR LA LLAMADA
          console.log(number < NumMin)
          if (number < NumMin) {
            let hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"
            let hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]
            console.log("hodi")
            console.log(hangoutbutton)
            // -------------SETEO DE STORAGE PARA DETENCION DE ACTIVIDAD
            chrome.storage.local.set({
              active: "false"
            });
            // -------------CUELGA LA LLAMADA
            hangoutbutton.click();
            // -------------ENVIO DE MENSAJE A TELEGRAM COMO NOTIFICACION
            var text = "! Ya fuera de la reunion !"
            sendNotTelegram(text)
            var text = "---===========================---"
            sendNotTelegram(text)
          }
        }, 1000);
      } else if (active == "true") {
        // -------------CONTROL DE ESTADO DE ACTIVIDAD
        console.log("Already active")
      }
    });
    toreturn = true
  } else {
    // -------------CONTROL DE NOT FOUND PARA COMPONENTES NECESARIOS
    console.log("no definidos")
    toreturn = false
  }
  return toreturn

  function sendNotTelegram(text) {
    var token = THETOKEN
    var chatid = THECHATID
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
  }
}

//-------------FUNCION DE CONTROL PARA MICROSOFT TEAMS
function checkingParticipantsTeams(NumMin, THETOKEN, THECHATID) {
  let divParticipants = document.getElementsByClassName("toggle-number")[1]
  let hangoutbuttonIdname = "hangup-button"
  let hangoutbutton = document.getElementById(hangoutbuttonIdname)
  console.log(divParticipants)
  console.log(hangoutbutton)
  console.log("buenos dias")
  // -------------VERIFIACION DE ENCUENMTRO DE ELEMENTOS PARA CONTROL 
  var toreturn = ''
  if (divParticipants != undefined & hangoutbutton != undefined) {
    // -------------TOMA LA VARIABLE ACTIVE DE STORAGE PARA VERIFICAR SI ESTA YA EN FUNCIONAMIENTO EL BOT
    chrome.storage.local.get("active", ({
      active
    }) => {
      // -------------VERIFICACION DE ACTIVIDAD
      if (active == "false") {
        console.log("Activating")
        chrome.storage.local.set({
          active: "true"
        });
        //-------------NOTIFICACION DE ACTIVACION
        chrome.storage.local.set({
          number: NumMin
        })
        var text = "Activado en Teams correctamente con: " + NumMin
        sendNotTelegram(text)
        // -------------INTERVALO DE 1 SEGUNDO PARA VERIFICAR LOS PARTICIPANTES CONSTANTEMENTE
        var intervalo = setInterval(() => {
          let divParticipants = document.getElementsByClassName("toggle-number")
          let number = divParticipants[1].innerHTML.split('')[1]
          console.log(number)
          console.log(NumMin)
          // -------------VERIFICACION DE SOLICITUD DE INACTIVIDAD
          chrome.storage.local.get("active", ({
            active
          }) => {
            if (active == "false") {
              clearInterval(intervalo)
            }
          })
          // -------------CONTROL DE NUMERO MINIMO DE PARTICIPANTES ANTES DE COLGAR LA LLAMADA
          console.log(number < NumMin)
          if (number < NumMin) {
            let hangoutbuttonIdname = "hangup-button"
            let hangoutbutton = document.getElementById(hangoutbuttonIdname)
            console.log("hodi")
            console.log(hangoutbutton)
            // -------------SETEO DE STORAGE PARA DETENCION DE ACTIVIDAD
            chrome.storage.local.set({
              active: "false"
            });
            // -------------CUELGA LA LLAMADA
            hangoutbutton.click();
            // -------------ENVIO DE MENSAJE A TELEGRAM COMO NOTIFICACION
            var text = "! Ya fuera de la reunion !"
            sendNotTelegram(text)
            var text = "---===========================---"
            sendNotTelegram(text)
          }
        }, 1000);
      } else if (active == "true") {
        // -------------CONTROL DE ESTADO DE ACTIVIDAD
        console.log("Already active")
      }
    });
    toreturn = true
  } else {
    // -------------CONTROL DE NOT FOUND PARA COMPONENTES NECESARIOS
    console.log("no definidos")
    toreturn = false
  }
  return toreturn

  function sendNotTelegram(text) {
    var token = THETOKEN
    var chatid = THECHATID
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
  }
}

//-------------FUNCION DE DESACTIVACION
function deactivating() {
  console.log("desactivando")
  chrome.storage.local.set({
    active: "false"
  });
  var text = "Desactivado"
  sendNotTelegram(text)
  var text = "---===========================---"
  sendNotTelegram(text)
  return true

  function sendNotTelegram(text) {
    var token = TOKEN
    var chatid = CHATID
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
  }
}