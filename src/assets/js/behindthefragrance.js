
    
//     // Cache selectors
//     var lastId,
//      topMenu = $("#mainNav"),
//      topMenuHeight = topMenu.outerHeight(),
//      // All list items
//      menuItems = topMenu.find("a"),
//      // Anchors corresponding to menu items
//      scrollItems = menuItems.map(function(){
//        var item = $($(this).attr("href"));
//         if (item.length) { return item; }
//      });
    
//     // Bind click handler to menu items so we can get a fancy scroll animation
//     menuItems.click(function(e){
//       var href = $(this).attr("href"),
//           offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
//       $('html, body').stop().animate({ 
//           scrollTop: offsetTop
//       }, 850); // speed of scroll
//       e.preventDefault();
//     });
    
//     function bindScroll(){
//     // Bind to scroll
//     $(window).scroll(function(){
//        // Get container scroll position
//        var fromTop = $(this).scrollTop()+topMenuHeight;

//        // Get id of current scroll item
//        var cur = scrollItems.map(function(){
//          if ($(this).offset().top < fromTop)
//            return this;
//        });
//        // Get the id of the current element
//        cur = cur[cur.length-1];
//        var id = cur && cur.length ? cur[0].id : "";

//        if (lastId !== id) {
//            lastId = id;
//            // Set/remove active class
//            menuItems
//              .parent().removeClass("active")
//              .end().filter("[href=#"+id+"]").parent().addClass("active");
           
//        }
//     });
// }
    
//     // fixed menu


    
// function invokeFunction(){


//     // $(function(){
//         createSticky($(".scroll-nav"));
//         createSection($(".section-bcc"));
//         createActivelink($(".active-nav-link"));
//     // });
// }

//     function createSticky(sticky) {

//         if (typeof sticky !== "undefined") {

//             var	pos = sticky.offset().top,
//                     win = $(window);

//             win.on("scroll", function() {
//                 win.scrollTop() >= pos ? sticky.addClass("fixed") : sticky.removeClass("fixed");
//             });			
//         }
//     }



//     function createSection(sections) {

//         if (typeof sections !== "undefined") {

//             var	pos = sections.offset().top-61,
//                     win = $(window);

//             win.on("scroll", function() {
//                 win.scrollTop() >= pos ? sections.addClass("top") : sections.removeClass("top");
//             });			
//         }
//     }


//     function createActivelink(activelink) {

//         if (typeof activelink !== "undefined") {

//             var	pos = activelink.offset().top,
//                     win = $(window);

//             win.on("scroll", function() {
//                 win.scrollTop() >= pos ? activelink.removeClass("active-nav-link") : activelink.addClass("active-nav-link");
//             });			
//         }
//     }

//     function constructMobData(){
//     /* mobile nav */
//     // $(document).ready(function() {
//         if ($(window).width() < 600) {
//             $(window).scroll(function() {
//             if ($(this).scrollTop() > 200) {
//                 $('.mobile-nav').fadeIn(500);
//             } else {
//                 $('.mobile-nav').fadeOut(500);
//             }
//             });

//         $('.mobile-nav > .open').click(function() {
//             $("nav.scroll-nav").css('display', 'flex');
//             $('html').css({
//                 overflow: 'hidden'
//             });
//             $(".mobile-nav > .open").css('display', 'none');
//             $(".mobile-nav > .closenav").css('display', 'block');
//         })
//         $('.mobile-nav > .closenav').click(function() {
//             $("nav.scroll-nav").css('display', 'none');
//             $('html').removeAttr('style');
//             $(".mobile-nav > .open").css('display', 'block');
//             $(".mobile-nav > .closenav").css('display', 'none');
//         })
//         $('nav li a').click(function() {
//             $("nav.scroll-nav").css('display', 'none');
//             $('html').removeAttr('style');
//             $(".mobile-nav > .open").css('display', 'block');
//             $(".mobile-nav > .closenav").css('display', 'none');
//         })

//         }
//     }   
//         // Pre-loader
//         $(window).load(function() {
//             $('#preloader-overlay').fadeOut('slow', function() {
//                 $(this).remove();
//             });
//         });
        
//     // });
    
    
//     if ($(window).width() < 600) {
//         $('#scroll-next').click(function() {
//             $('html,body').animate({
//                 scrollTop: $('#mobileBtn').offset().top
//             }, 1000);
//         });
//     }
//     else {
//         $('#scroll-next').click(function() {
//             $('html,body').animate({
//                 scrollTop: $('#theCreator').offset().top-60
//             }, 1000);
//         });
//     }
    
//     function loadYoutube(){
//     // video jquery
//     // (function ( $ ) {
 
//     $.fn.YouTubePopUp = function(options) {

//         var YouTubePopUpOptions = $.extend({
//                 autoplay: 1
//         }, options );

//         $(this).on('click', function (e) {

//             var youtubeLink = $(this).attr("href");

//             if( youtubeLink.match(/(youtube.com)/) ){
//                 var split_c = "v=";
//                 var split_n = 1;
//             }

//             if( youtubeLink.match(/(youtu.be)/) || youtubeLink.match(/(vimeo.com\/)+[0-9]/) ){
//                 var split_c = "";
//                 var split_n = 3;
//             }

//             if( youtubeLink.match(/(vimeo.com\/)+[a-zA-Z]/) ){
//                 var split_c = "";
//                 var split_n = 5;
//             }

//             var getYouTubeVideoID = youtubeLink.split(split_c)[split_n];

//             var cleanVideoID = getYouTubeVideoID.replace(/(&)+(.*)/, "");

//             if( youtubeLink.match(/(youtu.be)/) || youtubeLink.match(/(youtube.com)/) ){
//                 var videoEmbedLink = "https://www.youtube.com/embed"+cleanVideoID+"?rel=0&showinfo=0&color=white&wmode=opaque&autoplay="+YouTubePopUpOptions.autoplay+"";
//             }

//             if( youtubeLink.match(/(vimeo.com\/)+[0-9]/) || youtubeLink.match(/(vimeo.com\/)+[a-zA-Z]/) ){
//                 var videoEmbedLink = "https://player.vimeo.com/video"+cleanVideoID+"?rel=0&showinfo=0&color=white&wmode=opaque&autoplay="+YouTubePopUpOptions.autoplay+"";
//             }

//             $("body").append('<div class="YouTubePopUp-Wrap YouTubePopUp-animation"><div class="YouTubePopUp-Content"><iframe src="'+videoEmbedLink+'" allowfullscreen></iframe><span class="close-video-btn">Close X</span></div></div>');
            
//             $('html').css({
//                 overflow: 'hidden'
//             });

//             if( $('.YouTubePopUp-Wrap').hasClass('YouTubePopUp-animation') ){
//                 setTimeout(function() {
//                     $('.YouTubePopUp-Wrap').removeClass("YouTubePopUp-animation");
//                 }, 600);
//             }

//             $(".YouTubePopUp-Wrap, .YouTubePopUp-Close").click(function(){
//                 $(".YouTubePopUp-Wrap").addClass("YouTubePopUp-Hide").delay(515).queue(function() { $(this).remove(); });
//                 $('html').removeAttr('style');
//             });

//             e.preventDefault();

//         });

//         $(document).keyup(function(e) {

//             if ( e.keyCode == 27 ){
//                 $('.YouTubePopUp-Wrap, .YouTubePopUp-Close').click();
//             }

//         });

//     };
 
// }
// // }( jQuery ));

