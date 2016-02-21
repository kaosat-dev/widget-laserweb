/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables
// sacaneAdd();
// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.

    Most widgets will not need to define Javascript dependencies.

    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.

    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.

    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
        // Don't put .js at end of URL (except when passing thru CP geturl proxy)
        Three: '//i2dcui.appspot.com/geturl?url=http://threejs.org/build/three.min.js',
        ThreeTextGeometry: '//i2dcui.appspot.com/js/three/TextGeometry',
        ThreeFontUtils: '//i2dcui.appspot.com/js/three/FontUtils',
        ThreeHelvetiker: '//i2dcui.appspot.com/js/three/threehelvetiker',
        Clipper: '//i2dcui.appspot.com/js/clipper/clipper_unminified',
        dxfParser: '//widget-laserweb-openhardwarecoza.c9users.io/dxf-parser',
        dxfRender: '//widget-laserweb-openhardwarecoza.c9users.io/renderer',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
        ThreeTextGeometry: ['Three'],
        ThreeFontUtils: ['Three', 'ThreeTextGeometry'],
        ThreeHelvetiker: ['Three', 'ThreeTextGeometry', 'ThreeFontUtils'],
        dxfRender: ['Three', 'ThreeTextGeometry', 'ThreeFontUtils', 'ThreeHelvetiker'],
        dxfParser: ['Three', 'ThreeTextGeometry', 'ThreeFontUtils', 'ThreeHelvetiker', 'dxfRender'],
    }
});

cprequire_test(["inline:com-chilipeppr-widget-dxf"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="3dviewer"></div>');

    $('body').append('<div id="testDivForFlashMessageWidget"></div>');



    // init my widget

    $('#' + myWidget.id).css('margin', '10px');
    $('title').html(myWidget.name);



    chilipeppr.load("#3dviewer", "https://raw.githubusercontent.com/openhardwarecoza/widget-3dviewer/master/auto-generated-widget.html", function() {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function(threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            //$('#com-chilipeppr-widget-3dviewer .panel-heading').addClass('hidden');
            //autolevel.addRegionTo3d();
            //autolevel.loadFileFromLocalStorageKey('com-chilipeppr-widget-autolevel-recent8');
            //autolevel.toggleShowMatrix();

            // only init eagle widget once 3d is loaded
            // set doMyOwnDragDrop
            //ew.init(true);
            myWidget.init();
        });
    });

    $('body').append('<div id="test-drag-drop"></div>');
    chilipeppr.load("#test-drag-drop", "http://fiddle.jshell.net/chilipeppr/Z9F6G/show/light/",

        function() {
            cprequire(
                ["inline:com-chilipeppr-elem-dragdrop"],

                function(dd) {
                    dd.init();
                    dd.bind("body", null);
                });
        });

    $('body').append('<div id="com-chilipeppr-flash"></div>');
    chilipeppr.load("#com-chilipeppr-flash",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",

        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        });

    $('body').append('<div class="zhigh" id="com-chilipeppr-ws-dxf">DXF Import Here</div>');
    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.

//// This is the main definition of your widget. Give it a unique name.

