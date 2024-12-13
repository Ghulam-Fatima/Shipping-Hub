var VamtamAnimatedNumber;

(function(undefined) {

	/**
	 * Class for Number Counter Module
	 *
	 * @since 1.6.1
	 */
	VamtamAnimatedNumber = function( settings ) {
		// set params
		this.nodeClass    = '.fl-node-' + settings.id;
		this.wrapperClass = this.nodeClass + ' .fl-number';
		this.layout       = settings.layout;
		this.type         = settings.type;
		this.number       = settings.number;
		this.max          = settings.max;
		this.speed        = settings.speed;

		this.wrapper = document.querySelector( this.wrapperClass );

		if ( this.wrapper ) {
			this.wrapper.VamtamAnimatedNumber = this;

			// initialize the number
			this._initNumber();
		}
	};

	if ( 'IntersectionObserver' in window ) {
		VamtamAnimatedNumber.intersectionObserver = new IntersectionObserver( function( entries ) {
			entries.forEach( function( entry ) {
				if ( entry.intersectionRatio >= 1 ) {
					entry.target.VamtamAnimatedNumber._initCount();
					VamtamAnimatedNumber.intersectionObserver.unobserve( entry.target );
				}
			} );
		}, {
			threshold: [1]
		} );
	}

	VamtamAnimatedNumber.prototype = {
		nodeClass               : '',
		wrapperClass            : '',
		layout 	                : '',
		type 	                : '',
		number 	                : 0,
		max 	                : 0,
		speed 					: 0,

		_initNumber: function() {
			var self = this;

			var numString = this.wrapper.querySelector( '.fl-number-int' );

			if ( numString ) {
				numString.innerHTML = '0';
			}

			if ( VamtamAnimatedNumber.intersectionObserver ) {
				VamtamAnimatedNumber.intersectionObserver.observe( this.wrapper );
			} else {
				self._initCount();
			}
		},

		_initCount: function() {
			if ( this.layout == 'circle' ) {
				this._triggerCircle();
			} else if ( this.layout == 'bars' ) {
				this._triggerBar();
			}

			this._countNumber();
		},

		_countNumber: function() {
			this._numberElement = this.wrapper.querySelector( '.fl-number-string .fl-number-int' );

			requestAnimationFrame( this._countNumberStep.bind( this ) );
		},

		_countNumberStep: function( now ) {
			if ( ! this._numberStart ) {
				this._numberStart = now;
			}

			var progress = Math.min( 1, ( now - this._numberStart ) / this.speed );

			let number = Math.ceil( this.number * progress );

			this._numberElement.innerHTML = 'Intl' in window ? Intl.NumberFormat( document.documentElement.lang, { style: 'decimal' } ).format( number ) : number;

			if ( progress < 1 ) {
				requestAnimationFrame( this._countNumberStep.bind( this ) );
			}
		},

		_triggerCircle: function() {
			var bar    = this.wrapper.querySelector( '.fl-bar' ),
				r      = parseInt( bar.getAttribute( 'r' ), 10 ),
				circle = Math.PI * (r * 2),
				max    = this.type == 'percent' ? 100 : this.max,
				val    = Math.max( 0, Math.min( this.number, max ) );

			if ( this.type == 'percent' ) {
				var pct = ( ( 100 - val ) / 100) * circle;
			} else {
				var pct = ( 1 - ( val / max ) ) * circle;
			}

			requestAnimationFrame( function() {
				bar.style.transitionDuration = this.speed + 'ms';
				bar.style.strokeDashoffset   = pct;
			}.bind( this ) );
		},

		_triggerBar: function() {
			var bar    = this.wrapper.querySelector( '.fl-number-bar' );
			var string = this.wrapper.querySelector( '.fl-number-string' );

			if ( this.type == 'percent' ) {
				var number = this.number > 100 ? 100 : this.number;
			} else {
				var number = Math.ceil( ( this.number / this.max ) * 100 );
			}

			var number_inside = !! this.wrapper.querySelector( '.fl-number-position-default' );

			requestAnimationFrame( function() {
				bar.style.transitionDuration = this.speed + 'ms';
				bar.style.transform          = 'scaleX(' + ( this.number / this.max ) + ')';

				if ( number_inside ) {
					string.style.transitionDuration = this.speed + 'ms';
					string.style.transform          = 'translateX(' + 100 * ( this.number / this.max - 1 ) + '%)';
				}
			}.bind( this ) );
		}

	};

})();
