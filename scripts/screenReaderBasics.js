var allelements = null;
var currentelem_index = 0;
var currentstate = "PAUSED";  // READING, READINGBACKWARD, READONEFORWARD, READONEBACK


// Header Information
var currentHeaderIndex = 0;

var u;

//$(":focusable")


$(document).ready(function() {
  readFromBeginning();

  $(document).keydown(function(e) {
    if(e.key=="Escape") {
      setToPaused();
    } 

  $(document).on('keydown', function ( e ) {
    if ((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 'j') ) {
      console.log( "You pressed CTRL + J" );
      findNextHeading();
    }
    if ((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 'k') ) {
      console.log( "You pressed CTRL + K" );
    }
  });
});


  $("input,texarea").keydown(function(e) {
    var keytospeak = e.key;
    if(/[a-z0-9\s]/i.test(keytospeak)) {
      setToPaused();
      speak(keytospeak);
    }
  })
});

function setToPaused() {
  currentstate = "PAUSED";
  speechSynthesis.cancel();
}

function readFromBeginning() {
  allelements = $("*");
  currentelem_index = 0;

  currentstate = "READING";

  findTheNextOne();
}

/**
 *
 *  Finds and reads the next node starting from
 *  the current position.
 **/
function findTheNextOne() {
  do {
    var currentelem = allelements[currentelem_index];
    currentelem_index++;

    if(currentelem_index>100) {
      break;
    }
  } while(!doesItSpeak(currentelem));

  speakMe(currentelem);  
}

function findNextHeading() {
  var all = 'h1,h2,h3,h4,h5,h6';
  var currentelem = allelements[currentelem_index];
  var index;

  if(currentelem==null) {
    currentelem = $("body");
  }

  var afters = $(all).add(currentelem).each(function (i) {
    if ($(this).is(currentelem)) {
      index = i;
      return false; // quit looping early
    }
  }).slice(index + 1);

  speakMe(afters[1]);
}


function doesItSpeak(elem) {
  console.log($(elem)[0].tagName);

  if($(elem)[0].tagName == "A") {
    return true;
  }

  return false;
}

function speak(text) {
  u = new SpeechSynthesisUtterance(text);
  u.onend = function(event) {
    if(currentstate=="READING") {
      findTheNextOne();
    } else if(currentstate=="READONEBACK") {
      findThePreviousOne();
    }
  }
  speechSynthesis.speak(u); 
}

function speakMe(elem) {
  $(elem).focus();

  $('html, body').animate({
    scrollTop: $(elem).offset().top
  }, 200);

  speak($(elem).text())

  /*var u = new SpeechSynthesisUtterance("another thing"); //$(elem).text());
  u.onend = function(event) {
    console.log("onend event triggered")
    //findTheNextOne();
  }
  speechSynthesis.speak(u);*/
}