(function() {
	var video = $('video.player'),
	player = $('.video-player'),
	playpause = $('.btn-play-pause'),
	playpauseIcon = $('.btn-play-pause .play-pause-icon')
	loader = {
		el: $('.play-slider'),
		full: $('.play-slider-all'),
		progress: $('.play-slider-progress'),
		isDragged: false
	},
	prev = $(),
	next = $(),
	title = $(),
	band = $(),
	volume = $();

	$('.wrapper').css('height', $(window).height());

	player.css('margin-top', $(window).height() * 0.1);

	var togglePlay = function() {
		if(!video.get(0).paused) {
			video.get(0).pause();
		} else {
			video.get(0).play();
		}
	};

	playpause.click(togglePlay);

	// Implementing the behaviour of the progress bar
	loader.el.on('mousedown', function(e) {
		var offsetLeft = loader.el.offset().left,
			clickPosLeft = e.pageX,
			width = loader.full.width();

			loader.isDragged = true;
			loader.progress.animate({width: clickPosLeft - offsetLeft}, 100);
			video.get(0).currentTime = video.get(0).duration * (clickPosLeft - offsetLeft) / width;	
	});

	loader.el.on('mousemove', function(e) {
		if(loader.isDragged) {
			var offsetLeft = loader.el.offset().left,
			clickPosLeft = e.pageX,
			width = loader.full.width();

			loader.progress.css('width',clickPosLeft - offsetLeft);
			video.get(0).currentTime = video.get(0).duration * (clickPosLeft - offsetLeft) / width;	
		}
	});

	loader.el.on('mouseup', function() {
		loader.isDragged = false;
	});

	loader.el.on('mouseleave', function() {
		if(loader.isDragged) {
			video.get(0).play();
		}
		loader.isDragged = false;
	});

	video.click(function() {
		togglePlay();
	});

	video.on('timeupdate', function() {
		var width = loader.full.width(),
			percent = video.get(0).currentTime / video.get(0).duration;

		loader.progress.animate({ width: width * percent }, 50);
	});

	var s = Snap('#play-pause-icon'),
		playSvg = Snap('#Play'),
		pauseSvg = Snap('#Pause');

		playSvg.click(function() {
			playSvg.animate({opacity: 0}, 200, mina.easeinout, function() {
				playSvg.attr('display', 'none');
			});
			pauseSvg.attr('display', 'block')
					.animate({opacity: 1}, 200, mina.easeinout);
		});
	
		pauseSvg.click(function() {
			pauseSvg.animate({opacity: 0}, 200, mina.easeinout, function() {
				pauseSvg.attr('display', 'none');
			});
			playSvg.attr('display', 'block').
					animate({opacity: 1}, 200, mina.easeinout);
		});


})();