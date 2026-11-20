<?php
/**
 * Panoramas en pleine définition.
 *
 * WordPress réduit toute image de plus de 2 560 px à 2 560 px au
 * téléversement : un panorama de 8 000 × 1 000 devient 2 560 × 320 et paraît
 * flou une fois affiché sur 400 px de haut. Pour les images très larges, on
 * relève cette limite et on ajoute une taille intermédiaire de 4 096 px.
 *
 * Ne concerne que les images téléversées après l'activation.
 *
 * @package PanoramaGallery
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Rapport largeur / hauteur à partir duquel une image est un panorama. */
const PANORAMA_GALLERY_MIN_RATIO = 3;

/** Taille intermédiaire ajoutée aux panoramas. */
const PANORAMA_GALLERY_LARGE_SIZE = 'panorama-gallery-4096';

/**
 * Indique si des dimensions sont celles d'un panorama.
 *
 * @param int $width  Largeur.
 * @param int $height Hauteur.
 * @return bool
 */
function panorama_gallery_is_panorama( $width, $height ) {
	return $width > 0 && $height > 0 && ( $width / $height ) >= PANORAMA_GALLERY_MIN_RATIO;
}

/**
 * Largeur maximale gardée pour un panorama (8 192 px par défaut).
 *
 * @return int
 */
function panorama_gallery_max_width() {
	/**
	 * Filtre la largeur maximale d'un panorama téléversé.
	 *
	 * @param int $max_width Largeur en pixels.
	 */
	return (int) apply_filters( 'panorama_gallery_max_width', 8192 );
}

/**
 * Relève la limite de réduction pour les panoramas.
 *
 * @param int|false $threshold Limite en pixels.
 * @param array     $imagesize Largeur et hauteur de l'image envoyée.
 * @return int|false
 */
function panorama_gallery_big_image_threshold( $threshold, $imagesize ) {
	if ( ! $threshold || ! is_array( $imagesize ) || ! panorama_gallery_is_panorama( (int) $imagesize[0], (int) $imagesize[1] ) ) {
		return $threshold;
	}
	return max( (int) $threshold, panorama_gallery_max_width() );
}
add_filter( 'big_image_size_threshold', 'panorama_gallery_big_image_threshold', 10, 2 );

/**
 * Ajoute une taille de 4 096 px de large aux seuls panoramas, entre les
 * 2 048 px de WordPress et l'image pleine.
 *
 * @param array $sizes    Tailles à générer.
 * @param array $metadata Métadonnées de l'image.
 * @return array
 */
function panorama_gallery_add_large_size( $sizes, $metadata ) {
	$width  = isset( $metadata['width'] ) ? (int) $metadata['width'] : 0;
	$height = isset( $metadata['height'] ) ? (int) $metadata['height'] : 0;
	if ( panorama_gallery_is_panorama( $width, $height ) && $width > 4096 ) {
		$sizes[ PANORAMA_GALLERY_LARGE_SIZE ] = array(
			'width'  => 4096,
			'height' => 0,
			'crop'   => false,
		);
	}
	return $sizes;
}
add_filter( 'intermediate_image_sizes_advanced', 'panorama_gallery_add_large_size', 10, 2 );

/**
 * Laisse entrer dans srcset les tailles de plus de 2 048 px (limite de
 * WordPress), le temps de rendre un bloc panorama.
 *
 * @return int
 */
function panorama_gallery_srcset_max_width() {
	return panorama_gallery_max_width();
}
