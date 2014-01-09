package com.custom
{
	import de.popforge.imageprocessing.capture.ICaptureDevice;
	import de.popforge.imageprocessing.capture.WebCam;
	import de.popforge.imageprocessing.core.Histogram;
	import de.popforge.imageprocessing.core.Image;
	import de.popforge.imageprocessing.core.ImageFormat;
	import de.popforge.imageprocessing.filters.*;
	import de.popforge.imageprocessing.filters.binarization.*;
	import de.popforge.imageprocessing.filters.color.*;
	import de.popforge.imageprocessing.filters.convolution.*;
	//import de.popforge.imageprocessing.filters.simplify.*;
	import de.popforge.imageprocessing.utils.FormatTest;

	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;

	public class CustomProcessing extends Sprite
	{
		private const queue: FilterQueue = new FilterQueue();

		public function CustomProcessing()
		{
		}

        public function extract(bitmapData:BitmapData, params:Object, cfg:String):void {
            var queue:FilterQueue = new FilterQueue();
            var image:Image = new Image(bitmapData.width, bitmapData.height, ImageFormat.RGB);

            image.loadBitmapData(bitmapData, true);

            queue.addFilter(new Extract(parseInt(cfg.substr(1), 16)));
            queue.apply(image);

            bitmapData.draw(image.bitmapData);
        }

        public static function blur(bitmapData:BitmapData, params:Object, cfg:int = 0):void {
            var queue:FilterQueue = new FilterQueue();
            var image:Image = new Image(bitmapData.width, bitmapData.height, ImageFormat.RGB);

            image.loadBitmapData(bitmapData, true);

            queue.addFilter(new ConvolutionBlur(cfg));
            queue.apply(image);

            bitmapData.draw(image.bitmapData);
        }
    }
}
