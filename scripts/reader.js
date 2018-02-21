var selectedText = "";
var tagname = "";
var alttext = "";

$(document).ready(function() {

	$("*:not(body)").hover(

		function (ev) {
	    	$(this).addClass('highlight');
	    	selectedText = $(this).text();
	    	tagname = this.tagname;
	    	
			if($(this).attr('alt')) {
	    		alttext = $(this).attr('alt');
	    		console.log(alttext);
	    		if(alttext == "" || alttext == undefined) {
	    			alttext = "Could not find image description";
	    		}
	    		selectedText = alttext;
	    	}
	    	
	      	$(document).keydown(function(e) {
				var code;  
				if (e.keyCode) {
 					code = e.keyCode;
				} else if (e.which) {
 					code = e.which;
 				}
				if (code == 32) {
					
 					if (e.stopPropagation) {
 						e.stopPropagation();
 						e.preventDefault();
 					}

 					speechSynthesisObject = new SpeechSynthesisUtterance(selectedText);
 					speechSynthesis.speak(speechSynthesisObject);

 					return false;
				}

			});
	    },

	    function (ev) {
	      $(this).removeClass('highlight');
	      $(".highlight").removeClass('highlight');
	      speechSynthesis.cancel();
	    }
 	);
});




