var Lang = A.Lang,

    _NAME = 'image-blur-filter',

    ImageBlurFilter = A.Base.create(_NAME, A.ImageFilterBase, [],
    {

    }, {

        /**
         * Static property provides a string to identify the class.
         *
         * @property NAME
         * @type String
         * @static
         */
        NAME: _NAME,

        /**
         * Static property used to define the default attribute
         * configuration for the ImageBlurFilter.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS: {

            /**
             * Amount of horizontal blur.
             *
             * @attribute blurX
             * @type {Number}
             * @default 4
             */
            blurX: {
                validator: Lang.isNumber,
                value: 4
            },

            /**
             * Amount of vertical blur.
             *
             * @attribute blurY
             * @type {Number}
             * @default 4
             */
            blurY: {
                validator: Lang.isNumber,
                value: 4
            },

            /**
             * Configuration for the flash fallback implementation of the
             * filter.
             *
             * @attribute swfCfg
             * @type {Object}
             */
            swfCfg: {
                readonly: true,
                value: {
                    processFn: 'blurMatrixFilter',
                    params: [
                        'blurX',
                        'blurY'
                    ]
                }
            }
        }
    });

A.ImageBlurFilter = ImageBlurFilter;