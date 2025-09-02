
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { image = {} } = attributes;
	if ( !image.url ) return null;
	return (
		<figure { ...useBlockProps.save() } className="wp-block-w0-panorama-gallery__container">
			<div className="wp-block-w0-panorama-gallery__panorama-wrapper">
				<div className="wp-block-w0-panorama-gallery__panorama-scroll">
					<img
						src={ image.url }
						alt={ image.alt || '' }
						className="wp-block-w0-panorama-gallery__image"
						draggable={false}
					/>
				</div>
			</div>
			<div className="wp-block-w0-panorama-gallery__minimap-wrapper">
				<canvas className="wp-block-w0-panorama-gallery__minimap" height="40"></canvas>
				<div className="wp-block-w0-panorama-gallery__minimap-viewport"></div>
			</div>
		</figure>
	);
}
