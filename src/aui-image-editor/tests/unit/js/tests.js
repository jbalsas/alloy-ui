YUI.add('module-tests', function(Y) {

    //--------------------------------------------------------------------------
    // ImageEditor Tests
    //--------------------------------------------------------------------------

    var imageEditor,

        isFlash = (Y.config.defaultImageEditorEngine === 'flash'),
        isIE8 = (Y.UA.ie && Y.UA.ie <= 8),

        suite = new Y.Test.Suite(
            {
                name: 'aui-image-editor',

                setUp: function() {
                    var instance = this,
                        prop;

                    if (isFlash || isIE8) {
                        Y.Array.each(
                            instance.items,
                            function(testCase) {
                                Y.Object.each(
                                    testCase,
                                    function(test, testName) {
                                        if ((testName.indexOf("test") === 0 || testName.indexOf(" ") > -1) && Y.Lang.isFunction(test)){
                                            Y.Do.before(instance.waitSwfLoad, testCase, testName, testCase, test);
                                        }
                                    }
                                );
                            }
                        );
                    }
                },

                waitSwfLoad: function(context, fn) {
                    var test = this;

                    setTimeout(function() {
                        test.resume(function() {
                            fn.call(test);
                        });
                    }, 600);

                    test.wait(1000);
                }
            }
        ),

        ALLOY_PNG = 'assets/AlloyUI.png',
        ALLOY_PNG_FLIP_H = 'assets/AlloyUI_flip_h.png',
        ALLOY_PNG_FLIP_V = 'assets/AlloyUI_flip_v.png',
        ALLOY_PNG_GRAY = 'assets/AlloyUI_gray.png',
        ALLOY_PNG_INVERT = 'assets/AlloyUI_invert.png',
        ALLOY_PNG_SEPIA = 'assets/AlloyUI_sepia.png',

        ERROR_CLEAR_CHANGES = 'Image in the editor after calling clear() should match the image before the changes',
        ERROR_CLEAR_SAVED_CHANGES = 'Calling clear() should not discard already saved changes',
        ERROR_INITIAL_IMAGE = 'Initial editor image should match the original image',
        ERROR_IMAGES_SHOULD_MATCH = 'Image in the editor after processing should match the expected image',
        ERROR_MIME_TYPE = 'Image url encoding should match image type',
        ERROR_RESET_CHANGES = 'Calling reset() should discard all changes and go back to the original image',
        ERROR_TOOLBAR_HIDDEN = 'Toolbar node should not be visible',
        ERROR_TRIGGER_VISIBLE = 'Trigger node should not be visible',

        IMAGE_MIME_JPEG = 'image/jpeg',
        IMAGE_MIME_PNG = 'image/png',
        IMAGE_MIME_TYPE_REGEXP = /^data:(.*);/,

        STR_CANVAS = 'canvas',
        STR_CLICK = 'click',
        STR_HIDDEN = 'hidden',

        TOLERANCE_API = 5,
        TOLERANCE_FLASH = 15,
        TOLERANCE_FILTERS = 5,
        TOLERANCE_INVERT_FILTER = 30,
        TOLERANCE_SEPIA_FILTER = 35,

        TPL_ERROR_ROW = '<tr><td><strong>{testName}</strong><br/>{errorString}</td><td><img src="{result}"></img></td><td><img src="{expected}"></img></td><td><img src="{diff}"></img></td><td>{percentageMatch} %</td></tr>'
        TPL_SRC_NODE = '<div id="imageEditorTest"><img src="{imageData}"></img></div>',

        assertImageMatches = function(test, expectedImage, tolerance, errorString) {
            var currentImage;

            if (isFlash) {
                tolerance += TOLERANCE_FLASH;
            }

            currentImage = imageEditor.getImageData();

            var diff = resemble(currentImage).compareTo(expectedImage).onComplete(function(data){
                test.resume(function() {
                    if (data.misMatchPercentage > tolerance) {
                        printError(errorString, currentImage, expectedImage, data.getImageDataUrl(), data.misMatchPercentage);
                        Y.Assert.fail(errorString);
                    }
                    else {
                        Y.Assert.pass();
                    }
                });
            });

            test.wait();
        },

        getImageProcessFn = function(imageSrc) {
            var img,
                processFn;

            processFn = function(drawingContext) {
                img = new Image();
                img.src = imageSrc;

                drawingContext.renderingContext.clearRect(0, 0, drawingContext.renderingCanvas.width, drawingContext.renderingCanvas.height);
                drawingContext.renderingContext.drawImage(img, 0, 0);
            }

            return processFn;
        },

        printError = function(errorString, result, expected, diff, percentageMatch) {
            Y.one('tbody').append(
                Y.Lang.sub(
                    TPL_ERROR_ROW,
                    {
                        diff: diff,
                        errorString: errorString,
                        expected: expected,
                        percentageMatch: percentageMatch,
                        result: result,
                        testName: Y.Test.Runner._cur.testObject
                    }
                )
            );
        };

    //--------------------------------------------------------------------------
    // Test Case for ImageEditor API
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'ImageEditor API tests',

        _should: {
            ignore: {
                'assert initial editor image matches the original': isIE8,
                'assert basic image process updates image editor': isIE8,
                'assert process callback is invoked': isIE8,
                'assert clear() discards unsaved changes': isIE8,
                'assert save() persists changes on the editor': isIE8,
                'assert reset() goes back to the original image': isIE8
            }
        },

        setUp: function() {
            Y.one('#wrapper').append(
                Y.Lang.sub(
                    TPL_SRC_NODE,
                    {
                        imageData: ALLOY_PNG
                    }
                )
            );

            imageEditor = new Y.ImageEditorBase({
                srcNode: '#imageEditorTest'
            });
        },

        tearDown: function() {
            imageEditor.destroy();

            Y.one('#wrapper').empty();

            imageEditor = null;
        },

        'assert initial editor image matches the original': function() {
            assertImageMatches(this, ALLOY_PNG, TOLERANCE_API, ERROR_INITIAL_IMAGE);
        },

        'assert basic image process updates image editor': function() {
            imageEditor.process(new Y.ImageGrayscaleFilter());

            assertImageMatches(this, ALLOY_PNG_GRAY, TOLERANCE_API, ERROR_IMAGES_SHOULD_MATCH);
        },

        'assert process callback is invoked': function() {
            var mock = new Y.Mock();

            Y.Mock.expect(
                mock, {
                    method: 'processComplete'
                }
            );

            imageEditor.process(
                new Y.ImageGrayscaleFilter(),
                {},
                mock.processComplete
            );

            Y.Mock.verify(mock);
        },

        'assert clear() discards unsaved changes': function() {
            imageEditor.process(new Y.ImageGrayscaleFilter());

            assertImageMatches(this, ALLOY_PNG_GRAY, TOLERANCE_API, ERROR_IMAGES_SHOULD_MATCH);

            imageEditor.clear();
            assertImageMatches(this, ALLOY_PNG, TOLERANCE_API, ERROR_CLEAR_CHANGES);
        },

        'assert save() persists changes on the editor': function() {
            imageEditor.process(new Y.ImageGrayscaleFilter());

            imageEditor.save();
            assertImageMatches(this, ALLOY_PNG_GRAY, TOLERANCE_API, ERROR_IMAGES_SHOULD_MATCH);

            imageEditor.clear();
            assertImageMatches(this, ALLOY_PNG_GRAY, TOLERANCE_API, ERROR_CLEAR_SAVED_CHANGES);
        },

        'assert reset() goes back to the original image': function() {
            imageEditor.process(new Y.ImageSepiaFilter());

            imageEditor.save();

            imageEditor.process(new Y.ImageGrayscaleFilter());

            imageEditor.reset();
            assertImageMatches(this, ALLOY_PNG, TOLERANCE_API, ERROR_RESET_CHANGES);
        },

        'assert image is encoded based on image MIME type': function() {
            Y.Assert.areEqual(IMAGE_MIME_PNG, IMAGE_MIME_TYPE_REGEXP.exec(imageEditor.getImageData())[1], ERROR_MIME_TYPE);

            imageEditor.set('imageType', IMAGE_MIME_JPEG);
            Y.Assert.areEqual(IMAGE_MIME_JPEG, IMAGE_MIME_TYPE_REGEXP.exec(imageEditor.getImageData())[1], ERROR_MIME_TYPE);
        }
    }));

    //--------------------------------------------------------------------------
    // Test Case for ImageEditor Filters
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'ImageEditor Filters tests',

        _should: {
            ignore: {
                'assert filter GrayScale': isIE8,
                'assert filter Sepia': isIE8,
                'assert filter Invert': isIE8,
                'assert filter Flip Horizontal': isIE8,
                'assert filter Flip Vertical': isIE8
            }
        },

        setUp: function() {
            Y.one('#wrapper').append(
                Y.Lang.sub(
                    TPL_SRC_NODE,
                    {
                        imageData: ALLOY_PNG
                    }
                )
            );

            imageEditor = new Y.ImageEditorBase({
                srcNode: '#imageEditorTest'
            });
        },

        tearDown: function() {
            imageEditor.destroy();

            Y.one('#wrapper').empty();

            imageEditor = null;
        },

        'assert filter GrayScale': function() {
            var filter = new Y.ImageGrayscaleFilter();

            imageEditor.process(filter);

            assertImageMatches(this, ALLOY_PNG_GRAY, TOLERANCE_FILTERS, ERROR_IMAGES_SHOULD_MATCH);
        },

        'assert filter Sepia': function() {
            var filter = new Y.ImageSepiaFilter();

            imageEditor.process(filter);

            assertImageMatches(this, ALLOY_PNG_SEPIA, TOLERANCE_SEPIA_FILTER, ERROR_IMAGES_SHOULD_MATCH);
        },

        'assert filter Invert': function() {
            var filter = new Y.ImageInvertFilter();

            imageEditor.process(filter);

            assertImageMatches(this, ALLOY_PNG_INVERT, TOLERANCE_INVERT_FILTER, ERROR_IMAGES_SHOULD_MATCH);
        },

        'assert filter Flip Horizontal': function() {
            var filter = new Y.ImageScaleFilter({scaleX: -1});

            imageEditor.process(filter);

            assertImageMatches(this, ALLOY_PNG_FLIP_H, TOLERANCE_FILTERS, ERROR_IMAGES_SHOULD_MATCH);
        },

        'assert filter Flip Vertical': function() {
            var filter = new Y.ImageScaleFilter({scaleY: -1});

            imageEditor.process(filter);

            assertImageMatches(this, ALLOY_PNG_FLIP_V, TOLERANCE_FILTERS, ERROR_IMAGES_SHOULD_MATCH);
        }
    }));

    //--------------------------------------------------------------------------
    // Test Case for ImageEditor UI
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'ImageEditor Filters tests',

        _should: {
            ignore: {
                'assert trigger node shows the actions toolbar': isFlash
            }
        },

        setUp: function() {
            Y.one('#wrapper').append(
                Y.Lang.sub(
                    TPL_SRC_NODE,
                    {
                        imageData: ALLOY_PNG
                    }
                )
            );

            imageEditor = new Y.ImageEditor({
                srcNode: '#imageEditorTest'
            }).render();
        },

        tearDown: function() {
            imageEditor.destroy();

            Y.one('#wrapper').empty();

            imageEditor = null;
        },

        'assert trigger node shows the actions toolbar': function() {
            var toolbar,
                trigger;

            toolbar = Y.one('.image-editor-toolbar');
            trigger = Y.one('.image-editor-trigger');

            trigger.simulate(STR_CLICK);

            Y.Assert.areEqual(trigger.getAttribute(STR_HIDDEN), 'true', ERROR_TRIGGER_VISIBLE);
            Y.Assert.areEqual(toolbar.getAttribute(STR_HIDDEN), '', ERROR_TOOLBAR_HIDDEN)
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-image-editor', 'node-event-simulate', 'test']
});
