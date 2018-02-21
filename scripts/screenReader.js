var _allelements = null;
var _currentelem_index = 0;
var _currentstate = "PAUSED";  // READING, READINGBACKWARD, READONEFORWARD, READONEBACK
var _currentElement = null;

// Header traversal related variables
var _currentHeader = null;
var allHeaders = 'h1,h2,h3,h4,h5,h6';
var prevHeaderIndex = 0;

// Focussable element traversal
var focusableElements = null;
var allFocusableElements = null;
var currentFocusableElemIndex = 0 ;

// Speech Utterance related variables
var u;

// Event Handler related variables
var isKeyPressEventFired = false;

function initialiseScreenReader() {
  _allelements = $("body > div > p,h1,h2,h3,img");
  allFocusableElements = $("*");
  _currentelem_index = 0;
  _currentstate = "READING";

  focusableElements = $("[href]");
}

$(document).ready(function() {
	// Initialise screen reader
	initialiseScreenReader();
     
    // Find next and previous header elements
  	$(document).on('keydown', function(e) {

  		// Detect keydown: Escape
  		if(e.key == "Escape") {
    		isKeyPressEventFired = true;
      		setToPaused();
      	}

      	// Detect keydown: ctrl+l and ctrl+shift+l
      	if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'l')) {
      		e.preventDefault();

      		if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'l') && (e.shiftKey)) {
      			console.log("control + shift + l");
      			_currentstate = "READALLBACKWARD";
      			if(!isKeyPressEventFired || true) {
            		isKeyPressEventFired = true;
            		findPreviousElement();
        		}
      		} 
      		else {
      			console.log("control + l");
      			_currentstate = "READALLFORWARD";
      			if(!isKeyPressEventFired || true) {
            		isKeyPressEventFired = true;
            		findNextElement();
        		}
      		}
      	}

      	// Detect keydown: ctrl+h and ctrl+shift+h
      	if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'h')) {
      		e.preventDefault();

      		if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'h') && (e.shiftKey)) {
      			console.log("control + shift + h");
      			_currentstate = "READHEADERBACKWARD";
      			if(!isKeyPressEventFired || true) {
            		isKeyPressEventFired = true;
            		findPreviousHeading();
        		}
      		} 
      		else {
      			console.log("control + h");
      			_currentstate = "READHEADERFORWARD";
      			if(!isKeyPressEventFired || true) {
            		isKeyPressEventFired = true;
            		findNextHeading();
        		}
      		}
      	}
      	
      	// Detect keydown: ctrl+j and ctrl+shift+j
    	if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'j') ) {
    		e.preventDefault();
    		if ((e.metaKey || e.ctrlKey) && (String.fromCharCode(e.which).toLowerCase() === 'j') && (e.shiftKey)) {
      			console.log("control + shift + j");
      			_currentstate = "READONEBACK";
      			if(!isKeyPressEventFired || true) {
            		isKeyPressEventFired = true;
            		findPreviousFocusableElement();
        		}
      		} 
      		else {
      			console.log("control + j");
      			_currentstate = "READING";
      			if(!isKeyPressEventFired || true) {
            		isKeyPressEventFired = true;
            		findNextFocusableElement();
        		}
      		}
    	}      		
  	});

  	// Detect keyup
  	$(document).on('keyup', function(e) {
		isKeyPressEventFired = false;
  	});

  	// Detect keydown in an 'input' field
    $("input, texarea").keydown(function(e) {
    	var keytospeak = e.key;
    	if(/[a-z0-9\s]/i.test(keytospeak)) {
      		_currentstate = "READINPUTFIELD";
      		speak(keytospeak);
    	}
  	});
});

function findNextHeading() {
   	var currentelem = _currentHeader;
   	var index;

   	if(currentelem == null) {
     	currentelem = $("body");
   	}

   	var afters = $(allHeaders).add(currentelem).each(function (i) {
     	if ($(this).is(currentelem)) {
       		index = i;
       		return false; // quit looping early
     	}
   	}).slice(index + 1);

	_currentHeader = afters[0];
  	speakMe(afters[0]);
}

function findPreviousHeading() {
   	var currentelem = _currentHeader;
   	var index;

   	if(currentelem == null) {
     	currentelem = $("body");
   	}

   	var afters = $(allHeaders).add(currentelem).each(function (i) {
     	if ($(this).is(currentelem)) {
       		index = i;
       		return false; // quit looping early
     	}
   	}).slice(index - 1);

   	if((index - 1) < 0) {
   		speak("No text found.");
   		_currentHeader = null;
   	} 
   	else {
		_currentHeader = afters[0];
		if(afters[0]) {
  			speakMe(afters[0]);
  		}
  	}
}

// Pause speech
function setToPaused() {
	_currentstate = "PAUSED";
  	speechSynthesis.cancel();
}

