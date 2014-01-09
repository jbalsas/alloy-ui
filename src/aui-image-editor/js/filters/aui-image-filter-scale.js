var Lang = A.Lang,

    _NAME = 'image-scale-filter',

    STR_SCALE_X = 'scaleX',
    STR_SCALE_Y = 'scaleY',

    /**
     * A dimension-scale filter.
     *
     * @class A.ImageScaleFilter
     * @extends A.ImageFilterBase
     * @constructor
     */
    ImageScaleFilter = A.Base.create(_NAME, A.ImageFilterBase, [],
    {

        initializer: function() {
            var instance = this;

            instance._bufferCanvas = A.config.doc.createElement('canvas');
            instance._bufferContext = instance._bufferCanvas.getContext('2d');
        },

        /**
         * Applies the filter transformation to the given data.
         *
         * @method process
         * @param {Object} drawingContext Object with the relevant drawing
         * context information.
         * @param {Object} cfg Configuration parameters for the filter.
         */
        process: function(drawingContext, cfg) {
            var instance = this,
                bufferCanvas,
                scaleX,
                scaleY,
                width,
                height;

            scaleX = instance.get(STR_SCALE_X);
            scaleY = instance.get(STR_SCALE_Y);

            if (cfg) {
                if (cfg.scaleX) {
                    scaleX = cfg.scaleX;
                }

                if (cfg.scaleY) {
                    scaleY = cfg.scaleY;
                }
            }

            width = drawingContext.renderingCanvas.width,
            height = drawingContext.renderingCanvas.height;

            instance._bufferCanvas.width = width;
            instance._bufferCanvas.height = height;

            instance._bufferContext.drawImage(drawingContext.renderingCanvas, 0, 0);

            drawingContext.renderingContext.clearRect(0, 0, width, height);

            drawingContext.renderingContext.save();
            drawingContext.renderingContext.scale(scaleX, scaleY);
            drawingContext.renderingContext.drawImage(instance._bufferCanvas, (- (1 - scaleX) / 2) * width, (- (1 - scaleY) / 2) * height);
            drawingContext.renderingContext.restore();
        }
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
         * configuration for the ImageScaleFilter.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS: {

            /**
             * Scale ratio to apply along the horizontal axis of the image.
             *
             * @attribute scaleX
             * @type {Number}
             * @default 1
             */
            scaleX: {
                validator: Lang.isNumber,
                value: 1
            },

            /**
             * Scale ratio to apply along the vertical axis of the image.
             *
             * @attribute scaleY
             * @type {Number}
             * @default 1
             */
            scaleY: {
                validator: Lang.isNumber,
                value: 1
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
                    processFn: 'scaleMatrixFilter',
                    params: [
                        STR_SCALE_X,
                        STR_SCALE_Y
                    ]
                }
            }
        }
    });

A.ImageScaleFilter = ImageScaleFilter;