// eslint-disable-next-line no-undef
$(window).load(function(){
	var height = window.innerHeight,
  x= 0, y= height/2,
	curveX = 10,
	curveY = 0,
	targetX = 0,
	xitteration = 0,
	yitteration = 0,
	menuExpanded = false;
	
	// eslint-disable-next-line no-unused-expressions, no-undef
	blob = $('#blob'),
	// eslint-disable-next-line no-undef
	blobPath = $('#blob-path'),

	// eslint-disable-next-line no-undef
	hamburger = $('.hamburger');

	// eslint-disable-next-line no-undef
	$(this).on('mousemove', function(e){
		x = e.pageX;
		
		y = e.pageY;
	});

	// eslint-disable-next-line no-undef
	$('.hamburger, .menu-inner').on('mouseenter', function(){
		// eslint-disable-next-line no-undef
		$(this).parent().addClass('expanded');
		menuExpanded = true;
	});

	// eslint-disable-next-line no-undef
	$('.menu-inner').on('mouseleave', function(){
		menuExpanded = false;
		// eslint-disable-next-line no-undef
		$(this).parent().removeClass('expanded');
	});

	function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
	}

	var hoverZone = 150;
	var expandAmount = 20;
	
	function svgCurve() {
		if ((curveX > x-1) && (curveX < x+1)) {
			xitteration = 0;
		} else {
			if (menuExpanded) {
				targetX = 0;
			} else {
				xitteration = 0;
				if (x > hoverZone) {
					targetX = 0;
				} else {
					targetX = -(((60+expandAmount)/100)*(x-hoverZone));
				}			
			}
			xitteration++;
		}

		if ((curveY > y-1) && (curveY < y+1)) {
			yitteration = 0;
		} else {
			yitteration = 0;
			yitteration++;	
		}

		curveX = easeOutExpo(xitteration, curveX, targetX-curveX, 100);
		curveY = easeOutExpo(yitteration, curveY, y-curveY, 100);

		var anchorDistance = 200;
		var curviness = anchorDistance - 40;

		var newCurve2 = "M60,"+height+"H0V0h60v"+(curveY-anchorDistance)+"c0,"+curviness+","+curveX+","+curviness+","+curveX+","+anchorDistance+"S60,"+(curveY)+",60,"+(curveY+(anchorDistance*2))+"V"+height+"z";

		// eslint-disable-next-line no-undef
		blobPath.attr('d', newCurve2);

		// eslint-disable-next-line no-undef
		blob.width(curveX+60);

		// eslint-disable-next-line no-undef
		hamburger.css('transform', 'translate('+curveX+'px, '+curveY+'px)');
    
    // eslint-disable-next-line no-undef
    $('h2').css('transform', 'translateY('+curveY+'px)');
		window.requestAnimationFrame(svgCurve);
	}

	window.requestAnimationFrame(svgCurve);
	
});