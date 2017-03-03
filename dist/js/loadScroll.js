function loadScroll(params){
	// 创建topLoading
	var dom_topLoading=document.createElement("div");
    	dom_topLoading.id = "loadScroll_topLoading";
    var dom_i=document.createElement("i")
	    dom_i.className = "loadScroll_loadingIcon icon-loading";
    dom_topLoading.appendChild(dom_i)
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
}