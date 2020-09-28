// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
// Duck typing method, not fully failproof
// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

if (isIE === true) {
  var message = "\
    <h1 style='text-align:center;font-size:2rem;color:#f5333f;font-family:Poppins,\'Helvetica Neue\',Helvetica,Arial,sans-serif;'>\
      Internet Explorer is not supported by GO. Please consider using Google Chrome, Mozilla Firefox, Edge (from version 79), or an other Chromium based browser.\
    </h1>\
  ";
  document.body.style.backgroundColor = "#faf9f9";
  document.getElementById("app-container").innerHTML = message;
}
