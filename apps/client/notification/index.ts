
const title = "Test de Notification Tictle";
const msg = "A message here to test";
const icon = "/favicon.ico";
const song = "/fasto-sound.wav";

export function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support Desktop notifications");
  }
  if (Notification.permission === "granted") {
    callNotify(title, msg, icon);

    return;
  }
  if (Notification.permission !== "denied") {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        callNotify(title, msg, icon);
      }
    });
    console.log("Test 2")
    return;
  }
}

function callNotify(title: string, msg: string, icon: string) {
  new Notification(title, { body: msg, icon });
  new Audio(song).play();
}