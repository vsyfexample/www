	$(document).ready(function() {
	$(".burger, .menu").click(function(){
		$(this).parent().find(".hide").slideToggle();
		$(".header_title").slideToggle();
		$(".header_subtitle").slideToggle();
	});
});