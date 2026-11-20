/**
 * Panorama Gallery : éditeur des deux blocs.
 *
 * Sans étape de construction : JavaScript simple sur les paquets globaux de
 * WordPress. Le rendu du site est fait en PHP (includes/render.php).
 *
 * Les fonctions save reproduisent à l'identique le HTML déjà enregistré dans
 * les articles, pour qu'aucun bloc existant ne soit déclaré invalide.
 */
( function ( wp ) {
	'use strict';

	var el = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var __ = wp.i18n.__;
	var blocks = wp.blocks;
	var be = wp.blockEditor;
	var c = wp.components;
	var TEXT_DOMAIN = 'panorama-gallery-block-wp';

	function mediaToImage( media ) {
		var url = media.url;
		if ( media.sizes && media.sizes.full && media.sizes.full.url ) {
			url = media.sizes.full.url;
		}
		return { id: media.id, url: url, alt: media.alt || '' };
	}

	/**
	 * Fabrique le composant d'édition à partir de deux adaptateurs :
	 * getImage( attributes ) -> { id, url, alt } et toAttributes( image ).
	 */
	function makeEdit( getImage, toAttributes ) {
		return function PanoramaEdit( props ) {
			var image = getImage( props.attributes );
			var blockProps = be.useBlockProps( {
				className: 'wp-block-w0-panorama-gallery__container',
			} );

			function onSelect( media ) {
				if ( ! media || ! media.url ) {
					return;
				}
				props.setAttributes( toAttributes( mediaToImage( media ) ) );
			}

			if ( ! image.url ) {
				return el(
					'div',
					blockProps,
					el( be.MediaPlaceholder, {
						icon: 'format-image',
						labels: {
							title: __( 'Panorama', TEXT_DOMAIN ),
							instructions: __(
								'Choisissez une image très large dans la médiathèque, ou téléversez-la.',
								TEXT_DOMAIN
							),
						},
						accept: 'image/*',
						allowedTypes: [ 'image' ],
						multiple: false,
						onSelect: onSelect,
					} )
				);
			}

			return el(
				Fragment,
				null,
				el(
					be.BlockControls,
					{ group: 'other' },
					el( be.MediaReplaceFlow, {
						mediaId: image.id,
						mediaURL: image.url,
						allowedTypes: [ 'image' ],
						accept: 'image/*',
						onSelect: onSelect,
						name: __( 'Remplacer', TEXT_DOMAIN ),
					} )
				),
				el(
					be.InspectorControls,
					null,
					el(
						c.PanelBody,
						{ title: __( 'Image', TEXT_DOMAIN ) },
						el( c.TextareaControl, {
							label: __( 'Texte alternatif', TEXT_DOMAIN ),
							help: __(
								'Décrit le panorama pour les lecteurs d’écran. Vide : on reprend celui de la médiathèque.',
								TEXT_DOMAIN
							),
							value: image.alt || '',
							onChange: function ( value ) {
								props.setAttributes(
									toAttributes( {
										id: image.id,
										url: image.url,
										alt: value,
									} )
								);
							},
							__nextHasNoMarginBottom: true,
						} )
					)
				),
				el(
					'figure',
					blockProps,
					el(
						'div',
						{ className: 'wp-block-w0-panorama-gallery__panorama-wrapper' },
						el(
							'div',
							{ className: 'wp-block-w0-panorama-gallery__panorama-scroll' },
							el( 'img', {
								src: image.url,
								alt: image.alt || '',
								className: 'wp-block-w0-panorama-gallery__image',
								draggable: false,
							} )
						)
					)
				)
			);
		};
	}

	/* -----------------------------------------------------------------
	 * w0/panorama-gallery
	 * --------------------------------------------------------------- */
	function getW0Image( attributes ) {
		return attributes.image || {};
	}

	function w0ToAttributes( image ) {
		return { image: { id: image.id, url: image.url, alt: image.alt || '' } };
	}

	// HTML de la version 1.0.0, à l'identique (y compris la classe qui
	// remplace celles de useBlockProps.save()).
	function saveW0( props ) {
		var image = props.attributes.image || {};
		if ( ! image.url ) {
			return null;
		}
		var figureProps = Object.assign( {}, be.useBlockProps.save(), {
			className: 'wp-block-w0-panorama-gallery__container',
		} );
		return el(
			'figure',
			figureProps,
			el(
				'div',
				{ className: 'wp-block-w0-panorama-gallery__panorama-wrapper' },
				el(
					'div',
					{ className: 'wp-block-w0-panorama-gallery__panorama-scroll' },
					el( 'img', {
						src: image.url,
						alt: image.alt || '',
						className: 'wp-block-w0-panorama-gallery__image',
						draggable: false,
					} )
				)
			),
			el(
				'div',
				{ className: 'wp-block-w0-panorama-gallery__minimap-wrapper' },
				el( 'canvas', {
					className: 'wp-block-w0-panorama-gallery__minimap',
					height: '40',
				} ),
				el( 'div', {
					className: 'wp-block-w0-panorama-gallery__minimap-viewport',
				} )
			)
		);
	}

	blocks.registerBlockType( 'w0/panorama-gallery', {
		edit: makeEdit( getW0Image, w0ToAttributes ),
		save: saveW0,
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					isMatch: function ( attributes ) {
						return !! attributes.url;
					},
					transform: function ( attributes ) {
						return blocks.createBlock( 'w0/panorama-gallery', {
							image: {
								id: attributes.id,
								url: attributes.url,
								alt: attributes.alt || '',
							},
						} );
					},
				},
			],
		},
	} );

	/* -----------------------------------------------------------------
	 * lfg-block-custom/lfg-block-panorama (ancien bloc, articles existants)
	 * --------------------------------------------------------------- */
	function getLfgImage( attributes ) {
		return {
			id: attributes.pictureID,
			url: attributes.pictureURL,
			alt: attributes.pictureAlt,
		};
	}

	function lfgToAttributes( image ) {
		return {
			pictureID: image.id,
			pictureURL: image.url,
			pictureAlt: image.alt || '',
		};
	}

	// HTML enregistré par lfg-block-custom 0.1.0, à l'identique.
	function saveLfg( props ) {
		var a = props.attributes;
		if ( ! a.pictureID ) {
			return null;
		}
		return el(
			'section',
			{ className: 'lfg-panorama-section' },
			el(
				'div',
				{ className: 'blockImg', id: 'lfg-panorama-block' },
				el(
					'figure',
					be.useBlockProps.save(),
					el( 'img', { src: a.pictureURL, alt: a.pictureAlt } )
				)
			)
		);
	}

	blocks.registerBlockType( 'lfg-block-custom/lfg-block-panorama', {
		edit: makeEdit( getLfgImage, lfgToAttributes ),
		save: saveLfg,
		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'w0/panorama-gallery' ],
					transform: function ( attributes ) {
						return blocks.createBlock( 'w0/panorama-gallery', {
							image: {
								id: attributes.pictureID,
								url: attributes.pictureURL,
								alt: attributes.pictureAlt || '',
							},
						} );
					},
				},
			],
		},
	} );
} )( window.wp );
