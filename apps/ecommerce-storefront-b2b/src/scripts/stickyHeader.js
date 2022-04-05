// When the user scrolls the page, execute myFunction
window.onscroll = function () { myFunction() };
function myFunction() {
    if (document.readyState == 'complete' || document.readyState == 'interactive') {
        // Get the navbar
        var navbar = document.getElementById("header");
        // Get the offset position of the navbar
        var sticky = navbar.offsetTop;
        if (window.pageYOffset >= sticky) {
            // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }
    // var scrollable = $('.scrollable');
    //     console.log(scrollable,"Scrollable")

    //     //
    //     scrollable.slimScroll({
    //         height: '20rem',
    //         // width: '24rem',
    //        // start: 'top'
    //     });
    
}

//when the user scrolls the page ,execute animations
//window.onload = function () { myFunction1() };
window.addEventListener('load', onLoadFunction, false);

function onLoadFunction() {
    var wow = new WOW(
        {
            boxClass: 'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 0,          // distance to the element when triggering the animation (default is 0)
            mobile: true,       // trigger animations on mobile devices (default is true)
            live: true,       // act on asynchronously loaded content (default is true)
            callback: function (box) {
                // the callback is fired every time an animation is started
                // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
        }
    );
    wow.init();

  
}

//Header LoggedIn User Section Dropdown
$(document).on('click', '.hasDD', function () { hasDDFunction() });

$(document).on('click', function (e) { 
    
    $(".mainnav ul ul").slideUp(); 
    
    $(this)
    .find(".mainnav > ul li")
    .removeClass("on");
    
    e.stopPropagation();

});
function hasDDFunction(){
    $(".mainnav div").click(function () {
        $("ul").slideToggle();
        $("ul ul").css("display", "none");
        $(".mainnav .on").toggleClass("on");
    });
    $(".hasDD").click(function (e) {
        $(this)
            .find("> ul")
            .slideToggle();
        $(this)
            .find("> ul ul")
            .css("display", "none");
        $(this)
            .find("> ul li")
            .removeClass("on");
        $(this).toggleClass("on");
        e.stopPropagation();
    });
}

// This handler will be executed only once when the cursor
// moves over the unordered list
// $(document).on('mouseenter', '.xzoom-container', function () { mouseOverFunction() });
$(document).on('mouseover', '.xzoom-container', function () { mouseOverFunction() });

// $(".xzoom-container").onmouseover = function () { mouseOverFunction() };
function mouseOverFunction() {
   
        console.log("mouseOvercheck");

            $('.xzoom, .xzoom-gallery').xzoom({ zoomWidth:200, zoomHeight:150, title: true, tint: '#333', Xoffset: 15 });
            
            $('.xzoom2, .xzoom-gallery2').xzoom({ position: '#xzoom2-id', tint: '#ffa200' });
            $('.xzoom3, .xzoom-gallery3').xzoom({ position: 'lens', lensShape: 'circle', sourceClass: 'xzoom-hidden' });
            $('.xzoom4, .xzoom-gallery4').xzoom({ tint: '#006699', Xoffset: 15 });
            $('.xzoom5, .xzoom-gallery5').xzoom({ tint: '#006699', Xoffset: 15 });
           
            //console.log(d);
            console.log($('.xzoom, .xzoom-gallery'));

            //Integration with hammer.js
            var isTouchSupported = 'ontouchstart' in window;
    
            if (isTouchSupported) {
                //If touch device
                $('.xzoom, .xzoom2, .xzoom3, .xzoom4, .xzoom5').each(function () {
                    var xzoom = $(this).data('xzoom');
                    xzoom.eventunbind();
                });
    
                $('.xzoom, .xzoom2, .xzoom3').each(function () {
                    var xzoom = $(this).data('xzoom');
                    $(this).hammer().on("tap", function (event) {
                        event.pageX = event.gesture.center.pageX;
                        event.pageY = event.gesture.center.pageY;
                        var s = 1, ls;
    
                        xzoom.eventmove = function (element) {
                            element.hammer().on('drag', function (event) {
                                event.pageX = event.gesture.center.pageX;
                                event.pageY = event.gesture.center.pageY;
                                xzoom.movezoom(event);
                                event.gesture.preventDefault();
                            });
                        }
    
                        xzoom.eventleave = function (element) {
                            element.hammer().on('tap', function (event) {
                                xzoom.closezoom();
                            });
                        }
                        xzoom.openzoom(event);
                    });
                });
    
                $('.xzoom4').each(function () {
                    var xzoom = $(this).data('xzoom');
                    $(this).hammer().on("tap", function (event) {
                        event.pageX = event.gesture.center.pageX;
                        event.pageY = event.gesture.center.pageY;
                        var s = 1, ls;
    
                        xzoom.eventmove = function (element) {
                            element.hammer().on('drag', function (event) {
                                event.pageX = event.gesture.center.pageX;
                                event.pageY = event.gesture.center.pageY;
                                xzoom.movezoom(event);
                                event.gesture.preventDefault();
                            });
                        }
    
                        var counter = 0;
                        xzoom.eventclick = function (element) {
                            element.hammer().on('tap', function () {
                                counter++;
                                if (counter == 1) setTimeout(openfancy, 300);
                                event.gesture.preventDefault();
                            });
                        }
    
                        function openfancy() {
                            if (counter == 2) {
                                xzoom.closezoom();
                                $.fancybox.open(xzoom.gallery().cgallery);
                            } else {
                                xzoom.closezoom();
                            }
                            counter = 0;
                        }
                        xzoom.openzoom(event);
                    });
                });
    
                $('.xzoom5').each(function () {
                    var xzoom = $(this).data('xzoom');
                    $(this).hammer().on("tap", function (event) {
                        event.pageX = event.gesture.center.pageX;
                        event.pageY = event.gesture.center.pageY;
                        var s = 1, ls;
    
                        xzoom.eventmove = function (element) {
                            element.hammer().on('drag', function (event) {
                                event.pageX = event.gesture.center.pageX;
                                event.pageY = event.gesture.center.pageY;
                                xzoom.movezoom(event);
                                event.gesture.preventDefault();
                            });
                        }
    
                        var counter = 0;
                        xzoom.eventclick = function (element) {
                            element.hammer().on('tap', function () {
                                counter++;
                                if (counter == 1) setTimeout(openmagnific, 300);
                                event.gesture.preventDefault();
                            });
                        }
    
                        function openmagnific() {
                            if (counter == 2) {
                                xzoom.closezoom();
                                var gallery = xzoom.gallery().cgallery;
                                var i, images = new Array();
                                for (i in gallery) {
                                    images[i] = { src: gallery[i] };
                                }
                                $.magnificPopup.open({ items: images, type: 'image', gallery: { enabled: true } });
                            } else {
                                xzoom.closezoom();
                            }
                            counter = 0;
                        }
                        xzoom.openzoom(event);
                    });
                });
    
            } else {
                //If not touch device
    
                //Integration with fancybox plugin
                $('#xzoom-fancy').bind('click', function (event) {
                    var xzoom = $(this).data('xzoom');
                    xzoom.closezoom();
                    $.fancybox.open(xzoom.gallery().cgallery, { padding: 0, helpers: { overlay: { locked: false } } });
                    event.preventDefault();
                });
    
                //Integration with magnific popup plugin
                $('#xzoom-magnific').bind('click', function (event) {
                    var xzoom = $(this).data('xzoom');
                    xzoom.closezoom();
                    var gallery = xzoom.gallery().cgallery;
                    var i, images = new Array();
                    for (i in gallery) {
                        images[i] = { src: gallery[i] };
                    }
                    $.magnificPopup.open({ items: images, type: 'image', gallery: { enabled: true } });
                    event.preventDefault();
                });
            }
    
    
    
}





















// $(document).on('click', '.form-check-input' , function () { clickFunction() });
// function clickFunction() {
    
//     var check2 = $('#btnId').prop('disabled')
//     if(check2 == false){
        
//         $('#btnId').prop('disabled', true);
//     }
//     else
//     {
//         $('#btnId').prop('disabled', false);
//     }
// }







// window.onscroll = function () {
//     // Cache DOM Element
//     var scrollable = $('.scrollable');
//     console.log(scrollable,"Scrollable")

//     //
//     scrollable.slimScroll({
//         height: '22rem',
//         // width: '24rem',
//        // start: 'top'
//     });

//     // Keeping the Scrollable state separate
//     // var state = {
//     //     pos: {
//     //         lowest: 0,
//     //         current: 0
//     //     },

//     //     offset: {
//     //         top: [0, 0] //Old Offset, New Offset
//     //     }
//     // };

//     // //
//     // scrollable.slimScroll().bind('slimscrolling', function (e, pos) {
//     //     // Update the Scroll Position and Offset

//     //     // Highest Position
//     //     state.pos.highest = pos !== state.pos.highest ?
//     //         pos > state.pos.highest ? pos : state.pos.highest :
//     //         state.pos.highest;

//     //     // Update Offset State
//     //     state.offset.top.push(pos - state.pos.lowest);
//     //     state.offset.top.shift();

//     //     if (state.offset.top[0] < state.offset.top[1]) {
//     //         console.log('...Scrolling Down');
//     //         // ... YOUR CODE ...
//     //     } else if (state.offset.top[1] < state.offset.top[0]) {
//     //         console.log('Scrolling Up...');
//     //         // ... YOUR CODE ...
//     //     } else {
//     //         console.log('Not Scrolling');
//     //         // ... YOUR CODE ...
//     //     }
//     // });
// };
//# sourceURL=pen.js





