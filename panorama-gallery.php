<?php
/**
 * Plugin Name:       Panorama Gallery
 * Description:       Block to elegantly display panorama images with thumbnail navigation. Offers smooth horizontal scrolling via mouse wheel on desktop and swipe navigation on mobile.
 * Version:           1.0.0
 * Author:            La Ferme Graphique
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Author URI: https://www.lafermegraphique.fr/
 * Plugin URI: https://www.lafermegraphique.fr/
 * Text Domain:       panorama-gallery-block-wp
 *
 * @package PanoramaGallery
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function panorama_gallery_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'panorama_gallery_block_init' );
	