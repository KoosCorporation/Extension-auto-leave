var checkparticipants = document.getElementById("activate");
var deactivate = document.getElementById("deactivate");
var spanWrite = document.getElementById("writeP")
var inputNumMin = document.getElementById("nmin")
console.log(spanWrite)

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
          spanWrite.innerHTML = "Activado"
        } else {
          spanWrite.innerHTML = "No pudo activarse"
        }
        console.log(injectionResults[0].result);
      });
  }
});


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
      console.log(injectionResults[0].result);
    });
});


function checkingParticipants(NumMin) {
  console.log(NumMin)
  let divParticipants = document.getElementsByClassName("uGOf1d")[0]
  let hangoutbuttonclassname = "google-material-icons VfPpkd-kBDsod r6Anqf"
  let hangoutbutton = document.getElementsByClassName(hangoutbuttonclassname)[0]
  // -------------VERIFIACION DE ENCUENMTRO DE ELEMENTOS PARA CONTROL 
  var toreturn = ''
  if (divParticipants != undefined & hangoutbutton != undefined) {
    console.log("todo bien")
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
        chrome.notifications.create(
          "name",
          {
            type: "basic",
            iconUrl: "images/image.jpg",
            title: "This is a notification",
            message: "hello there!",
          },
          function () {}
        );
        // INTERVALO DE 1 SEGUNDO PARA VERIFICAR LOS PARTICIPANTES CONSTANTEMENTE
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
            var token = "5217446941:AAFp8Iiw_Nl8I3IqExyku4CmVSE74-jgnts"
            var chatid = "1144214477"
            var text = "Ya fuera de la reunion"
            var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`
            let api = new XMLHttpRequest();
            api.open("GET", url, true);
            api.send();
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
}

function deactivating() {
  console.log("desactivando")
  chrome.storage.local.set({
    active: "false"
  });
  return true
}