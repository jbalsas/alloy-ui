var Lang = A.Lang,

    _NAME = 'image-color-filter',

    IDENTITY_MATRIX = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ],

    STR_MATRIX = 'matrix',

    /**
     * A matrix-color-based filter.
     *
     * @class A.ImageColorFilter
     * @extends A.ImageFilterBase
     * @constructor
     */
    ImageColorFilter = A.Base.create(_NAME, A.ImageFilterBase, [],
    {
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
                alpha,
                blue,
                data,
                dataLength,
                green,
                i,
                matrix,
                red,
                status;

            dataLength = drawingContext.bitmapData.data.length;

            if (dataLength) {
                data = drawingContext.bitmapData.data;

                matrix = instance.get(STR_MATRIX);

                for (i = 0; i < dataLength; i += 4) {
                    red = data[i];
                    green = data[i+1];
                    blue = data[i+2];
                    alpha = data[i+3];

                    data[i] = red * matrix[0] + green * matrix[1] + blue * matrix[2] + alpha * matrix[3] + matrix[4];
                    data[i+1] = red * matrix[5] + green * matrix[6] + blue * matrix[7] + alpha * matrix[8] + matrix[9];
                    data[i+2] = red * matrix[10] + green * matrix[11] + blue * matrix[12] + alpha * matrix[13] + matrix[14];
                    data[i+3] = red * matrix[15] + green * matrix[16] + blue * matrix[17] + alpha * matrix[18] + matrix[19];
                }
            }

            if (drawingContext.statusNode) {
                status = instance.get('label');

                if (cfg) {
                    status += ' (' + cfg + ')';
                }

                drawingContext.statusNode.setHTML(status);
            }
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
         * configuration for the ImageColorFilter.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS: {

            /**
             * The image processing works at bitmap level.
             *
             * @attribute bitmap
             * @type {Boolean}
             * @default true
             */
            bitmap: {
                validator: Lang.isBoolean,
                value: true
            },

            /**
             * 5x5 transformation matrix
             *
             * @attribute matrix
             * @type {Array}
             */
            matrix: {
                validator: Lang.isArray,
                value: IDENTITY_MATRIX
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
                    processFn: 'colorMatrixFilter',
                    params: [
                        STR_MATRIX
                    ]
                }
            }
        }
    });

A.ImageColorFilter = ImageColorFilter;