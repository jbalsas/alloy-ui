package {
    import flash.display.Bitmap;
    import flash.display.BitmapData;
    import flash.display.Loader;
    import flash.display.Sprite;
    import flash.display.StageAlign;
    import flash.display.StageScaleMode;
    import flash.events.Event;
    import flash.external.ExternalInterface;
    import flash.filters.BitmapFilter;
    import flash.filters.BitmapFilterQuality;
    import flash.filters.BlurFilter;
    import flash.filters.ColorMatrixFilter;
    import flash.geom.Matrix;
    import flash.geom.Point;
    import flash.geom.Rectangle;
    import flash.net.URLRequest;
    import flash.system.ApplicationDomain;
    import flash.system.LoaderContext;
    import flash.utils.ByteArray;
    import flash.utils.Dictionary;

    import mx.graphics.codec.*;
    import mx.utils.Base64Encoder;

    /**
     * A Flash implementation of an ImageProcessor
     */
    public class ImageProcessor extends Sprite {
        public static const IMAGE_TYPE_JPEG:String = 'image/jpeg';

        protected var _domains:Dictionary = new Dictionary();

        protected var _image:Bitmap;
        protected var _bitmapDataStack:Vector.<BitmapData> = new Vector.<BitmapData>();

        protected var _initialData:BitmapData;
        protected var _currentData:BitmapData;
        protected var _previewData:BitmapData;

        /**
         * Constructor
         */
        public function ImageProcessor() {
            stage.align = StageAlign.TOP_LEFT;
            stage.scaleMode = StageScaleMode.NO_SCALE;

            var url:String = stage.loaderInfo.parameters['imageUrl'];
            var urlRequest:URLRequest = new URLRequest(url);

            var loader:Loader = new Loader();
            loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoaderComplete);
            loader.load(urlRequest);

            if (ExternalInterface.available) {
                ExternalInterface.addCallback('clear', clear);
                ExternalInterface.addCallback('getImage', getImage);
                ExternalInterface.addCallback('getImageData', getImageData);
                ExternalInterface.addCallback('process', process);
                ExternalInterface.addCallback('putImage', putImage);
                ExternalInterface.addCallback('reset', reset);
                ExternalInterface.addCallback('save', save);
            }
        }

        /**
         * Discards any unsaved changes on the editor.
         *
         * @method clear
         */
        public function clear():void {
            this.updateImage(this._currentData);
        }

        /**
         * Obtains a representation of the current image on the editor,
         * including unsaved changes.
         *
         * @method getImage
         * @return {uint} A unique ID representing the current image.
         */
        public function getImage():uint {
            this._bitmapDataStack.push(this._previewData.clone());

            return this._bitmapDataStack.length - 1;
        }

        /**
         * Obtains a data:URL with a representation of the current image on the
         * editor, including unsaved changes.
         *
         * @method getImageData
         * @return {String} A data:URL with a representation of the image.
         */
        public function getImageData(type:String):String {
            var w:Number = this._currentData.width;
            var h:Number = this._currentData.height;

            var rect:Rectangle = new Rectangle(0, 0, w, h);

            var enc:IImageEncoder = (type === ImageProcessor.IMAGE_TYPE_JPEG ? new JPEGEncoder() : new PNGEncoder());
            var img:ByteArray = enc.encodeByteArray(this._previewData.getPixels(rect), w, h);

            var enc64:Base64Encoder = new Base64Encoder();
            enc64.insertNewLines = false;
            enc64.encodeBytes(img);

            return 'data:' + type + ';base64,' + enc64.toString();
        }

        /**
         * Runs a processing action over the current state of the image in the editor. Defers the real
         * processing to doProcess to account for custom processors outside the current domain that may
         * be loaded on runtime.
         *
         * @method process
         * @param {Object} swfCfg Processor configuration for the Flash implementation.
         * @param {Object} params Additional configuration of the processor.
         * @param {Object} cfg Additional configuration of the processing.
         */
        public function process(swfCfg:Object, params:Object, cfg:Object = null):void {
            if (!swfCfg.path || (swfCfg.applicationDomain = _domains[swfCfg.path])) {
                this.doProcess(swfCfg, params, cfg);
            }
            else {
                _domains[swfCfg.path] = swfCfg.applicationDomain = new ApplicationDomain(ApplicationDomain.currentDomain);

                var request:URLRequest = new URLRequest(swfCfg.path);
                var loaderContext:LoaderContext = new LoaderContext(false, swfCfg.applicationDomain);
                var loader:Loader = new Loader();

                loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onApplicationDomainLoaded(swfCfg, params, cfg));

                loader.load(request, loaderContext);
            }
        }

        /**
         * Puts an image on the editor.
         *
         * @method putImage
         * @param {uint} imageData The numeric ID representing the image.
         * @param {Number} offsetX Horizontal offset.
         * @param {Number} offsetY Vertical offset.
         */
        public function putImage(image:uint, offsetX:Number, offsetY:Number):void {
            if (image >= 0 && image < this._bitmapDataStack.length) {
                this._currentData = this._previewData = this._bitmapDataStack[image];

                this.updateImage(this._currentData);
            }
        }

        /**
         * Resets the editor state discarding all the applied changes.
         *
         * @method reset
         */
        public function reset():void {
            this._currentData = this._initialData.clone();
            this._previewData = this._initialData.clone();

            this.updateImage(this._initialData);
        }

        /**
         * Saves the current changes.
         *
         * @method save
         */
        public function save():Object {
            var state:Object = {};

            this._bitmapDataStack.push(this._previewData.clone());
            this._currentData = this._previewData;

            state.newVal = this._bitmapDataStack.length - 1;
            state.prevVal = this._bitmapDataStack.length - 2;

            return state;
        }

        /**
         * Runs a processing action over the current state of the image in the editor.
         *
         * @method process
         * @param {Object} swfCfg Processor configuration for the Flash implementation.
         * @param {Object} params Additional configuration of the processor.
         * @param {Object} cfg Additional configuration of the processing.
         */
        private function doProcess(swfCfg:Object, params:Object, cfg:Object = null):void {
            var processFn:Function  = this.getProcessFunction(swfCfg);

            if (processFn !== null) {
                this._previewData = this._currentData.clone();
                processFn(this._previewData, params, cfg);

                this.updateImage(this._previewData);
            }
        }

        /**
         * Obtains the process function to invoke based on a given configuration.
         *
         * @param {Object} swfCfg Processor configuration for the Flash implementation.
         * @return {Function} Processing function.
         */
        private function getProcessFunction(swfCfg:Object):Function {
            var className:String = swfCfg.className;
            var processFnName:String = swfCfg.processFn;
            var context:Object = this;
            var applicationDomain:ApplicationDomain = swfCfg.applicationDomain || ApplicationDomain.currentDomain;

            if (className) {
                var clazz:Class = applicationDomain.getDefinition(className) as Class;

                if (swfCfg.static) {
                    context = clazz;
                } else {
                    context = new clazz();
                }
            }

            return context[processFnName] as Function;
        }

        /**
         * Listener for loading external processor containers on runtime.
         *
         * @param {Object} swfCfg Processor configuration for the Flash implementation.
         * @param {Object} params Additional configuration of the processor.
         * @param {Object} cfg Additional configuration of the processing.
         * @return {Function} A closure function with the deferred call to doProcess.
         */
        private function onApplicationDomainLoaded(swfCfg:Object, params:Object, cfg:Object = null):Function {
            var imageProcessor:ImageProcessor = this;

            return function(event:Event):void {
                imageProcessor.doProcess(swfCfg, params, cfg);
            }
        }

        /**
         * Listener for loading the edited image.
         *
         * @param {Event} event Load complete event.
         */
        private function onLoaderComplete(event:Event):void {
            var loader:Loader = event.currentTarget.loader as Loader;
            var loaderData:BitmapData = (event.currentTarget.content as Bitmap).bitmapData;

            this._initialData = new BitmapData(loader.width, loader.height, true, 0xFFFFFF);
            this._initialData.copyPixels(loaderData, new Rectangle(0, 0, loader.width, loader.height), new Point(0, 0), null, null, true);

            this.updateImage(this._initialData);

            this._currentData = this._initialData.clone();
            this._previewData = this._initialData.clone();

            this._bitmapDataStack.push(this._initialData.clone());
        }

        /**
         * Helper function to update the displayed image on the editor.
         *
         * @param {BitmapData} bitmapData The new image bitmap data.
         */
        protected function updateImage(bitmapData:BitmapData):void {
            if (this._image && this.contains(this._image)) {
                this.removeChild(this._image);
            }

            this._image = new Bitmap(bitmapData);

            this._image.width = stage.stageWidth;
            this._image.height = stage.stageHeight;

            this.addChild(this._image);
        }

        /**
         * FILTERS
         *
         * Below appear some simple flash fallback filter implementations
         */

        /**
         * ColorFilter
         */
        protected function colorMatrixFilter(bitmapData:BitmapData, params:Object, cfg:Object = null):void {
            var rect:Rectangle = new Rectangle(0, 0, bitmapData.width, bitmapData.height);
            var pt:Point = new Point(0, 0);

            bitmapData.applyFilter(_previewData, rect, pt, new ColorMatrixFilter(params.matrix));
        }

        /**
         * BlurFilter
         */
        protected function blurMatrixFilter(bitmapData:BitmapData, params:Object, cfg:Object = null):void {
            var rect:Rectangle = new Rectangle(0, 0, bitmapData.width, bitmapData.height);
            var pt:Point = new Point(0, 0);

            bitmapData.applyFilter(_previewData, rect, pt, new BlurFilter(params.blurX, params.blurY, BitmapFilterQuality.HIGH));
        }

        /**
         * ScaleFilter
         */
        protected function scaleMatrixFilter(bitmapData:BitmapData, params:Object, cfg:Object = null):void {
            var scaleMatrix:Matrix = new Matrix(params.scaleX, 0, 0, params.scaleY, ((1 - params.scaleX) / 2) * this._currentData.width, ((1 - params.scaleY) / 2) * this._currentData.height);

            bitmapData.draw(this._currentData, scaleMatrix);
        }
    }
}