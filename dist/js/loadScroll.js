function loadScroll(params){
	// 创建topLoading
	var dom_topLoading=document.createElement("div");
    	dom_topLoading.id = "loadScroll_topLoading";
    var dom_i=document.createElement("i");
	    dom_i.className = "loadScroll_loadingIcon icon-loading";
    dom_topLoading.appendChild(dom_i);
    var dom_span=document.createElement("span");
    	dom_span.innerText=params.topLoadingText[0];
    dom_topLoading.appendChild(dom_span);
    $("body").prepend(dom_topLoading);
	//设置topLoading偏移量
    var dom_topLoading_height=$("#loadScroll_topLoading").height();
	$("#loadScroll_topLoading").css("top","-"+dom_topLoading_height+"px")
	// 创建bottomLoading
	var dom_bottomLoading=document.createElement("div");
    	dom_bottomLoading.id = "loadScroll_bottomLoading";
    var dom_i=document.createElement("i")
    	dom_i.className = "loadScroll_loadingIcon icon-loading icon-loading-animation";
    	dom_bottomLoading.appendChild(dom_i)
    var dom_span=document.createElement("span");
	dom_span.innerText=params.topLoadingText[2];
    dom_bottomLoading.appendChild(dom_span);
	$("body").append(dom_bottomLoading);

//use fn with setTimeout in jQuery.
jQuery.fn.extend({
	timeOut:function(fn,time){
		if ( typeof time !== "number" && fn == null ) {
			return this;
		}else{
			var t=setTimeout(function(){
				fn();
				clearTimeout(t);
			},time)
		}
	}
});
	var delMoveable=false,      //删除按钮可否移动
		loading=false,       //是否在加载中
		pageN = 1;              //要加载第几页
		x=y=ex=ey=exx=eyy=0,  //位置和相对位置
		scrollTop=0,            //距离顶部多少像素
	if ( $(".loadScroll_cover").length ) { WDELETE=$(".loadScroll_cover button")[0].clientWidth }
	var isLoading=false,
		isEnd=false;

	//对列表的操作
	$("#loadScroll")
		.on('touchstart',"li",function(e){
			y = ey = eyy = scrollTop = 0;
			y = e.originalEvent.targetTouches[0].screenY;
			$(this).addClass('loadScroll_active');
		})
		.on('touchmove',"li",function(e){
			ey=y-e.originalEvent.targetTouches[0].screenY;
			scrollTop=$(window).scrollTop();
			if(scrollTop==0 && ey<-5 ) e.preventDefault();
		})
		.on('touchend',"li",function(e){
			$(this).removeClass('loadScroll_active');
		})
		.on('touchstart',"[data-del=true] .loadScroll_front",function(e){
			x = ex = exx = 0;
			delMoveable=false;
			x =  e.originalEvent.targetTouches[0].screenX;
			if(!this.classList.contains("loadScroll_front_active")){
				var $active=$(".loadScroll_front_active");
				$(".loadScroll_front_active")	//transition写在此处是因为在webview中transition无效。
					.css({"transition":"transform .2s","transform":"translateX(0)"})
					.timeOut(function(){		//清理界面
						$active.removeAttr("style").removeClass("loadScroll_front_active");
					},200)
			}
		})
		.on('touchmove',"[data-del=true] .loadScroll_front",function(e){
			ex=x-e.originalEvent.targetTouches[0].screenX;
			if(Math.abs(ex) > Math.abs(ey)){e.preventDefault();}	//兼容android设备
			if(!this.classList.contains("loadScroll_front_active")){
				exx=ex-10;	//防止误触
				if(exx>0 && (Math.abs(exx) > Math.abs(ey*3) || delMoveable) ){
					if(exx<=WDELETE){
						$(this).css("transform","translateX("+exx*-1+"px)");
						delMoveable=true;
					}else{
						$(this).css({"transition":"transform .2s","transform":"translateX("+WDELETE*-1+"px)"});
					}
				}
			}
		})
		.on('touchend',"[data-del=true] .loadScroll_front",function(e){
			if ((exx > WDELETE/3) && (Math.abs(exx) > Math.abs(ey*3))) {
				$(this)
					.css({"transition":"transform .2s","transform":"translateX("+WDELETE*-1+"px)"})
					.addClass("loadScroll_front_active")
					.timeOut(function(){
						$(e.target).closest('.ui-article-front').css("transition","");
					},200);
			} else {
				$(this)
					.css({"transition":"transform .2s","transform":"translateX(0px)"})
					.timeOut(function(){
						$(e.target).closest('.ui-article-front').removeAttr("style").removeClass('loadScroll_front_active');
					},200)
			}
		});

	//对页面刷新的操作,有关参数已传播至页面
	$(document)
		.on('touchmove',function(e){
			//顶部重新加载过程
			var pullH = -40;	//下拉加载高度
			eyy=ey*0.5+pullH*-1;		//下拉高度>40，且高度为下拉的一半
			if(scrollTop<=0  && eyy<0){
				$('#loadScroll_topLoading,#loadScroll_bottomLoading, #loadScroll')
					.css('transform',"translate3D(0,"+eyy*-1+"px,0)");
				if(eyy >= pullH){
					$('#loadScroll_topLoading .loadScroll_loadingIcon').removeClass('icon-loading-animation')
					$('#loadScroll_topLoading span').html(params.topLoadingText[0])
				}else if(eyy < pullH){
					$('#loadScroll_topLoading .loadScroll_loadingIcon').addClass('icon-loading-animation')
					$('#loadScroll_topLoading span').html(params.topLoadingText[1]);
				}
			}
		})
		.on('touchend',function(e){
			//顶部重新加载
			if(scrollTop<=0){
				if(eyy < pullH){	//设置
					$("#loadScroll_topLoading,#loadScroll_bottomLoading, #loadScroll")
						.css("transform","translate3D(0,"+dom_topLoading_height+"px,0)");
					$('#loadScroll_loadingIcon').addClass('icon-loading-animation')
					$("#loadScroll_topLoading span").html(params.topLoadingText[2]);
					pushList();
				}else{
					returnBack();
				}
			}
		})

	$(window).scroll(function(){
		$('.loadScroll_active').removeClass('loadScroll_active');
		scrollTop = $(this).scrollTop();
		if( !isEnd && !isLoading){
			if(scrollTop + $(window).height() + 120 > $(document).height() ){
				pushList(params.pushList);
			}
		}
	})
	$('.loadScroll_cover').on('click','button', function() {
            //e.preventDefault();
            var that=$(this);
            var data=params.pushList.data;
            	data.id=that.data().id;
            $.ajax({
                url:params.removeItem.url ||"",
                data:data || {},
                success:function(json){
                    if(json.status==1){
                        that.closest('li').slideUp('fast', function() {
                        	params.removeItem.success() || "";
                            if($('.ui-article').length==0){location.reload()}
                        })
                    }else if(json.status==2) {
                        params.removeItem.fail() || "";
                    }
                },
                error:function(json){
                    params.pushList.error() || "";
                }
            })
        })
	function pushList(data) {
		this.isLoading=true;
		$.ajax({
			url:data.url || "",
			data:data.data || {},
			type:data.type || "POST",
			success:function(json){
				if(json.status==1){
					if(isfresh){
						$("#loadScroll li").remove();
					}
					$("#loadScroll").append(json.data)
					data.success() || "";
				}else if(json.status==2){
					data.fail() || "";
				}
			},
			error:function(){
				data.error() || "";
			},
			complete:function(){
				this.isLoading=false;
				returnBack();
			}
		}.bind(this))
	}
	function returnBack(){		//下拉进程恢复
		$('#loadScroll_topLoading,#loadScroll_bottomLoading, #loadScroll').css("transform","translate3D(0,0,0)");
		$('#loadScroll_loadingIcon').removeClass('icon-loading-animation')
		$("#loadScroll_topLoading span").html(params.topLoadingText[0]);
	}
}