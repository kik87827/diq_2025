if( window.console == undefined ){ console = { log : function(){} }; }
/** browser checker **/
var touchstart = "ontouchstart" in window;
;(function($){$.browserTest=function(a,z){var u='unknown',x='X',m=function(r,h){for(var i=0;i<h.length;i=i+1){r=r.replace(h[i][0],h[i][1]);}return r;},c=function(i,a,b,c){var r={name:m((a.exec(i)||[u,u])[1],b)};r[r.name]=true;r.version=(c.exec(i)||[x,x,x,x])[3];if(r.name.match(/safari/)&&r.version>400){r.version='2.0';}if(r.name==='presto'){r.version=($.browser.version>9.27)?'futhark':'linear_b';}r.versionNumber=parseFloat(r.version,10)||0;r.versionX=(r.version!==x)?(r.version+'').substr(0,1):x;r.className=r.name+r.versionX;return r;};a=(a.match(/Opera|Navigator|Minefield|KHTML|Chrome/)?m(a,[[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/,''],['Chrome Safari','Chrome'],['KHTML','Konqueror'],['Minefield','Firefox'],['Navigator','Netscape']]):a).toLowerCase();$.browser=$.extend((!z)?$.browser:{},c(a,/(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/,[],/(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));$.layout=c(a,/(gecko|konqueror|msie|opera|webkit)/,[['konqueror','khtml'],['msie','trident'],['opera','presto']],/(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);$.os={name:(/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase())||[u])[0].replace('sunos','solaris')};if(!z){$('html').addClass([$.os.name,$.browser.name,$.browser.className,$.layout.name,$.layout.className].join(' '));}};$.browserTest(navigator.userAgent);})(jQuery);//http://jquery.thewikies.com/browser/
var DQ = DQ || {};
DQ = {
	/* 페이지 로드함수 */
	init : function(){
		var funcThis = this;
		$(function(){
			if(touchstart){
				$("html").addClass("touchmode");
			}else{
				$("html").removeClass("touchmode");
			}
			funcThis.pcCommonInit();
			funcThis.dimLayerControl();
			funcThis.reformFunc();
		});
		$(window).on("load",function(){
			funcThis.oldBrowerPop();
			funcThis.mobileTotal();
			$(window).on("resize",function(){
				var $this = $(this);
				funcThis.mobileTotalResize();
				funcThis.pcCommonResize();
				funcThis.pgbSearchResize();
				funcThis.phReplaceResize();
				funcThis.mcbwboxResizeFunc();
			}).resize();
		});
	},
	mcbwboxResizeFunc : function(){
		var $mcbwbox = $(".mcbwbox"),
			$mcbwArray = [];
		if($mcbwbox.length==0){return;}
		$mcbwbox.css("height","");
		$mcbwbox.each(function(){
			$mcbwArray.push($(this).height());
		});
		if($(window).width()<1023){
			$mcbwbox.css("height","");
		}else{
			$mcbwbox.css("height",Math.max.apply(null,$mcbwArray));
		}
	},
	togtableFunc : function(){
		$(function(){
			var $togtbag_list_w = $(".togtbag_list_w");
			$togtbag_list_w.each(function(){
				var $t_list_w = $(this),
					$togtable = $t_list_w.find(".togcell_list_w"),
					$togcontents_w = $t_list_w.find(".togcontents_w");
				$togtable.on("click",function(){
					var $this = $(this),
						$t_togcontents_w = $this.next(".togcontents_w");
					$togcontents_w.not($t_togcontents_w).slideUp();
					$t_togcontents_w.slideToggle();
				});
			});
		});
	},
	togQaFunc : function(){
		$(function(){
			var $qa_list_w = $(".qa_list_w");
			$qa_list_w.each(function(){
				var $t_list_w = $(this),
					$qa_bar = $t_list_w.find(".qa_bar"),
					$qa_cont_w = $t_list_w.find(".qa_cont_w");

				$qa_bar.on("click",function(e){
					var $this = $(this),
						$t_qa_cont_w = $this.next(".qa_cont_w");
					e.preventDefault();
					$qa_bar.not($this).removeClass("active");
					$this.toggleClass("active");
					$qa_cont_w.not($t_qa_cont_w).slideUp();
					$t_qa_cont_w.slideToggle();
				});
			});
		});
	},
	phReplaceResize : function(){
		var $d_placeholder = $(".d_placeholder");
		if($d_placeholder.length==0){return;}

		$d_placeholder.each(function(){
			var $this = $(this),
				$t_next = $this.next(".nrep_place"),
				$t_datap = $this.attr("data-saveplaceholder");

			$t_next.text($t_datap);

			if($(window).width()<359){
				$this.attr("placeholder","");
			}else{
				$this.attr("placeholder",$t_datap);
			}
		});

	},
	pgbSearchResize : function(){
		var $pgbot_search_w = $(".pgbot_search_w"),
			$pagination = $(".pagination"),
			$pagination_wid = $pagination.length ? $pagination.outerWidth() : 0;
		// $pgbot_search_w.css({"max-width":""});
		// $pgbot_search_w.css({"max-width":$pagination_wid});
	},
	d_msbtabFunc : function(){
		var $d_msbtab = $(".d_msbtab .msbtab"),
			$phead_z = $(".phead_z"),
			$phead_z_height = $phead_z.length ? $phead_z.outerHeight() : 0;
		$d_msbtab.on("click",function(e){
			e.preventDefault();
			var $this = $(this),
				$t_target = $($this.attr("href")),
				$t_target_pos = $t_target.length ? $t_target.offset().top-$phead_z_height - 20 : 0;
			$("html,body").animate({"scrollTop":$t_target_pos});
		});
	},
	dimLayerControl : function(){
		var $callbtn = $(".haslayer"),
			objthis = this,
			touchIs = "ontouchstart" in window,
			$modal = $(".dlayer_z");
		if($modal.length===0){return;}

		var readywidth = $(window).width();
		$(window).on("resize",function(){
			var $activelayer = $(".dlayer_z.active"),
				$active_tbox = $activelayer.find(".dlayer_box"),
				$t_td = $activelayer.find(".dlayer_td"),
				$t_tpt = parseInt($t_td.css("padding-top")),
				$t_tpb = parseInt($t_td.css("padding-bottom"));

			if(readywidth == $(window).width() || touchIs){
				return;
			}
			if(($active_tbox.outerHeight()+$t_tpt+$t_tpb) < $(window).height()){
				document.ontouchmove = function(e){ e.preventDefault(); };
				$("body,html").addClass("touchDis2").on("touchmove",function(e){
					e.preventDefault();
				});
			}else{
				$("body,html").removeClass("touchDis2").off("touchmove");
				document.ontouchmove = function(e){ return true; };
			}
		}).resize();

		$callbtn.on("click",function(e){
			var $this = $(this),
				$target = $($this.attr("data-layertarget"));
			e.preventDefault();
			showPopup({target:$target});
		});
		var objThis = this;
		$modal.on("click",".btn_dlayerclose,.closetrigger",function(e){
			var $this = $(this),
				$t_p = $this.parents(".dlayer_z");
			e.preventDefault();
			objThis.dimLayerHide({ 'target' : $t_p});
		});
	},
	dimLayerShow : function(option){
		var $callbtn = null,
			touchIs = "ontouchstart" in window,
			$modal = null,
			$target = null,
			transis = "TransitionEvent" in window,
			$t_box = null,
			$t_td = null,
			$t_tpt = 0,
			$t_tpb = 0;

		$(function(){
			$callbtn = $(".haslayer");
			$modal = $(".dlayer_z");

			$target = $(option.target);
			$t_box = $target.find(".dlayer_box");
			$t_td = $target.find(".dlayer_td");
			$t_tpt = parseInt($t_td.css("padding-top"));
			$t_tpb = parseInt($t_td.css("padding-bottom"));

			if($modal.length===0){return;}
			$modal.removeClass("active");
			$target.addClass("active");

			var boxzoneHeight = $t_box.outerHeight()+$t_tpt+$t_tpb;
			var varheight = 0;
			if(boxzoneHeight > $(window).height()){
				varheight = boxzoneHeight;
			}else{
				varheight = $(window).height();
			}
			$(".page_wrap").css({"z-index":0});
			$t_box.css({"top" : 0});
			heightcheck();
			if("openCallback" in option){
				option.openCallback();
			}

      if(option.buttonCallback && typeof option.buttonCallback === 'function'){
        $target.one('click','a, button', function(e){
          e.preventDefault();
          option.buttonCallback(e);
        })
      }

			function heightcheck(){
				if(touchIs){
					$("body").data("data-scr",$(window).scrollTop()).css({"margin-top":-$(window).scrollTop()}).append($target);
					$("html").addClass("touchDis");
				}else{
					if(boxzoneHeight > $(window).height()){
						$("html").addClass("touchDis");
					}
				}
			}
		});
	},
	dimLayerHide : function(option){
		var $callbtn = null,
			touchIs = "ontouchstart" in window,
			$modal = null,
			$target = null,
			transis = "TransitionEvent" in window,
			$t_box = null,
			$t_box_duration = 0;

		$(function(){
			$callbtn = $(".haslayer");
			$modal = $(".dlayer_z");

			$target = $(option.target);
			$t_box = $target.find(".dlayer_box");
			$t_td = $target.find(".dlayer_td");
			$t_tpt = parseInt($t_td.css("padding-top"));
			$t_tpb = parseInt($t_td.css("padding-bottom"));
			$t_box_duration = transis ? $t_box.css("transition-duration").slice(0,-1)*1000 : 0;

			if($modal.length===0){return;}
			var boxzoneHeight = $t_box.outerHeight()+$t_tpt+$t_tpb;
			var varheight = 0;

			if(boxzoneHeight > $(window).height()){
				varheight = boxzoneHeight;
			}else{
				varheight = $(window).height();
			}

			$target.removeClass("active");
			$(".page_wrap").css({"z-index":""});
			$("html,body").removeClass("touchDis");
			scrollEnd();

			if("closeCallback" in option){
				option.closeCallback();
			}

			function scrollEnd(){
				if(touchIs){
					$("body").css({"margin-top":0});
					window.scrollTo(0,Number($("body").data("data-scr")));
				}
			}
		});
	},
	mobileTotal : function(){
		var $btn_phtotal = $(".btn_phtotal"),
			$phtotal_z = $(".phtotal_z"),
			$phtotal_bg = $(".phtotal_bg"),
			$phtotal_w = $(".phtotal_w"),
			$phtotal_one = $(".phtotal_one"),
			$phtwo_list_w = $(".phtwo_list_w"),
			$phtotalObj = null;
		// init
		if($phtotal_w.length){
			$phtotalObj = new IScroll(".phtotal_w",{
				mouseWheel: true,
				preventDefault : false
			});
			$phtotal_one.on("click",function(){
				var $this = $(this),
					$t_pw = $this.next(".phtwo_list_w");
				if($phtwo_list_w.length){
					$phtotal_one.not($this).removeClass("active");
					$phtwo_list_w.not($t_pw).slideUp();
				}
				$t_pw.slideToggle(function(){
					$phtotalObj.refresh();
				});
				$this.toggleClass("active");
			});
			$phtotal_z.on("refresh",function(){
				$phtotalObj.refresh();
			});
			$btn_phtotal.on("click",function(e){
				e.preventDefault();
				$phtotal_z.show();
				setTimeout(function(){
					$phtotal_z.addClass("active");
					$phtotalObj.refresh();
				},30);
				if(touchstart){
					document.ontouchmove = function(e){ e.preventDefault(); };
					$("body,html").addClass("touchDis2").on("touchmove",function(e){
						e.preventDefault();
					});
				}
			});
			$phtotal_bg.on("click",function(e){
				e.preventDefault();
				totalClose();
			});
			function totalClose(){
				$phtotal_z.removeClass("active");
				setTimeout(function(){
					$phtotal_z.hide();
					if(touchstart){
						document.ontouchmove = function(e){ return true; };
						$("body,html").removeClass("touchDis2").off("touchmove");
					}
				},500);
			}
		}
	},
	mobileTotalRock : function(one,two){
		var $one = $(one) || one,
			$one_phtotal_one = $one.find(".phtotal_one"),
			$one_phtwo_list_w = $one.find(".phtwo_list_w"),
			$two = $(two) || two;
		$(".phtwo_list_w").hide();
		$(".phtotal_one").removeClass("active");
		if($one.length){
			$one_phtotal_one.addClass("active");
			$one_phtwo_list_w.show();
		}
		if($two.length){
			$two.addClass("active");
		}
		$(".phtotal_z").trigger("refresh");
	},
	mobileTotalResize : function(){
		var $phtotal_z = $(".phtotal_z");
		if($(window).width()>=1024){
			totalClose();
		}
		function totalClose(){
			$phtotal_z.removeClass("active");
			setTimeout(function(){
				$phtotal_z.hide();
				if(touchstart){
					document.ontouchmove = function(e){ return true; };
					$("body,html").removeClass("touchDis2").off("touchmove");
				}
			},500);
		}
	},
	pcCommonResize : function(){
		action();
		function action(){
			var $phgm_list_w = $(".phgm_list_w"),
				$top_headlogo = $(".top_headlogo"),
				$top_headlogo_wid = 0,
				$phutil_list_w = $(".phutil_list_w"),
				$phutil_list_w_wid = 0;
			if($(window).width()<=1023){
				$phgm_list_w.css({ "padding-left" : "", "padding-right" : "" });
			}else{
				$top_headlogo_wid = $top_headlogo.length ? $top_headlogo.outerWidth() : 0;
				$phutil_list_w_wid = $phutil_list_w.length ? $phutil_list_w.outerWidth() + 70 : 70;
				$phgm_list_w.css({
					"padding-left" : $phutil_list_w_wid,
					"padding-right" : $phutil_list_w_wid
				});
			}
		}
	},
	pcCommonInit : function(){
		var funcThis = this,
			$phgm_item = $(".phgm_item"),
			$phlang_target = $(".phlang_target"),
			$phlang_list_w = $(".phlang_list_w"),
			$phtm_list_w = $(".phtm_list_w");
		if($phgm_item.length){
			$phgm_item.hoverIntent({
				over : function(){
					var $this = $(this),
						$t_n = $this.find(".phtm_list_w");
					$phtm_list_w.slideUp();
					$t_n.slideDown();
				},
				out : function(){
					var $this = $(this),
						$t_n = $this.find(".phtm_list_w");
					$t_n.slideUp();
				},
				interval : 50
			});
		}
		if($phlang_target.length){
			$phlang_target.on("click",function(e){
				e.preventDefault();
				var $this = $(this),
					$t_phlang_list_w = $this.next(".phlang_list_w");

				$t_phlang_list_w.slideToggle();
			});
			$(document).on("click",function(e){
				if($(e.target).parents(".phlang_w").length){
					return;
				}
				$phlang_list_w.slideUp();
			});
		}
	},
	mcascrlistObj : null,
	horMenuIscInit : function(){
		$(window).on("load",function(){
			initAction();
		});
		function initAction(){
			var $mbmsmenu_list_w = $(".mbmsmenu_list_w");
			var $objisc = this.mcascrlistObj;
			var $target = $(".mbmsmenu_list > li.active");
			var initWid = 0;
			var $objisc = this.mcascrlistObj;
			var screenWidth = 0;
			var offset = 0;
			if($mbmsmenu_list_w.length){
				$objisc = new IScroll('.mbmsmenu_list_w', {
					scrollX : true,
					scrollY : false,
					eventPassthrough: true,
					preventDefault : false
				});
			}
			$(window).on("resize", function() {
				if($target.length === 0 ){return;}
				screenWidth = $(".mbmsmenu_list_w").width() - 30;
				$target_pos = $target.position().left + $target.width();
				offset = $target.length ? Math.abs(screenWidth - $target_pos) : 0;
				if($(".mbmsmenu_list_w").width() >= $target_pos || $target.length === 0){
					return;
				}
				setTimeout(function(){
					if(!touchstart){
						$objisc.scrollTo(-offset,0,300);
					}else{
						if($(window).width() !==  initWid){
							$objisc.scrollTo(-offset,0,300);
						}
					}
					$objisc.refresh();
					initWid = $(window).width();
				},50);
			}).resize();
		}
	},
	bothorResize : function(){
		action();
		$(window).on("resize",function(){
			action();
		});
		function action(){
			var $firmslab = $(".firmslab"),
				$lastmslab = $(".lastmslab"),
				$psarray = [],
				$psarray2 = [];
			$firmslab.css("width","");
			$lastmslab.css("width","");
			if($(window).width()<=1023){
				$firmslab.each(function(){
					$psarray.push($(this).outerWidth());
				});
				$firmslab.css("width",Math.max.apply(null,$psarray));
				$lastmslab.each(function(){
					$psarray2.push($(this).outerWidth());
				});
				$lastmslab.css("width",Math.max.apply(null,$psarray2));
			}
		}
	},
	/* 구브라우저 미지원 팝업 */
	oldBrowerPop : function(){
		var innerHtml = "";
		if( navigator.appName.indexOf("Microsoft") > -1 ){
			if(navigator.appVersion.indexOf("MSIE 7") > -1 || navigator.appVersion.indexOf("MSIE 8") > -1 || navigator.appVersion.indexOf("MSIE 9") > -1){
				innerHtml += "<div class='browser_layer_w'>";
				innerHtml += "<div class='browser_layer'>";
				innerHtml += "<div class='brow_top'>미지원 브라우저 알림</div>";
				innerHtml += "<div class='brow_mid'>";
				innerHtml += "<p class='brow_mid_p'>";
				innerHtml += "웹사이트의 모든 기능을 이용하시려면<br>";
				innerHtml += "최신 브라우저로 업데이트하시기 바랍니다.";
				innerHtml += "</p>";
				innerHtml += "<p class='brow_btn_w'>";
				innerHtml += "<a href='https://support.microsoft.com/ko-kr/help/17621/internet-explorer-downloads' class='brow_btn' target='_blank' title='새창'><span class='hdtext'>Internet Explorer 다운로드 바로가기</span></a>";
				innerHtml += "</p>";
				innerHtml += "</div>";
				innerHtml += "</div>";
				innerHtml += "</div>";
				$("body").append(innerHtml);
				$(".browser_layer").css({"margin-top":-$(".browser_layer").outerHeight()/2});
				$(".browser_layer_w").addClass("complete");
				$(".page_wrap").css({"z-index":0});
			}
		}
	},
	reformFunc : function(){
		var $resitem = $(".resitem");
		if($resitem.length===0){return;}
		$(window).on("resize",function(){
			$resitem.each(function(){
				if($(window).width()<1023){
					$(this).css({"width":""});
				}else{
					$(this).css({"width":$(this).attr("data-pcw")});
				}
			});
		}).resize();
	}
};
DQ.init();