function speakMe(elementToSpeak) {
	console.log("entered speakme: "+elementToSpeak);
	if(elementToSpeak) {
		$(elementToSpeak).focus();

	  	$('html, body').animate( {
	    	scrollTop: $(elementToSpeak).offset().top
	  	}, 200);

	  	var alttext = null;
	  	if($(elementToSpeak).attr('alt')) {
	  		alttext = $(this).attr('alt');
	    	//console.log(alttext);
	    	if(alttext == "" || alttext == undefined) {
	    		alttext = "Could not find image description";
	    	}
	    	speak(alttext);
	  	} 
	  	else {
	  		console.log("entered speak block .. ");
	  		speak($(elementToSpeak).text());
	  	}

	  	
  	}
}

function speak(textToSpeak) {
	console.log("texttospeak: "+textToSpeak);

	if(textToSpeak == "" || textToSpeak == undefined) {
		console.log("empty text to speak");
		performActionBasedOnState();
	}

	console.log("check" + _currentstate);

	u = new SpeechSynthesisUtterance(textToSpeak);

	console.log(u);

	if(textToSpeak == "No text found.") {
		speechSynthesis.speak(u);
		setToPaused();
	}

	u.onend = function(event) {
		console.log(_currentstate);
		performActionBasedOnState();
    	// if(_currentstate == "READING") {
    	// 	findNextFocusableElement();
    	// } 
    	// else if(_currentstate == "READONEBACK") {
     //  		findPreviousFocusableElement();
    	// }
    	// else if(_currentstate == "READHEADERFORWARD") {
    	// 	findNextHeading();
    	// } 
    	// else if(_currentstate == "READHEADERBACKWARD") {
     //  		findPreviousHeading();
    	// }
    	// else if(_currentstate == "READALLFORWARD") {
    	// 	console.log("looks for next all elt.");
    	// 	findNextElement();
    	// }
    	// else if(_currentstate == "READALLBACKWARD") {
    	// 	findPreviousElement();
    	// }
    	// else if(_currentstate == "READINPUTFIELD") {
    	// 	// do nothing
    	// }
    	// else if(_currentstate == "PAUSED") {
    	// 	setToPaused();
    	// }
  	}
  	speechSynthesis.speak(u); 
}

function performActionBasedOnState() {
	if(_currentstate == "READING") {
    	findNextFocusableElement();
    } 
	else if(_currentstate == "READONEBACK") {
  		findPreviousFocusableElement();
	}
	else if(_currentstate == "READHEADERFORWARD") {
		findNextHeading();
	} 
	else if(_currentstate == "READHEADERBACKWARD") {
  		findPreviousHeading();
	}
	else if(_currentstate == "READALLFORWARD") {
		console.log("looks for next all elt.");
		findNextElement();
	}
	else if(_currentstate == "READALLBACKWARD") {
		findPreviousElement();
	}
	else if(_currentstate == "READINPUTFIELD") {
		// do nothing
	}
	else if(_currentstate == "PAUSED") {
		setToPaused();
	}
}

function findPreviousFocusableElement() {
	do {
		currentFocusableElemIndex--;
		var currentelem = focusableElements[currentFocusableElemIndex];
   		

   		if(currentFocusableElemIndex < -1) {
   			speak("No text found.");
   			currentelem = null;
     		break;
   		}
 	} 
 	while(!isFocusable(currentelem));

 	speakMe(currentelem);
}

function findNextFocusableElement() {
	do {
		currentFocusableElemIndex++;
		var currentelem = focusableElements[currentFocusableElemIndex];
   		

   		if(currentFocusableElemIndex >= focusableElements.length) {
     		break;
   		}
 	} 
 	while(!isFocusable(currentelem));

 	speakMe(currentelem);
}

function isFocusable(elem) {
	if(elem) {
		for(var i=0; i<focusableElements.length; i++) {
			if(focusableElements[i].tagName == $(elem)[0].tagName) {
				return true;
			}
		}
  	}
  	return false;
}

function findNextElement() {
	do {
		console.log("current ind: "+_currentelem_index);
		_currentelem_index++;
		var currentelem = _allelements[_currentelem_index];
   		

   		if(_currentelem_index >= _allelements.length) {
   			console.log("oops end reached");
     		break;
   		}
 	} 
 	while(!isElementAvailable(currentelem));
console.log("ready to speak me: "+currentelem);
 	speakMe(currentelem);
}

function findPreviousElement() {
	do {
		console.log("current ind: "+_currentelem_index);
		_currentelem_index--;
		var currentelem = _allelements[_currentelem_index];
   		

   		if(_currentelem_index < -1) {
   			speak("No text found.");
   			currentelem = null;
     		break;
   		}
 	} 
 	while(!isElementAvailable(currentelem));

	console.log("ready to speak me");
 	speakMe(currentelem);
}

function isElementAvailable(elem) {

	console.log("elt available: " + elem);
	if(elem) {
		console.log("ret = true");
		return true;
	}
	console.log("ret = false");
	return false;
}
























