<?php
/**
 * Filtre Panorama dans la liste des articles.
 *
 * @package PanoramaGallery
 */

defined( 'ABSPATH' ) || exit;

function panorama_gallery_article_filter() {
	$value = $_GET['lfg_panorama'] ?? ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Filtre de lecture.
	return in_array( $value, array( 'with', 'without' ), true ) ? $value : '';
}

function panorama_gallery_render_article_filter( $post_type, $which ) {
	if ( 'post' !== $post_type || 'top' !== $which ) {
		return;
	}
	$value = panorama_gallery_article_filter();
	?>
	<label class="screen-reader-text" for="lfg-panorama-filter"><?php esc_html_e( 'Filtrer par panorama', 'panorama-gallery-block-wp' ); ?></label>
	<select id="lfg-panorama-filter" name="lfg_panorama">
		<option value=""><?php esc_html_e( 'Tous les articles', 'panorama-gallery-block-wp' ); ?></option>
		<option value="with" <?php selected( $value, 'with' ); ?>><?php esc_html_e( 'Avec un bloc Panorama', 'panorama-gallery-block-wp' ); ?></option>
		<option value="without" <?php selected( $value, 'without' ); ?>><?php esc_html_e( 'Sans bloc Panorama', 'panorama-gallery-block-wp' ); ?></option>
	</select>
	<?php
}
add_action( 'restrict_manage_posts', 'panorama_gallery_render_article_filter', 10, 2 );

function panorama_gallery_filter_articles_where( $where, $query ) {
	$value = panorama_gallery_article_filter();
	if ( '' === $value || ! $query->is_main_query() || 'post' !== $query->get( 'post_type' ) ) {
		return $where;
	}

	global $wpdb;
	$conditions = array();
	foreach ( array_keys( panorama_gallery_block_folders() ) as $name ) {
		// Même délimiteur qu’avec has_block(), y compris pour les blocs imbriqués.
		$like = '%' . $wpdb->esc_like( '<!-- wp:' . $name . ' ' ) . '%';
		$conditions[] = $wpdb->prepare( "{$wpdb->posts}.post_content LIKE %s", $like );
	}
	$contains = '(' . implode( ' OR ', $conditions ) . ')';
	return $where . ( 'with' === $value ? ' AND ' : ' AND NOT ' ) . $contains;
}

add_action(
	'load-edit.php',
	static function () {
		add_filter( 'posts_where', 'panorama_gallery_filter_articles_where', 10, 2 );
	}
);
