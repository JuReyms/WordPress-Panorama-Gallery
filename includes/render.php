<?php
/**
 * Rendu serveur commun aux deux blocs panorama.
 *
 * Le HTML enregistré dans les articles n'est jamais modifié : il sert à la
 * validation dans l'éditeur et de secours si l'extension est désactivée.
 * Sur le site, ce rendu le remplace.
 *
 * @package PanoramaGallery
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Lit l'image d'un bloc : identifiant, adresse et texte alternatif.
 *
 * @param string $block_name Nom du bloc.
 * @param array  $attributes Attributs du commentaire de bloc.
 * @param string $content    HTML enregistré.
 * @return array{id:int,url:string,alt:string}
 */
function panorama_gallery_get_image( $block_name, $attributes, $content ) {
	$image = array(
		'id'  => 0,
		'url' => '',
		'alt' => '',
	);

	if ( 'lfg-block-custom/lfg-block-panorama' === $block_name ) {
		// pictureURL et pictureAlt sont lus dans le HTML : PHP ne les reçoit pas.
		$image['id'] = isset( $attributes['pictureID'] ) ? (int) $attributes['pictureID'] : 0;
		if ( $content && class_exists( 'WP_HTML_Tag_Processor' ) ) {
			$tags = new WP_HTML_Tag_Processor( $content );
			if ( $tags->next_tag( 'img' ) ) {
				$image['url'] = (string) $tags->get_attribute( 'src' );
				$image['alt'] = (string) $tags->get_attribute( 'alt' );
			}
		}
	} else {
		$data         = isset( $attributes['image'] ) && is_array( $attributes['image'] ) ? $attributes['image'] : array();
		$image['id']  = isset( $data['id'] ) ? (int) $data['id'] : 0;
		$image['url'] = isset( $data['url'] ) ? (string) $data['url'] : '';
		$image['alt'] = isset( $data['alt'] ) ? (string) $data['alt'] : '';
	}

	// Texte alternatif vide dans le bloc : on reprend celui de la médiathèque.
	if ( '' === trim( $image['alt'] ) && $image['id'] ) {
		$image['alt'] = (string) get_post_meta( $image['id'], '_wp_attachment_image_alt', true );
	}

	return $image;
}

/**
 * Rendu des blocs w0/panorama-gallery et lfg-block-custom/lfg-block-panorama.
 *
 * @param array    $attributes Attributs du bloc.
 * @param string   $content    HTML enregistré.
 * @param WP_Block $block      Instance du bloc.
 * @return string
 */
function panorama_gallery_render_block( $attributes, $content, $block ) {
	$name  = $block instanceof WP_Block ? $block->name : 'w0/panorama-gallery';
	$image = panorama_gallery_get_image( $name, $attributes, $content );

	$attachment = $image['id'] ? wp_get_attachment_metadata( $image['id'] ) : false;
	$has_file   = is_array( $attachment ) && ! empty( $attachment['width'] ) && ! empty( $attachment['height'] );

	if ( ! $has_file && '' === $image['url'] ) {
		return '';
	}

	$img_attributes = array(
		'class'     => 'wp-block-w0-panorama-gallery__image',
		'alt'       => $image['alt'],
		'loading'   => 'lazy',
		'decoding'  => 'async',
		'draggable' => 'false',
	);

	if ( $has_file ) {
		// Largeur affichée = hauteur du panorama × proportions. La hauteur vaut
		// clamp(180px, 34vw, 480px) (style.css) ; les navigateurs ne lisent pas
		// clamp() dans sizes, d'où les trois paliers.
		$ratio                   = $attachment['width'] / $attachment['height'];
		$img_attributes['sizes'] = sprintf(
			'(max-width: 529px) %1$dpx, (min-width: 1412px) %2$dpx, %3$svw',
			(int) round( 180 * $ratio ),
			(int) round( 480 * $ratio ),
			round( 34 * $ratio, 2 )
		);
		add_filter( 'max_srcset_image_width', 'panorama_gallery_srcset_max_width' );
		$img = wp_get_attachment_image( $image['id'], 'full', false, $img_attributes );
		remove_filter( 'max_srcset_image_width', 'panorama_gallery_srcset_max_width' );
	} else {
		$img = '';
	}

	if ( '' === $img ) {
		$img = sprintf(
			'<img src="%1$s" alt="%2$s" class="%3$s" loading="lazy" decoding="async" draggable="false" />',
			esc_url( $image['url'] ),
			esc_attr( $image['alt'] ),
			esc_attr( $img_attributes['class'] )
		);
	}

	$label = '' !== trim( $image['alt'] )
		/* translators: %s: texte alternatif de l'image. */
		? sprintf( __( 'Panorama : %s. Faire défiler avec les flèches gauche et droite.', 'panorama-gallery-block-wp' ), $image['alt'] )
		: __( 'Panorama. Faire défiler avec les flèches gauche et droite.', 'panorama-gallery-block-wp' );

	$wrapper = get_block_wrapper_attributes( array( 'class' => 'wp-block-w0-panorama-gallery__container' ) );

	return sprintf(
		'<figure %1$s><div class="wp-block-w0-panorama-gallery__stage"><div class="wp-block-w0-panorama-gallery__panorama-wrapper" tabindex="0" role="region" aria-label="%2$s"><div class="wp-block-w0-panorama-gallery__panorama-scroll">%3$s</div></div></div><div class="wp-block-w0-panorama-gallery__minimap-wrapper" aria-hidden="true" hidden><canvas class="wp-block-w0-panorama-gallery__minimap"></canvas><div class="wp-block-w0-panorama-gallery__minimap-viewport"></div></div></figure>',
		$wrapper,
		esc_attr( $label ),
		$img
	);
}
