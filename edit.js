
import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { image = {} } = attributes;
	const blockProps = useBlockProps();

	const onSelectImage = ( media ) => {
		if ( !media || !media.url ) return;
		setAttributes({
			image: {
				id: media.id,
				url: media.url,
				alt: media.alt || '',
			}
		});
	};

	return (
		<div { ...blockProps }>
			{ !image.url ? (
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes={ [ 'image' ] }
						multiple={ false }
						value={ image.id ? [ image.id ] : [] }
						render={ ( { open } ) => (
						<Button variant="primary" onClick={ open }>
							{ __( 'Ajouter une image panoramique', 'panorama-gallery-block-wp' ) }
						</Button>
					) }
				/>
				</MediaUploadCheck>
			) : (
				<figure className="wp-block-w0-panorama-gallery__container">
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
						<canvas
							className="wp-block-w0-panorama-gallery__minimap"
							height="40"
						></canvas>
						<div className="wp-block-w0-panorama-gallery__minimap-viewport"></div>
					</div>
					<Button
						variant="tertiary"
						style={{ marginTop: 12 }}
						onClick={ () => setAttributes( { image: {} } ) }
					>
						{ __( 'Remplacer l\'image', 'panorama-gallery-block-wp' ) }
					</Button>
				</figure>
			)}
		</div>
	);
}
