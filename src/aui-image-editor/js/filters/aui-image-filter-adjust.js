var Lang = A.Lang,

    _NAME = 'image-adjust-filter',

    _NS = 'adjustFilter',

    IDENTITY_MATRIX = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ],

    STR_BRIGHTNESS = 'brightness',
    STR_CONTRAST = 'contrast',
    STR_MATRIX = 'matrix',
    STR_SATURATION = 'saturation',

    ImageAdjustFilter = A.Base.create(_NAME, A.ImageColorFilter, [],
    {

        /**
         * Construction logic executed during ImageAdjustFilter instantiation.
         * Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            A.Do.before(instance._beforeProcess, instance, 'process', instance);

            instance.set('label', instance.get('mode'));

            instance.after(['brightnessChange', 'contrastChange', 'saturationChange'], instance._calculateColorMatrix, instance);
        },

        _beforeProcess: function(drawingContext, value) {
            var instance = this,
                mode;

            mode = instance.get('mode');

            if (mode === STR_BRIGHTNESS) {
                instance.set(STR_BRIGHTNESS, ((value - 50)/50));
            }
            else if (mode === STR_CONTRAST) {
                instance.set(STR_CONTRAST, value/50);
            }
            else if (mode === STR_SATURATION) {
                instance.set(STR_SATURATION, value/50);
            }
        },

        /**
         *
         */
        _calculateColorMatrix: function() {
            var instance = this,
                brightness,
                contrast,
                matrix,
                saturation,
                sb,
                sg,
                sr,
                t;

            matrix = IDENTITY_MATRIX.slice(0);

            brightness = instance.get(STR_BRIGHTNESS) * 255;

            contrast = instance.get(STR_CONTRAST);
            t = ((1 - contrast) / 2) * 255;

            saturation = instance.get(STR_SATURATION);
            sr = (1 - saturation) * 0.3086;
            sg = (1 - saturation) * 0.6094;
            sb = (1 - saturation) * 0.0820;

            matrix[0] = contrast * (sr + saturation);
            matrix[1] = contrast * sg;
            matrix[2] = contrast * sb;
            matrix[4] = brightness + t;

            matrix[5] = contrast * sr;
            matrix[6] = contrast * (sg + saturation);
            matrix[7] = contrast * sb;
            matrix[9] = brightness + t;

            matrix[10] = contrast * sr;
            matrix[11] = contrast * sg;
            matrix[12] = contrast * (sb + saturation);
            matrix[14] = brightness + t;

            instance.set(STR_MATRIX, matrix);
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
         * Static property provides a string to identify the namespace.
         *
         * @property NS
         * @type String
         * @static
         */
        NS: _NS,

        /**
         * Static property used to define which component it extends.
         *
         * @property EXTENDS
         * @type String
         * @static
         */
        EXTENDS: A.ImageColorFilter,

        /**
         * Static property used to define the default attribute
         * configuration for the ImageAdjustFilter.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        ATTRS: {

            /**
             * Mode of the filter.
             *
             * @attribute mode
             * @type {String}
             * @default brightness
             */
            mode: {
                validator: Lang.isString,
                value: STR_BRIGHTNESS
            },

            /**
             * Brightness value.
             *
             * @attribute brightness
             * @type {Number}
             * @default 0
             */
            brightness: {
                validator: Lang.isNumber,
                value: 0
            },

            /**
             * Contrast value.
             *
             * @attribute contrast
             * @type {Number}
             * @default 1
             */
            contrast: {
                validator: Lang.isNumber,
                value: 1
            },

            /**
             * Saturation value.
             *
             * @attribute saturation
             * @type {Number}
             * @default 1
             */
            saturation: {
                validator: Lang.isNumber,
                value: 1
            },

            /**
             * Configuration for the filter UI generation.
             *
             * @type {Object|Function|Widget}
             */
            ui: {
                value: {
                    fn: A.Slider,
                    cfg: {
                        value: 50
                    }
                }
            }
        }
    });

A.ImageAdjustFilter = ImageAdjustFilter;