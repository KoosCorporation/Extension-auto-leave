var checkparticipants = document.getElementById("activate");
var deactivate = document.getElementById("deactivate");
var spanWrite = document.getElementById("writeP")
var inputNumMin = document.getElementById("nmin")

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
        function: checkingParticipants,
        args: [NumMin]
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


function checkingParticipants(NumMin) {
  let divParticipants = document.getElementsByClassName("uGOf1d")[0]
  let hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"
  let hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]
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
        var text = "Activado correctamente con: " + NumMin
        sendNotTelegram(text)
        // -------------INTERVALO DE 1 SEGUNDO PARA VERIFICAR LOS PARTICIPANTES CONSTANTEMENTE
        var intervalo = setInterval(() => {
          let divParticipants = document.getElementsByClassName("uGOf1d")
          let number = divParticipants[0].innerHTML
          console.log(number)
          // -------------VERIFICACION DE SOLICITUD DE INACTIVIDAD
          chrome.storage.local.get("active", ({
            active
          }) => {
            if (active == "false") {
              clearInterval(intervalo)
            }
          })
          // -------------CONTROL DE NUMERO MINIMO DE PARTICIPANTES ANTES DE COLGAR LA LLAMADA
          if (number < NumMin) {
            let hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"
            let hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]
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
    var token = "5217446941:AAFp8Iiw_Nl8I3IqExyku4CmVSE74-jgnts"
    var chatid = "1144214477"
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
  }
}

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
    var token = "5217446941:AAFp8Iiw_Nl8I3IqExyku4CmVSE74-jgnts"
    var chatid = "1144214477"
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
  }
}