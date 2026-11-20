/**
 * Panorama Gallery : comportement sur le site.
 *
 * Chaque panorama est traité à part (aucun identifiant partagé) :
 * - molette verticale changée en défilement horizontal, sauf aux bords,
 *   où la page reprend la main ;
 * - glisser à la souris ;
 * - glisser au doigt : défilement natif du navigateur ;
 * - clavier sur la zone défilante : flèches, Page préc./suiv., Début, Fin ;
 * - boutons ‹ › (souris) et fondus sur les bords où il reste de l'image ;
 * - miniature cliquable et glissable, qui suit la position.
 * Sans JavaScript, la zone reste défilable nativement.
 */
( function () {
	'use strict';

	var ROOT = '.wp-block-w0-panorama-gallery__container';
	var MINIMAP_MAX_HEIGHT = 40;
	var motion = window.matchMedia
		? window.matchMedia( '(prefers-reduced-motion: reduce)' )
		: null;

	function scrollBehavior() {
		return motion && motion.matches ? 'auto' : 'smooth';
	}

	function init( root ) {
		if ( root.getAttribute( 'data-panorama-ready' ) ) {
			return;
		}
		var scroller = root.querySelector( '.wp-block-w0-panorama-gallery__panorama-wrapper' );
		var img = root.querySelector( '.wp-block-w0-panorama-gallery__image' );
		if ( ! scroller || ! img ) {
			return;
		}
		root.setAttribute( 'data-panorama-ready', '1' );

		var mapWrap = root.querySelector( '.wp-block-w0-panorama-gallery__minimap-wrapper' );
		var canvas = root.querySelector( '.wp-block-w0-panorama-gallery__minimap' );
		var frame = root.querySelector( '.wp-block-w0-panorama-gallery__minimap-viewport' );
		var mapWidth = 0;
		var pending = false;

		function maxScroll() {
			return Math.max( 0, scroller.scrollWidth - scroller.clientWidth );
		}

		/* Molette ------------------------------------------------------ */
		scroller.addEventListener(
			'wheel',
			function ( e ) {
				if ( e.ctrlKey || Math.abs( e.deltaY ) <= Math.abs( e.deltaX ) ) {
					return; // zoom, ou défilement horizontal natif (pavé tactile)
				}
				var max = maxScroll();
				if ( max <= 0 ) {
					return;
				}
				var factor = 1;
				if ( e.deltaMode === 1 ) {
					factor = 40;
				} else if ( e.deltaMode === 2 ) {
					factor = scroller.clientWidth;
				}
				var delta = e.deltaY * factor;
				var x = scroller.scrollLeft;
				if ( ( delta < 0 && x <= 0 ) || ( delta > 0 && x >= max - 1 ) ) {
					return; // bord atteint : la page défile
				}
				e.preventDefault();
				scroller.scrollLeft = x + delta;
			},
			{ passive: false }
		);

		/* Glisser à la souris (le doigt utilise le défilement natif) -- */
		var drag = null;
		scroller.addEventListener( 'pointerdown', function ( e ) {
			if ( e.pointerType !== 'mouse' || e.button !== 0 || maxScroll() <= 0 ) {
				return;
			}
			if ( e.clientY - scroller.getBoundingClientRect().top >= scroller.clientHeight ) {
				return; // clic sur la barre de défilement : comportement natif
			}
			drag = { x: e.clientX, left: scroller.scrollLeft, id: e.pointerId };
			scroller.classList.add( 'is-dragging' );
		} );
		scroller.addEventListener( 'pointermove', function ( e ) {
			if ( ! drag || e.pointerId !== drag.id ) {
				return;
			}
			if ( ! drag.captured ) {
				drag.captured = true;
				try {
					scroller.setPointerCapture( e.pointerId );
				} catch ( err ) {
					// pointeur déjà relâché : on continue sans capture
				}
			}
			scroller.scrollLeft = drag.left - ( e.clientX - drag.x );
		} );
		function endDrag() {
			drag = null;
			scroller.classList.remove( 'is-dragging' );
		}
		scroller.addEventListener( 'pointerup', endDrag );
		scroller.addEventListener( 'pointercancel', endDrag );
		scroller.addEventListener( 'lostpointercapture', endDrag );

		/* Clavier ------------------------------------------------------ */
		scroller.addEventListener( 'keydown', function ( e ) {
			if ( e.altKey || e.ctrlKey || e.metaKey ) {
				return;
			}
			var width = scroller.clientWidth;
			var step = Math.max( 40, Math.round( width * 0.2 ) );
			var target = null;
			switch ( e.key ) {
				case 'ArrowRight':
					target = scroller.scrollLeft + step;
					break;
				case 'ArrowLeft':
					target = scroller.scrollLeft - step;
					break;
				case 'PageDown':
					target = scroller.scrollLeft + width * 0.9;
					break;
				case 'PageUp':
					target = scroller.scrollLeft - width * 0.9;
					break;
				case 'Home':
					target = 0;
					break;
				case 'End':
					target = maxScroll();
					break;
			}
			if ( target === null ) {
				return;
			}
			e.preventDefault();
			scroller.scrollTo( { left: target, behavior: scrollBehavior() } );
		} );

		/* Boutons ‹ › et fondus ------------------------------------------ */
		var stage = root.querySelector( '.wp-block-w0-panorama-gallery__stage' );
		var prev = null;
		var next = null;

		function makeButton( direction ) {
			var button = document.createElement( 'button' );
			button.type = 'button';
			button.className =
				'wp-block-w0-panorama-gallery__nav wp-block-w0-panorama-gallery__nav--' + direction;
			// Doublon souris des flèches du clavier, déjà disponibles sur la zone :
			// hors de l'ordre de tabulation et masqué aux lecteurs d'écran.
			button.tabIndex = -1;
			button.setAttribute( 'aria-hidden', 'true' );
			button.hidden = true;
			button.innerHTML =
				'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="' +
				( direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7' ) +
				'"/></svg>';
			button.addEventListener( 'click', function () {
				var sign = direction === 'prev' ? -1 : 1;
				scroller.scrollTo( {
					left: scroller.scrollLeft + sign * scroller.clientWidth * 0.8,
					behavior: scrollBehavior(),
				} );
			} );
			stage.appendChild( button );
			return button;
		}

		if ( stage ) {
			prev = makeButton( 'prev' );
			next = makeButton( 'next' );
		}

		function syncEdges() {
			if ( ! stage ) {
				return;
			}
			var max = maxScroll();
			var atStart = scroller.scrollLeft <= 1;
			var atEnd = scroller.scrollLeft >= max - 1;
			stage.classList.toggle( 'has-more-start', max > 0 && ! atStart );
			stage.classList.toggle( 'has-more-end', max > 0 && ! atEnd );
			prev.hidden = max <= 0 || atStart;
			next.hidden = max <= 0 || atEnd;
		}

		/* Miniature ---------------------------------------------------- */
		function syncFrame() {
			pending = false;
			syncEdges();
			if ( ! frame || ! mapWidth ) {
				return;
			}
			var total = scroller.scrollWidth || 1;
			frame.style.width = ( scroller.clientWidth / total ) * mapWidth + 'px';
			frame.style.transform =
				'translateX(' + ( scroller.scrollLeft / total ) * mapWidth + 'px)';
		}

		function requestSync() {
			if ( ! pending ) {
				pending = true;
				window.requestAnimationFrame( syncFrame );
			}
		}

		function layoutMap() {
			if ( ! mapWrap || ! canvas || ! frame ) {
				return;
			}
			var nw = img.naturalWidth;
			var nh = img.naturalHeight;
			if ( ! nw || ! nh || maxScroll() <= 0 ) {
				mapWrap.hidden = true;
				mapWidth = 0;
				syncEdges();
				return;
			}
			var ratio = nw / nh;
			var width = Math.min( Math.round( MINIMAP_MAX_HEIGHT * ratio ), root.clientWidth );
			var height = Math.max( 1, Math.round( width / ratio ) );
			var dpr = window.devicePixelRatio || 1;

			mapWrap.hidden = false;
			mapWrap.style.width = width + 'px';
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			canvas.width = Math.round( width * dpr );
			canvas.height = Math.round( height * dpr );
			var ctx = canvas.getContext( '2d' );
			if ( ctx ) {
				ctx.drawImage( img, 0, 0, canvas.width, canvas.height );
			}
			mapWidth = width;
			syncFrame();
		}

		function scrollFromMap( clientX, behavior ) {
			if ( ! mapWidth ) {
				return;
			}
			var rect = canvas.getBoundingClientRect();
			var ratio = ( clientX - rect.left ) / rect.width;
			var left = ratio * scroller.scrollWidth - scroller.clientWidth / 2;
			scroller.scrollTo( { left: left, behavior: behavior } );
		}

		if ( mapWrap && canvas ) {
			var mapDrag = null;
			mapWrap.addEventListener( 'pointerdown', function ( e ) {
				if ( e.button !== 0 ) {
					return;
				}
				mapDrag = e.pointerId;
				try {
					mapWrap.setPointerCapture( e.pointerId );
				} catch ( err ) {
					// sans capture, le glisser s'arrête en sortant de la miniature
				}
				scrollFromMap( e.clientX, 'auto' );
			} );
			mapWrap.addEventListener( 'pointermove', function ( e ) {
				if ( mapDrag === e.pointerId ) {
					scrollFromMap( e.clientX, 'auto' );
				}
			} );
			var endMapDrag = function () {
				mapDrag = null;
			};
			mapWrap.addEventListener( 'pointerup', endMapDrag );
			mapWrap.addEventListener( 'pointercancel', endMapDrag );
		}

		scroller.addEventListener( 'scroll', requestSync, { passive: true } );

		if ( img.complete && img.naturalWidth ) {
			layoutMap();
		} else {
			img.addEventListener( 'load', layoutMap );
		}

		if ( 'ResizeObserver' in window ) {
			new window.ResizeObserver( function () {
				layoutMap();
			} ).observe( root );
		} else {
			window.addEventListener( 'resize', layoutMap );
		}
	}

	function initAll() {
		var roots = document.querySelectorAll( ROOT );
		for ( var i = 0; i < roots.length; i++ ) {
			init( roots[ i ] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAll );
	} else {
		initAll();
	}
} )();
