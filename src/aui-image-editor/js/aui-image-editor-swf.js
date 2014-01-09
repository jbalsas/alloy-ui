var Lang = A.Lang,
    Aarray = A.Array,

    UA = A.UA,

    DEFAULT_PLAYER_PATH = A.config.base + 'aui-image-editor/assets/ImageProcessor.swf',

    STR_FLASH_VARS = 'flashVars',
    STR_HEIGHT = 'height',
    STR_IMAGE_NODE = 'imageNode',
    STR_IMAGE_URL = 'imageUrl',
    STR_SRC = 'src',
    STR_SWF_CFG = 'swfCfg',
    STR_SWF_URL = 'swfUrl',
    STR_WIDTH = 'width',

    TPL_FLASH = '<object class="image-processor-swf" id="{id}" {applicationType} height="{height}" width="{width}">' +
        '{movie}{flashVars} <param name="wmode" value="transparent">' +
        '</object>',

    TPL_FLASH_WRAPPER = '<div class="image-editor-swf"></div>',

    _NAME = 'image-editor-swf',

    /**
     * A js wrapper for a FLASH implementation of an ImageEditor.
     *
     * @class A.ImageEditorSWF
     * @extends A.ImageEditorBase
     * @constructor
     */
    ImageEditorSwf = A.Base.create(_NAME, A.Base, [A.ImageEditorBase], {

        /**
         * Construction logic executed during ImageEditorSWF instantiation
         * Lifecycle.
         *
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance._initEditorBase();

            instance._renderSwf();
        },

        /**
         * Discards any unsaved changes on the editor.
         *
         * @method clear
         */
        clear: function() {
            var instance = this;

            instance._getSWFObject().clear();
        },

        /**
         * Obtains a representation of the current image on the editor,
         * including unsaved changes.
         *
         * @method getImage
         * @return {uint} A unique ID representing the current image.
         */
        getImage: function() {
            var instance = this;

            return instance._getSWFObject().getImage();
        },

        /**
         * Obtains a data:URL with a representation of the current image on the
         * editor, including unsaved changes.
         *
         * @method getImageData
         * @return {String} A data:URL with a representation of the image.
         */
        getImageData: function() {
            var instance = this;

            return instance._getSWFObject().getImageData(instance.get('imageType'));
        },

        /**
         * Runs a processing action over the current state of the image in the editor.
         *
         * @method process
         * @param {A.ImageFilterBase|Object} processor The processor object to apply.
         * @param {Object} cfg Additional config parameters for the processor.
         * @param {Function} callback Callback for processing complete.
         */
        process: function(processor, cfg, callback) {
            var instance = this,
                params,
                swfCfg;

            if (processor) {
                if (processor._beforeProcess) {
                    processor._beforeProcess(null, cfg);
                }

                swfCfg = A.instanceOf(processor, A.Base) ? processor.get(STR_SWF_CFG) : processor[STR_SWF_CFG];

                if (swfCfg && swfCfg.processFn) {
                    params = {};

                    Aarray.each(
                        swfCfg.params,
                        function(item) {
                            params[item] = processor.get(item);
                        }
                    );

                    try {
                        instance._getSWFObject().process(swfCfg, params, cfg);

                        if (callback) {
                            callback();
                        }
                    }
                    catch(err) {
                        console.error(err);
                    }
                }
            }
        },

        /**
         * Puts an image on the editor.
         *
         * @method putImage
         * @param {uint} imageData The numeric ID representing the image.
         * @param {Number} offsetX Horizontal offset.
         * @param {Number} offsetY Vertical offset.
         */
        putImage: function(imageData, offsetX, offsetY) {
            var instance = this;

            offsetX = offsetX || 0;
            offsetY = offsetY || 0;

            instance._getSWFObject().putImage(imageData, offsetY, offsetY);
        },

        /**
         * Resets the editor state discarding all the applied changes.
         *
         * @method reset
         */
        reset: function() {
            var instance = this;

            instance._getSWFObject().reset();

            instance._notifyStateChange('reset');
        },

        /**
         * Saves the current changes.
         *
         * @method save
         */
        save: function() {
            var instance = this,
                state;

            state = instance._getSWFObject().save();

            instance._notifyStateChange
            (
                'save',
                state.prevVal,
                state.newVal
            );
        },

        /**
         * Returns the ImageProcessor SWF object.
         *
         * @method _getSWFObject
         * @private
         * @return {Object} The ImageProcessor SWF Object.
         */
        _getSWFObject: function() {
            return A.one('.image-processor-swf').getDOMNode();
        },

        /**
         * Renders the ImageProcessor SWF onto the DOM.
         *
         * @method _renderSwf
         * @private
         */
        _renderSwf: function() {
            var instance = this,
                applicationType,
                flashVars,
                flashVarsParam,
                imageNode,
                movie,
                processorSwf,
                swfUrl;

            swfUrl = instance.get(STR_SWF_URL);

            if (swfUrl) {
                imageNode = instance.get(STR_IMAGE_NODE);

                flashVars = instance.get(STR_FLASH_VARS);
                flashVars[STR_IMAGE_URL] = imageNode.get(STR_SRC);

                flashVars = A.QueryString.stringify(instance.get(STR_FLASH_VARS));

                applicationType = 'type="application/x-shockwave-flash" data="' + swfUrl + '"';

                movie = '';

                if (UA.ie) {
                    applicationType = 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';

                    movie = '<param name="movie" value="' + swfUrl + '"/>';
                }

                flashVarsParam = '';

                if (flashVars) {
                    flashVarsParam = '<param name="flashVars" value="' + flashVars + '" />';
                }

                processorSwf = A.Node.create(TPL_FLASH_WRAPPER);

                processorSwf.append
                (
                    Lang.sub(
                        TPL_FLASH, {
                            applicationType: applicationType,
                            id: A.guid(),
                            flashVars: flashVarsParam,
                            height: imageNode.get(STR_HEIGHT),
                            movie: movie,
                            width: imageNode.get(STR_WIDTH)
                        }
                    )
                );

                processorSwf.append(imageNode);

                instance.get('srcNode').append(processorSwf);
            }
        }
    }, {
        ATTRS: {

            /**
             * Variables used by Flash player.
             *
             * @attribute flashVars
             * @default {}
             * @type Object
             */
            flashVars: {
                validator: Lang.isObject,
                value: {}
            },

            /**
             * URL (on .swf format) used by ImageEditor to create
             * a fallback editor with Flash.
             *
             * @attribute swfUrl
             * @default aui-image-editor/assets/ImageProcessor.swf
             * @type String
             */
            swfUrl: {
                validator: Lang.isString,
                value: DEFAULT_PLAYER_PATH
            }
        }
    });

A.ImageEditorSwf = ImageEditorSwf;