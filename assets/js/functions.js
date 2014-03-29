///////////////////////////////		
// Application Object
///////////////////////////////

var debugMode = false,
	scrollSpeed = 600,

	el,
	bp,
	App = {

		elements: {
			body: $("body"),
			menu: $("#menu"),
			loader: $("#loader"),
			header: $("#header"),
			postIndex: $("#content .post-index"),
			topScroller: $("#topscroller")
		},

		breakpoints: {
			medium: 768,
			large: 1024
		},
		
		init: function(){
			el = this.elements;
			bp = this.breakpoints;
			this.bindUIActions();
			this.headSection.init();
			this.prettifyCode();
		},

		bindUIActions: function(){
			this.menuToggle();
			this.initTopScroller();
			this.postIndexActions();
		},

		postIndexActions: function(){
			el.postIndex.find(".post").hover(function(){
				$(this).addClass("expand");
			},
			function(){
				el.postIndex.find(".post").removeClass("expand");
			})

			el.postIndex.find(".articlelink").click(function(e){
				if(ww() < bp.medium) return;

				e.preventDefault();
				var href = $(this).attr("href"),
					post = $(this).parent(".post"),
					position = post.position(),
					offset = position.left + (post.width()/2);

				el.loader.appendTo(post).fadeIn("fast");
				
				var anim = window.setTimeout(function(){

					post.addClass("active").removeClass("animate-in").fadeTo(700, 0.01);
					$("#expander").css("left", offset).animate({
						width: "100%",
						left: 0
					}, 700, "easeInOutExpo", function(){
						window.location = href;
					});

				}, 200);

			})
		},

		menuToggle: function(){
			$("#menu-toggle").click(function(e){
				e.preventDefault();
				if(ww() < bp.medium){
					el.menu.slideToggle(300, "easeInOutExpo");
				}
				else el.body.toggleClass("open-menu");
			})
		},

		headSection: {
			init: function(){
				if(ww() < bp.medium || !$(".single.post").length) return;

				var postHeader = $(".single .post-header"),
					postHeaderArrow = postHeader.find(".arrow");

				// set height
				this.setHeight();
				$(window).bind("resize", this.setHeight);

				// title fittext
				postHeader.find(".post-title").fitText(1, { 
					minFontSize: '52px', 
					maxFontSize: '96px' 
				});

				// arrow to scroll to post content
				postHeaderArrow.click(function(e){
					e.preventDefault();
					$("html, body").animate({ scrollTop: postHeader.outerHeight()+8 }, scrollSpeed, "easeOutCirc");
				});

				// set cover image, if there is one
				this.findCoverImage();

				// set parallax effect
				this.setParallax();
				
			},
			setHeight: function(){
				var height = (ww() < bp.medium) ? height="auto" : (wh()-7);
				$(".single .post-header").css("height", height);
			},
			setParallax: function(){
				function scrollTitle() {
				    scrollPos = $(this).scrollTop();

				    $('#titlesection').css({
				      'margin-top' : -(scrollPos/3)+"px",
				      'opacity' : 1-(scrollPos/500)
				    }); 
				    $('#cover').css({
				    	'webkit-filter' : 'grayscale('+(100/(500/scrollPos))+'%)'
				    });
				    $(".single .post-header .arrow").css({'opacity' : 1-(scrollPos/200)});  
				}

				// skip this on touch devices, causes some weird bugs sometimes
				if(!Modernizr.touch){
					$(window).scroll(function() {	      
				       scrollTitle();	      
					});
				}
			},
			findCoverImage: function(){
				var lastSrc = '';  
				$.fn.ifExists = function(fn) {
				  if (this.length) {
					$(fn(this));
				  }
				};
				
				var coverImg = $("img[alt='cover']");
				coverImg.ifExists(function(){
				
					lastSrc = coverImg.attr('src');
					coverImg.parent("p").remove();
					
					$(".single .post-header").addClass("has-cover");
					$(".single #cover").css({
						'background-image':'url('+ lastSrc +')'
					});
					
				});
			}
			
		},

		initTopScroller: function(){
			el.topScroller.click(function(e){
				e.preventDefault();
				$("html, body").animate({ scrollTop: 0 }, scrollSpeed, "easeOutCirc");
				return false;
			});
			$(window).bind("scroll resize", function(){	
				if ($(this).scrollTop() > 500 && ww() >= bp.medium)
					el.topScroller.removeClass("off").addClass("on");
				else 
					el.topScroller.removeClass("on").addClass("off");
			});
		},

		prettifyCode: function(){
			if(!$(".post.single pre > code").length) return;
			
			var codes = $(".post.single").find("pre > code");
			codes.each(function(){
				$(this).parent("pre").addClass("prettyprint");
			});
			prettyPrint();
		}

	};


///////////////////////////////		
// Helper Functions
///////////////////////////////

function wh(){ 
	return $(window).height(); 
}
function ww(){ 
	return (hasVerticalScroll()) ? $(window).width() + 15 : $(window).width();
}
function hasVerticalScroll(){
    return (document.documentElement.scrollHeight !== document.documentElement.clientHeight);
}

jQuery.browser={};(function(){jQuery.browser.msie=false;
jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){
jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();

///////////////////////////////////
// Easing
///////////////////////////////////


$.easing.easeOutCirc = function (x, t, b, c, d) {
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}
$.easing.easeInOutExpo = function (x, t, b, c, d) {
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
}

///////////////////////////////		
// Ready, Set, Go!
///////////////////////////////

$(document).ready(function(){
	App.init();
});
 
