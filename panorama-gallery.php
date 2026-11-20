<?php
/**
 * Plugin Name:       Panorama Gallery
 * Description:       Affiche une image panoramique défilable horizontalement (molette, glisser, doigt, clavier), avec une miniature de navigation. Reprend aussi l'ancien bloc « LFG Panorama » de lfg-block-custom.
 * Version:           2.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            La Ferme Graphique
 * Author URI:        https://www.lafermegraphique.fr/
 * Plugin URI:        https://www.lafermegraphique.fr/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       panorama-gallery-block-wp
 *
 * @package PanoramaGallery
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PANORAMA_GALLERY_VERSION', '2.0.0' );

require_once __DIR__ . '/includes/render.php';

/**
 * Enregistre les scripts et styles partagés par les deux blocs.
 * Les block.json les appellent par leur identifiant.
 */
function panorama_gallery_register_assets() {
	$url     = plugin_dir_url( __FILE__ ) . 'assets/';
	$version = PANORAMA_GALLERY_VERSION;

	wp_register_script(
		'panorama-gallery-editor',
		$url . 'editor.js',
		array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n' ),
		$version,
		true
	);
	wp_register_script(
		'panorama-gallery-view',
		$url . 'view.js',
		array(),
		$version,
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);
	wp_register_style( 'panorama-gallery', $url . 'style.css', array(), $version );
	wp_register_style( 'panorama-gallery-editor', $url . 'editor.css', array(), $version );
}

/**
 * Enregistre les deux blocs.
 *
 * Priorité 20 : si lfg-block-custom est encore active, son bloc panorama est
 * déjà enregistré (priorité 10). On le retire et on le remplace par le nôtre,
 * ce qui permet d'activer cette version avant de désactiver lfg-block-custom.
 */
function panorama_gallery_register_blocks() {
	panorama_gallery_register_assets();

	$registry = WP_Block_Type_Registry::get_instance();
	$blocks   = array(
		'w0/panorama-gallery'                 => 'panorama-gallery',
		'lfg-block-custom/lfg-block-panorama' => 'lfg-panorama',
	);

	foreach ( $blocks as $name => $folder ) {
		if ( $registry->is_registered( $name ) ) {
			$registry->unregister( $name );
		}
		// WordPress réutilise un style déjà enregistré sous le nom généré
		// pour ce bloc (celui de lfg-block-custom) au lieu du nôtre : on l'efface.
		foreach ( array( 'style', 'editorStyle' ) as $field ) {
			wp_deregister_style( generate_block_asset_handle( $name, $field ) );
		}
		foreach ( array( 'script', 'editorScript', 'viewScript' ) as $field ) {
			wp_deregister_script( generate_block_asset_handle( $name, $field ) );
		}
		register_block_type(
			__DIR__ . '/blocks/' . $folder,
			array( 'render_callback' => 'panorama_gallery_render_block' )
		);
	}
}
add_action( 'init', 'panorama_gallery_register_blocks', 20 );

/**
 * Retire l'ancien script de lfg-block-custom (js/panorama.js) tant que
 * l'extension est active : il cherche un identifiant qui n'existe plus.
 */
function panorama_gallery_dequeue_legacy_script() {
	wp_dequeue_script( 'lfg-panoramique' );
}
add_action( 'wp_enqueue_scripts', 'panorama_gallery_dequeue_legacy_script', 100 );