cpdefine("inline:com-chilipeppr-widget-dxf", ["chilipeppr_ready", "Clipper", "jqueryuiWidget", "dxfParser", "dxfRender"], function(cp, myclipper, myjqueryui, mydxf, mydxfrenderer) {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-dxf", // Make the id the same as the cpdefine id
        name: "Widget /DXF", // The descriptive name of your widget.
        desc: "DXF Import.", // A description of what your widget does
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            '/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
            '/com-chilipeppr-elem-dragdrop/ondropped': 'We subscribe to this signal at a higher priority to intercept the signal, double check if it is an DXF file and if so, we do not let it propagate by returning false. That way the 3D Viewer, Gcode widget, or other widgets will not get DXF file drag/drop events because they will not know how to interpret them.'
        },
        /**
         * Contains reference to the dxfparser brought in through cpdefine()
         */
        dxfParser: null,
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {

            console.log("DXF Widget starting init.");

            // Addind debug
            console.log("our DXF obj is alive: ", mydxf); //ThreeDxf);
            var parser = new mydxf();
            console.log("DXF parser:", parser);
            this.dxfParser = parser;

            console.log("DXF renderer:", mydxfrenderer);
            //var dxfrenderer = new mydxfrenderer();
            //console.log("DXF renderer:", dxfrenderer);
            //this.dxfRender = dxfrenderer;


            //var dxf = parser.parseSync(fileReader.result);

            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);
            // /com-chilipeppr-elem-dragdrop/ondropped
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onDropped, 8); // default is 10, we do 9 to be higher priority
            console.log('DXF Widget: We did do SetupDragDrop...');

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();

            this.init3d();

            console.log("DXF Widget finished init");

        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-sayhello').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-sayhello').popover("hide");
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Hello Title",
                    "Hello World from widget " + that.id,
                    1000
                );
            });

            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-helloworld2').click(this.onHelloBtnClick.bind(this));

        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onHelloBtnClick: function(evt) {
            console.log("saying hello 2 from btn in tab 1");
            printfromprotoype('We are awesome');
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Hello 2 Title",
                "Hello World 2 from Tab 1 from widget " + this.id,
                2000 /* show for 2 second */
            );

        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we
         * know it was clicked by the user and thus we store it for the next
         * load so we can reset the user's preference. If you don't pass this
         * value in we don't store the preference because it was likely code
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we
         * know it was clicked by the user and thus we store it for the next
         * load so we can reset the user's preference. If you don't pass this
         * value in we don't store the preference because it was likely code
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         *
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },
        setupDragDrop: function() {
            // subscribe to events
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);
            // /com-chilipeppr-elem-dragdrop/ondropped
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onDropped, 8); // default is 10, we do 9 to be higher priority
            console.log('DXF Widget: We did do SetupDragDrop...');
        },
        dxf: null, // contains the DXF Object
        onDropped: function(data, info) {
            console.log("DXF onDropped. len of file:", data.length, "info:", info);
            console.log('DXF Widget: We did do OnDropped...');
            //chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "DXF Loaded", "Looks like you dropped in a DXF ", 1000);
            console.log("Looks like you dropped in a DXF");
            // we have the data
            // double check it's a board file, cuz it could be gcode
            //if (data.match(/<!DOCTYPE eagle SYSTEM "eagle.dtd">/i)) {

            // check that there's a board tag
            //    if (data.match(/<board>/i)) {
            //        console.log("we have an eagle board file!");
            //        this.colorSignal = 9249571;
            //        this.colorSmd = 9249571;
            //        localStorage.setItem('com-chilipeppr-widget-eagle-lastDropped', data);
            //        localStorage.setItem('com-chilipeppr-widget-eagle-lastDropped-info', JSON.stringify(info));
            //        this.fileInfo = info;
            //        console.log("saved brd file to localstorage");
            //        this.open(data, info);
            //    } else {
            //        console.log("looks like it is an eagle generated file, but not a board file. sad.");
            //        chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "Looks like you dragged in an Eagle CAD file, but it contains no board tag. You may have dragged in a schematic instead. Please retry with a valid board file.");
            //   }

            // now, we need to return false so no other widgets see this
            // drag/drop event because they won't know how to handle
            // an Eagle Brd file
            //return false;
            //} else {
            if (info.name.match(/.dxf$/i)) {
                // this looks like an Eagle brd file, but it's binary
                //chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "DXF Found", "File matched as *.dxf ", 1000);
                console.log("file name does match *.dxf");
                this.open(data, info);
                return false;
            }
            else {
                console.log("Didnt get a dxf.");
            }
            //}
        },
        onDragOver: function() {
            console.log("onDragOver");
            $('#com-chilipeppr-widget-dxf').addClass("panel-primary");
        },
        onDragLeave: function() {
            console.log("onDragLeave");
            $('#com-chilipeppr-widget-dxf').removeClass("panel-primary");
        },
        clear3dViewer: function() {
            console.log("clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            //if (this.obj3d) this.obj3d.children = [];
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            this.is3dViewerReady = true;
        },

          init3d: function () {
            this.get3dObj();
            if (this.obj3d == null) {
                console.log("loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function () {
                    that.get3dObj();
                    if (that.obj3d == null) {
                        attempts++;
                        setTimeout(function () {
                            that.get3dObj();
                            if (that.obj3d == null) {
                                console.log("giving up on trying to get 3d");
                            } else {
                                console.log("succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    } else {
                        console.log("succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            } else {
                this.onInit3dSuccess();
            }

        },
        onInit3dSuccess: function () {
            console.log("onInit3dSuccess. That means we finally got an object back.");
            this.clear3dViewer();

            // open the last file
            var that = this;
            //setTimeout(function () {
                that.open();
            //}, 1000);
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function (callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function (data, meta) {
            console.log("got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                //setTimeout(this.userCallbackForGet3dObj.bind(this), 200);
                //console.log("going to call callback after getting back the new 3dobj. this.userCallbackForGet3dObj:", this.userCallbackForGet3dObj);
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        is3dViewerReady: false,
        clear3dViewer: function () {
            console.log("clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            //if (this.obj3d) this.obj3d.children = [];
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            this.is3dViewerReady = true;
        },

        dxf: null,
        cadCanvas: null,
        mySceneGroup: null,
        sceneReAddMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.add(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemoveMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.remove(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneAdd: function (obj) {
            console.log("InsideScene Add :", obj);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneadd", obj);
            //chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneadd", obj);

            // this method of adding puts us in the object that contains rendered Gcode
            // that's one option, but when we send gcode to workspace we get overwritten
            // then
            //this.obj3d.add(obj);

            // let's add our Eagle BRD content outside the scope of the Gcode content
            // // so that we have it stay while the Gcode 3D Viewer still functions
            //if (this.mySceneGroup == null) {
            //   this.mySceneGroup = new THREE.Group();
            //   this.obj3d.add(this.mySceneGroup);
            //    }
            //  this.mySceneGroup.add(obj);
            //this.obj3dmeta.scene.add(obj);

            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemove: function (obj) {
            //chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj);
            //this.obj3d.remove(obj);
            //this.obj3dmeta.scene.remove(obj);
            if (this.mySceneGroup != null)
                this.mySceneGroup.remove(obj);
            this.obj3dmeta.widget.wakeAnimate();
        },



        /**
        * Viewer class for a dxf object.*
        * @param {Object} data - the dxf object
        * @param {number} width - width of the rendering canvas in pixels
        * @param {Number } height - height of the rendering canvas in pixels
        * @constructor */

        processDXF: function(data) {
            console.log("Inside Processdxf: ", data);
            //console.log(" If I am right this is the one running now - from renderer.js pulled in via requirejs "); // want to see it clearly
            var i, entity;

            for (i = 0; i < data.entities.length; i++) {
                entity = data.entities[i];

                if (entity.type === 'DIMENSION') {
                    if (entity.block) {
                        var block = data.blocks[entity.block];
                        for (j = 0; j < block.entities.length; j++) {
                           this.drawEntity(block.entities[j], data);
                            //console.log('Sending DXF data to drawEntity function...');
                        }
                    }
                    else {
                        console.log('WARNING: No block for DIMENSION entity');
                    }
                }
                else {
                    this.drawEntity(entity, data);
                    //console.log("Running drawEntity for ", entity, " which is ", data);
                }
            }
        },

            drawEntity: function(entity, data) {
                console.log("inside drawEntity function now to process Entity: ", entity);

                if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                    this.drawCircle(entity, data);
                }
                else if (entity.type === 'LWPOLYLINE' || entity.type === 'LWPOLYLINE' || entity.type === 'LINE') {
                    this.drawLine(entity, data);
                }
                else if (entity.type === 'TEXT') {
                    this.drawText(entity, data);
                }
                else if (entity.type === 'SOLID') {
                    this.drawSolid(entity, data);
                }
                else if (entity.type === 'POINT') {
                    this.drawPoint(entity, data);
                }
            },

            createLineTypeShaders: function(data) {
                var ltype, type;
                var ltypes = data.tables.lineTypes;

                for (type in ltypes) {
                    ltype = ltypes[type];
                    if (!ltype.pattern) continue;
                    ltype.material = this.createDashedLineShader(ltype.pattern);
                }
            },

            createDashedLineShader: function(pattern) {
                var i,
                    dashedLineShader = {},
                    totalLength = 0.0;

                for (i = 0; i < pattern.length; i++) {
                    totalLength += Math.abs(pattern[i]);
                }

                dashedLineShader.uniforms = THREE.UniformsUtils.merge([

                    THREE.UniformsLib['common'],
                    THREE.UniformsLib['fog'],

                    {
                        'pattern': {
                            type: 'fv1',
                            value: pattern
                        },
                        'patternLength': {
                            type: 'f',
                            value: totalLength
                        }
                    }

                ]);

                dashedLineShader.vertexShader = [
                    'attribute float lineDistance;',

                    'varying float vLineDistance;',

                    THREE.ShaderChunk['color_pars_vertex'],

                    'void main() {',

                    THREE.ShaderChunk['color_vertex'],

                    'vLineDistance = lineDistance;',

                    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

                    '}'
                ].join('\n');

                dashedLineShader.fragmentShader = [
                    'uniform vec3 diffuse;',
                    'uniform float opacity;',

                    'uniform float pattern[' + pattern.length + '];',
                    'uniform float patternLength;',

                    'varying float vLineDistance;',

                    THREE.ShaderChunk['color_pars_fragment'],
                    THREE.ShaderChunk['fog_pars_fragment'],

                    'void main() {',

                    'float pos = mod(vLineDistance, patternLength);',

                    'for ( int i = 0; i < ' + pattern.length + '; i++ ) {',
                    'pos = pos - abs(pattern[i]);',
                    'if( pos < 0.0 ) {',
                    'if( pattern[i] > 0.0 ) {',
                    'gl_FragColor = vec4(1.0, 0.0, 0.0, opacity );',
                    'break;',
                    '}',
                    'discard;',
                    '}',

                    '}',

                    THREE.ShaderChunk['color_fragment'],
                    THREE.ShaderChunk['fog_fragment'],

                    '}'
                ].join('\n');

                return dashedLineShader;
            },




         open: function(data, info) {

         // if we are passed the file data, then use that, otherwise look to
         // see if we had one saved from before, i.e. this is a browser reload scenario
         // and we'd like to show them their recent Eagle BRD
         var file;
         if (data) {
             console.log("open. loading from passed in data. data.length:", data.length, "info:", info);
             file = data;
             this.fileInfo = info;
             $('#com-chilipeppr-widget-dxf .dxf-draghere').addClass("hidden");
         }
         else {

             // try to retrieve the most recent board file
             file = localStorage.getItem('com-chilipeppr-widget-dxf-lastDropped');
             if (file && file.length > 0) {
                 this.fileInfo = localStorage.getItem('com-chilipeppr-widget-dxf-lastDropped-info');
                 if (this.fileInfo && this.fileInfo.match(/^{/)) {
                     this.fileInfo = JSON.parse(this.fileInfo);
                 }
                 console.log("open. loading data from localStorage. file.length:", file.length, "info:", this.fileInfo);
             }
             else {
                 // there's no file, just return
                 return;
             }

         }

         if (file) {

             // make sure this file is an Eagle board
             //if (!(file.match(/<!DOCTYPE eagle SYSTEM "eagle.dtd">/i))) {
             //    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Loading Eagle BRD", "It looks like you had a previous Eagle BRD, but it doesn't seem to be the correct format.", 10 * 1000);
             //    return;
             //
             //}

             //chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Opening DXF", "Parsing DXF file.", 3000, true);
             console.log("Parsing the DXF");
             // reset main properties
             //this.activeLayer = 'Top';
             //this.clearEagleBrd();
             this.clear3dViewer();

             //this.sceneRemoveMySceneGroup();  //ray testing some stuff
             //this.mySceneGroup = null;

             // create board
             //this.eagle = new EagleCanvas('eagle-canvas');
             //this.eagle.loadText(file);
             //this.eagle.setScaleToFit('eagle-main');
             //this.eagle.setScale(this.eagle.getScale() / 2);
             //this.eagle.draw();
             //var that = this;
             //this.draw3d(function() {
             //    console.log("got callback from draw3d");
             //}
             //);
             //var parser2 = new DxfParser();
             //var dxf2 = DxfParser.parseSync(file);
             var dxf2 = this.dxfParser.parseSync(file);
             console.log("Setup DXFParser. dxf2:", dxf2);
             //var cadCanvas = new processDXF(dxf2);
             this.processDXF(dxf2);
             //console.log("DXF cadCanvas:", cadCanvas);

             $('#com-chilipeppr-widget-dxf .btn-dxf-sendgcodetows').prop('disabled', false);
         }
         else {
             console.log("no last file, so not opening");
         }
     },

 }
 });
