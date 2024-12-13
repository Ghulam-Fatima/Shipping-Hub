(function($) {

	function doLoad() {
		const accordions = document.querySelectorAll( '.fl-module-vamtam-accordion' );

		for ( let i = 0; i < accordions.length; i++ ) {
			new VamtamAccordion( accordions[ i ].dataset.node );
		}
	}

	document.addEventListener( 'DOMContentLoaded', doLoad );

	window.FLBuilder && window.FLBuilder.addHook( 'didCompleteAJAX', doLoad );
	window.FLBuilder && window.FLBuilder.addHook( 'didRenderLayoutComplete', doLoad );

	VamtamAccordion = function( id ) {
		this.nodeClass = '.fl-node-' + id;
		this._init();
	};

	VamtamAccordion.prototype = {
		nodeClass: '',

		_init: function() {
			var el = $( this.nodeClass );

			if ( ! el.hasClass( 'vamtam-accordion-loaded' ) ) {
				$( this.nodeClass ).addClass( 'vamtam-accordion-loaded' );

				$( this.nodeClass + ' .fl-accordion-button' ).on( 'click', this._buttonClick.bind( this ) );

				FLBuilderLayout.preloadAudio( this.nodeClass + ' .fl-accordion-content' );

				this._openDefaultItem();
			}
		},

		_buttonClick: function( e ) {
			var button     = $( e.target ).closest( '.fl-accordion-button' ),
				accordion  = button.closest( '.fl-accordion' ),
				item       = button.closest( '.fl-accordion-item' ),
				allContent = accordion.find( '.fl-accordion-content' ),
				allIcons   = accordion.find( '.fl-accordion-button i.fl-accordion-button-icon' ),
				content    = button.siblings( '.fl-accordion-content' ),
				icon       = button.find( 'i.fl-accordion-button-icon' );

			if (accordion.hasClass( 'fl-accordion-collapse' )) {
				accordion.find( '.fl-accordion-item-active' ).removeClass( 'fl-accordion-item-active' );
				allContent.slideUp( 'normal' );
				allIcons.removeClass( 'vamtam-theme-minus' );
				allIcons.addClass( 'vamtam-theme-plus' );
			}

			if (content.is( ':hidden' )) {
				item.addClass( 'fl-accordion-item-active' );
				content.slideDown( 'normal', this._slideDownComplete );
				icon.addClass( 'vamtam-theme-minus' );
				icon.removeClass( 'vamtam-theme-plus' );
			} else {
				item.removeClass( 'fl-accordion-item-active' );
				content.slideUp( 'normal', this._slideUpComplete );
				icon.addClass( 'vamtam-theme-plus' );
				icon.removeClass( 'vamtam-theme-minus' );
			}
		},

		_slideUpComplete: function() {
			var content   = $( this ),
				accordion = content.closest( '.fl-accordion' );

			accordion.trigger( 'fl-builder.fl-accordion-toggle-complete' );
		},

		_slideDownComplete: function() {
			var content   = $( this ),
				accordion = content.closest( '.fl-accordion' ),
				item      = content.parent(),
				win       = $( window );

			FLBuilderLayout.refreshGalleries( content );

			// Grid layout support (uses Masonry)
			FLBuilderLayout.refreshGridLayout( content );

			// Post Carousel support (uses BxSlider)
			FLBuilderLayout.reloadSlider( content );

			// WP audio shortcode support
			FLBuilderLayout.resizeAudio( content );

			if ( item.offset().top < win.scrollTop() + 100 ) {
				$( 'html, body' ).animate({
					scrollTop: item.offset().top - 100
				}, 500, 'swing');
			}

			accordion.trigger( 'fl-builder.fl-accordion-toggle-complete' );
		},

		_openDefaultItem: function() {
			if ( document.querySelector( this.nodeClass + ' .fl-accordion-open-first' ) ) {
				document.querySelector( this.nodeClass + ' .fl-accordion-button' ).dispatchEvent( new Event( 'click' ) );
			}
		}
	};

})(jQuery);
