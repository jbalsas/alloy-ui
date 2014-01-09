package
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

	import com.custom.CustomProcessing;

	public class Processing extends Sprite
	{
		private const queue:FilterQueue = new FilterQueue();
		private var customProcessing:CustomProcessing;

		public function Processing()
		{
			//-- color
			//queue.addFilter( new BrightnessCorrection( 0x40, true ) );
			//queue.addFilter( new ContrastCorrection( 1.5 ) );
			//queue.addFilter( new Extract( 0xffffff ) );
			//queue.addFilter( new GammaCorrection( 2.2, true ) );
			//queue.addFilter( new Infrared() );
			//queue.addFilter( new Invert() );
			//queue.addFilter( new LevelsCorrection( true ) );
			//queue.addFilter( new Normalize( 0xff ) );
			//queue.addFilter( new QuickSepia() );
			//queue.addFilter( new Sepia() );

			//-- convolution
			//queue.addFilter( new Blur() );
			//queue.addFilter( new ConvolutionBlur( 4 ) );
			//queue.addFilter( new Edges() );
			//queue.addFilter( new Emboss() );
			//queue.addFilter( new Sharpen( .5 ) );

			//-- simplify
			//queue.addFilter( new Pixelate( 4 ) );
		}

        public function infrared(bitmapData:BitmapData, params:Object, cfg:Object = null):void {
            var queue:FilterQueue = new FilterQueue();
            var image:Image = new Image(bitmapData.width, bitmapData.height, ImageFormat.RGB);

            image.loadBitmapData(bitmapData, true);

            queue.addFilter(new Infrared());
            queue.apply(image);

            bitmapData.draw(image.bitmapData);
        }

        public static function gammaCorrection(bitmapData:BitmapData, params:Object, cfg:Object = null):void {
            var queue:FilterQueue = new FilterQueue();
            var image:Image = new Image(bitmapData.width, bitmapData.height, ImageFormat.RGB);

            image.loadBitmapData(bitmapData, true);

            queue.addFilter(new GammaCorrection(2.2, true));
            queue.apply(image);

            bitmapData.draw(image.bitmapData);
        }
    }
}
