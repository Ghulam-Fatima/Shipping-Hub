( function( $ ) {

	FLBuilderPhoto = function( settings ) {
		this.settings   = settings;
		this.nodeClass  = '.fl-node-' + settings.id;
		this.image      = $( this.nodeClass + ' .fl-photo-img' );
		this.caption = $( this.nodeClass + ' .fl-photo-caption' );
		this.usesLightbox = this.image.data( 'link-type' ) === 'lightbox';
		this._init();
	};

	FLBuilderPhoto.prototype = {

		settings	: {},
		nodeClass	: '',
		image		: null,

		_init: function() {
			this.image
				.on( 'mouseenter', function( e ) {
					$( this ).data( 'title', $( this ).attr( 'title' ) ).removeAttr( 'title' );
				} )
				.on( 'mouseleave', function( e ){
					$( this ).attr( 'title', $( this ).data( 'title' ) ).data( 'title', null );
				} );

			if ( this.usesLightbox ) {
				this._doLightbox();
			}
		},

		_doLightbox: function () {
			const _self = this;
			if (typeof $.fn.magnificPopup !== 'undefined') {
				$(`.fl-node-${ this.settings.id } a`).magnificPopup({
					type: 'image',
					closeOnContentClick: true,
					closeBtnInside: false,
					tLoading: '',
					preloader: true,
					image: {
							titleSrc: function(item) {
								if ( _self.caption ) {
									return _self.caption.text();
								}
							}
					},
					callbacks: {
						open: function() {
							$('.mfp-preloader').html('<i class="fas fa-spinner fa-spin fa-3x fa-fw"></i>');
						}
					}
				});
			}
		},
	}

	function initFlPhotos() {
		const photoModules = document.querySelectorAll( '.fl-module-photo' );

		photoModules.forEach( photo => {
			const id = photo.dataset.node;
			new FLBuilderPhoto( {
				id: id,
			} )
		});
	}

	document.addEventListener( 'DOMContentLoaded', function() {
		if ( window.FLBuilder ) {
			FLBuilder.addHook( 'didCompleteAJAX', initFlPhotos );
			FLBuilder.addHook( 'didRenderLayoutComplete', initFlPhotos );
		}
		initFlPhotos();
	} );
})( jQuery );
