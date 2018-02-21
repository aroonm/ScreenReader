$(document).on('keydown', function(e) {

	if(e.key == " ") {
		var firstparagraph = $("p")[0];
		var text = $(firstparagraph).text();

		var betterDisplay = $(" <div class='betterdisplay'></div> ");
		betterdisplay.text(text);

		
		
		e.preventDefault();
	}
}