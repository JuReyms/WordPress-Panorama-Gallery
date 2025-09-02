// Panoramic image horizontal scroll with true proportional minimap navigation
(function(){
	const containers = document.querySelectorAll('.wp-block-w0-panorama-gallery__container');

	containers.forEach(function(container){
		const panoramaWrapper = container.querySelector('.wp-block-w0-panorama-gallery__panorama-wrapper');
		const panoramaScroll = container.querySelector('.wp-block-w0-panorama-gallery__panorama-scroll');
		const img = container.querySelector('.wp-block-w0-panorama-gallery__image');
		const minimapWrapper = container.querySelector('.wp-block-w0-panorama-gallery__minimap-wrapper');
		const minimap = container.querySelector('.wp-block-w0-panorama-gallery__minimap');
		const viewport = container.querySelector('.wp-block-w0-panorama-gallery__minimap-viewport');

		let isDragging = false;
		let startX = 0;
		let scrollLeft = 0;
		let isTouching = false;
		let touchStartX = 0;
		let touchScrollLeft = 0;

		let minimapDragging = false;
		let dragOffsetX = 0;
		const MINIMAP_HEIGHT = minimap ? minimap.height : 40;

		let lastMinimapWidth = undefined;

		function updateMinimapDimensions() {
			if (!img || !minimap || !minimapWrapper) return;
			const naturalW = img.naturalWidth || img.width || 1;
			const naturalH = img.naturalHeight || img.height || 1;
			const ratio = naturalW / naturalH;
			const width = Math.round(MINIMAP_HEIGHT * ratio);
			minimap.width = width;
			minimap.height = MINIMAP_HEIGHT;
			minimap.style.width = width + 'px';
			minimap.style.height = MINIMAP_HEIGHT + 'px';
			minimapWrapper.style.height = MINIMAP_HEIGHT + 'px';
			// la largeur du wrapper colle le canvas pour ne pas fausser la navigation
			minimapWrapper.style.width = width + 'px';
			lastMinimapWidth = width;
		}

		function drawMinimap() {
			if(!minimap || !img) return;
			const ctx = minimap.getContext('2d');
			ctx.clearRect(0,0,minimap.width,minimap.height);
			ctx.drawImage(img, 0, 0, minimap.width, minimap.height);
		}

		function syncViewport() {
			if (!img || !minimap || !viewport || !panoramaWrapper) return;
			const scrollElm = panoramaWrapper;
			const renderW = img.offsetWidth;
			const visibleW = scrollElm.clientWidth;
			const scrollLeftVal = scrollElm.scrollLeft;
			const minimapW = minimap.width;

			const visibleRatio = visibleW / renderW;
			const totalScrollable = renderW - visibleW;
			const scrollLeftPercent = totalScrollable > 0 ? scrollLeftVal / totalScrollable : 0;
			const viewportWidth = minimapW * visibleRatio;
			const viewportLeft = scrollLeftPercent * (minimapW - viewportWidth);

			viewport.style.width = viewportWidth + 'px';
			viewport.style.left = viewportLeft + 'px';
			viewport.style.height = minimap.height + 'px';
		}

		function setPanoramaScrollByMinimap(x) {
			if (!img || !panoramaWrapper || !minimap) return;
			const minimapWidth = minimap.width;
			const renderW = img.offsetWidth;
			const visibleW = panoramaWrapper.clientWidth;

			const visibleRatio = visibleW / renderW;
			const viewportWidth = minimapWidth * visibleRatio;
			const clampX = Math.max(0, Math.min(minimapWidth - viewportWidth, x - viewportWidth/2));
			const scrollLeftPercent = (clampX) / (minimapWidth - viewportWidth);
			const totalScrollable = renderW - visibleW;
			const scrollLeftVal = totalScrollable > 0 ? scrollLeftPercent * totalScrollable : 0;
			panoramaWrapper.scrollLeft = scrollLeftVal;
			syncViewport();
		}

		// DRAG main panorama
		panoramaWrapper.addEventListener('mousedown', function(e) {
			isDragging = true;
			panoramaWrapper.classList.add('is-dragging');
			startX = e.pageX - panoramaWrapper.offsetLeft;
			scrollLeft = panoramaWrapper.scrollLeft;
		});
		window.addEventListener('mouseup', function(){
			isDragging = false;
			panoramaWrapper.classList.remove('is-dragging');
		});
		window.addEventListener('mousemove', function(e){
			if (!isDragging) return;
			e.preventDefault();
			const x = e.pageX - panoramaWrapper.offsetLeft;
			const walk = (startX - x);
			panoramaWrapper.scrollLeft = scrollLeft + walk;
			syncViewport();
		});

		panoramaWrapper.addEventListener('wheel', function(evt){
			if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
				panoramaWrapper.scrollLeft += evt.deltaY;
				evt.preventDefault();
			}
			syncViewport();
		}, { passive: false });

		panoramaWrapper.addEventListener('touchstart', function(evt){
			if(evt.touches.length !== 1) return;
			isTouching = true;
			touchStartX = evt.touches[0].pageX;
			touchScrollLeft = panoramaWrapper.scrollLeft;
		});
		panoramaWrapper.addEventListener('touchmove', function(evt){
			if(!isTouching) return;
			const x = evt.touches[0].pageX;
			const walk = (touchStartX - x);
			panoramaWrapper.scrollLeft = touchScrollLeft + walk;
			syncViewport();
		});
		panoramaWrapper.addEventListener('touchend', function(){
			isTouching = false;
		});

		// Minimap drag/click/touch
		minimap.addEventListener('mousedown', function(e) {
			minimapDragging = true;
			const rect = minimap.getBoundingClientRect();
			dragOffsetX = e.clientX - rect.left;
			setPanoramaScrollByMinimap(dragOffsetX);
			viewport && (viewport.style.pointerEvents = 'none');
			document.body.style.userSelect = 'none';
		});
		window.addEventListener('mousemove', function(e) {
			if (!minimapDragging) return;
			const rect = minimap.getBoundingClientRect();
			const x = e.clientX - rect.left;
			setPanoramaScrollByMinimap(x);
		});
		window.addEventListener('mouseup', function(){
			if (minimapDragging) {
				minimapDragging = false;
				viewport && (viewport.style.pointerEvents = 'auto');
				document.body.style.userSelect = '';
			}
		});

		minimap.addEventListener('touchstart', function(e){
			if(!e.touches || !e.touches.length) return;
			minimapDragging = true;
			const rect = minimap.getBoundingClientRect();
			dragOffsetX = e.touches[0].clientX - rect.left;
			setPanoramaScrollByMinimap(dragOffsetX);
			viewport && (viewport.style.pointerEvents = 'none');
			document.body.style.userSelect = 'none';
		});
		minimap.addEventListener('touchmove', function(e){
			if (!minimapDragging) return;
			const rect = minimap.getBoundingClientRect();
			const x = e.touches[0].clientX - rect.left;
			setPanoramaScrollByMinimap(x);
			e.preventDefault();
		});
		window.addEventListener('touchend', function(){
			if (minimapDragging) {
				minimapDragging = false;
				viewport && (viewport.style.pointerEvents = 'auto');
				document.body.style.userSelect = '';
			}
		});

		minimap.addEventListener('click', function(e) {
			if (minimapDragging) return;
			const rect = minimap.getBoundingClientRect();
			const x = (e.clientX - rect.left);
			setPanoramaScrollByMinimap(x);
		});

		function updateAll(){
			if(!minimap || !img) return;
			updateMinimapDimensions();
			drawMinimap();
			syncViewport();
		}
		if(img.complete) updateAll();
		img.addEventListener('load', updateAll);
		window.addEventListener('resize', updateAll);
		panoramaWrapper.addEventListener('scroll', syncViewport);
		setTimeout(updateAll, 150);
	});
})();