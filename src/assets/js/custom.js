function myTest() {
    (function($) {
        $.fn.changeElementType = function(newType) {
            var attrs = {};
    
            $.each(this[0].attributes, function(idx, attr) {
                attrs[attr.nodeName] = attr.nodeValue;
            });
    
            this.replaceWith(function() {
                return $("<" + newType + "/>", attrs).append($(this).contents());
            });
        };
    })(jQuery);
        cusDD("#select1", "custom"); 
        $(".cusDD_opt").on('click', function() {
        });
}
function contructSelectTag(select, style){
    (function($) {
        $.fn.changeElementType = function(newType) {
            var attrs = {};
    
            $.each(this[0].attributes, function(idx, attr) {
                attrs[attr.nodeName] = attr.nodeValue;
            });
    
            this.replaceWith(function() {
                return $("<" + newType + "/>", attrs).append($(this).contents());
            });
        };
    })(jQuery);
        cusDD(select, style); 
        // $(".cusDD_opt").on('click', function() {
        //   alert($(this).parent().find("[selected='selected']").text());
        // });
}
$(function() {
 });


function cusDD(select, style) {
    /*Style Switcher*/
    var ddstyle = "";
    if (!style) {
      ddstyle = "cusDD_default";
    } else if (style == "slick dark") {
      ddstyle = "cusDD_slick_d";
    } else if (style == "slick light") {
      ddstyle = "cusDD_slick_l";
    } else {
      ddstyle = style;
    }
  
    for (var i = 0; i < $(select).length; i++) {
      var curr = $($(select)[i]);
      
      //Replace select with div
      curr.addClass(ddstyle+" cusDD").changeElementType("div");
      
      //put drop downs in a container
      //Replace options with divs
      curr = $($(select)[i]);
      curr.find("option").wrapAll("<div class='cusDD_options' />");
      curr.find("option").addClass("cusDD_opt").each(function() {
        $(this).changeElementType("div");
      });
      
      //Add selector and drop down
      curr.prepend("<div class='cusDD_select'><div class='cusDD_arrow'></div></div>");
      
      //Add default option
      var def = (curr.find("div[selected='selected']").length >= 1) ? $(curr.find("div[selected='selected']")) : $(curr.find(".cusDD_opt")[0]);
      curr.find(".cusDD_select").prepend(def.text());
      
    } //End for loop
  
    $(document).click(function() {
      $(".cusDD_options").slideUp(200);
      $(".cusDD_arrow").removeClass("active");
    })
    
    $(select).click(function(e) {
      e.stopPropagation();
      $(this).find(".cusDD_options").slideToggle(200);
      $(this).find(".cusDD_arrow").toggleClass("active");
    })
    $(".cusDD_opt").click(function() {
      $($(this).parent()).siblings(".cusDD_select").contents()[0].nodeValue = $(this).text();
      $(this).parent().find(".cusDD_opt").removeAttr("selected");
      $(this).attr("selected", "selected");
    });
  
    } // End function)



     /**
   * Get the user IP throught the webkitRTCPeerConnection
   * @param onNewIP {Function} listener function to expose the IP locally
   * @return undefined
   */
  var ClientIP = "";
  function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
      }),
      noop = function () {
      },
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;
    function iterateIP(ip) {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    }
    //create a bogus data channel
    pc.createDataChannel("");
    // create offer and set local description
    pc.createOffer().then(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });
      pc.setLocalDescription(sdp, noop, noop);
    }).catch(function (reason) {
      // An error occurred, so handle the failure to connect
    });
    //listen for candidate events
    pc.onicecandidate = function (ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  }

 function retrieveIP(){
  getUserIP(function (ip) {
    if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)){
      ClientIP = ip;
      console.log(ClientIP);
    }
  });
}


// function CheckElVisible() {

// }

// CheckElVisible.prototype = {
//     constructor: CheckElVisible,
//     isElementInView: function (element, fullyInView) {
//         var pageTop = $(window).scrollTop();
//         var pageBottom = pageTop + $(window).height();
//         var elementTop = $(element).offset().top;
//         var elementBottom = elementTop + $(element).height();

//         if (fullyInView === true) {
//             return ((pageTop < elementTop) && (pageBottom > elementBottom));
//         } else {
//             return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
//         }
//     }
// };

// var CheckElVisible = new CheckElVisible();