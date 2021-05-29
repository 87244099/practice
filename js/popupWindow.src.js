if (typeof Fai == 'undefined'){
    Fai = {};
    Fai.top = top;
}
// fkeditor工具栏使用
(function(FUNC, undefined){
    FUNC.fkEval = function(data){
        return eval(data);
    };
})(Fai);
Fai.isIE8 = function() {
   if ($.browser.msie) {
       if ($.browser.version == '8.0') return true;
   }
   return false;
};
/*
灰色透明背景
*/
Fai.bg = function(id, opacity, zIndex, extClass) {
   

   var html = "",
       opacityHtml = "",
       zIndexHtml = "",
       extClass = extClass || "";
   //背景遮罩一弹的时候0.5  二弹以上的都是0.15
   if(Fai.top.$(".popupBg").length > 0){
       opacity = 0.15;
   }
   if(opacity){
       opacityHtml = "filter: alpha(opacity=" + opacity*100 + "); opacity:"+ opacity +";";
   }
   if(zIndex){
       zIndexHtml = " z-index:" + (zIndex - 1);
   }

   //加上popupBgForWin为了将z-index提到9032  避免直接修改popupBg影响其它使用了popupBg的地方
   html = "<div id=\"popupBg"+ id +"\" class=\"popupBg popupBgForWin " + extClass + "\" style='"+ opacityHtml + zIndexHtml +"' >"+
       ($.browser.msie && $.browser.version == 6.0 ?
             '<iframe id="fixSelectIframe' + id + '" wmode="transparent" style="filter: alpha(opacity=0);opacity: 0;" class="popupBg" style="z-index:-111" src="javascript:"></iframe>' 	
             :
             '')
   +"</div>";
   
   Fai.top.$(html).appendTo("body");
   
   // Fai.stopInterval(null);
};
// 注意不能用于未声明的顶层变量的判断，例如不能Fai.isNull(abc)，只能Fai.isNull(abc.d)
Fai.isNull = function (obj){
   return (typeof obj == 'undefined') || (obj == null);
};
Fai.addUrlParams = function (url, param){
   if (Fai.isNull(param)){
       return url;
   }
   if (url.indexOf('?') < 0){
       return url + '?' + param;
   }
   return url + '&' + param;
};
Fai.setPopupWindowChange = function(id, change) {
   if (Fai.isNull(Fai.top._popupOptions)){
       return;
   }
   if (Fai.isNull(Fai.top._popupOptions["popup" + id])) {
       return;
   }
   Fai.top._popupOptions["popup" + id].change = change;
};
Fai.closePopupWindow = function(id, closeArgs, msg){
   if(id) {
       // try{
           if (Fai.isNull(Fai.top._popupOptions["popup" + id])) {
               return;
           }
           var popupOption = Fai.top._popupOptions["popup" + id];
           if(popupOption.change){
               if(typeof(msg)=='undefined' || msg == ""){
                   if(!window.confirm("您的修改尚未保存，确定要离开吗？")){
                       return;
                   }
               }else{
                   if(!window.confirm(msg)){
                       return;
                   }
               }
           }
           if(popupOption.refresh){
               Fai.top.location.reload();
               return;
           }
           // remove first
           Fai.top.Fai.removeAllIng(false);
           var options = popupOption.options;
           if(!options){//wxapp
               return;
           }
           if (!Fai.isNull(options.closeFunc)) {
               if (closeArgs) {
                   options.closeFunc(closeArgs);
               } else {
                   options.closeFunc(Fai.top._popupOptions["popup" + id].closeArgs);
               }
           }		
           Fai.top._popupOptions["popup" + id] = {};
           //animate start
           var ppwObj = Fai.top.$("#popupWindow"+id);
           if(options.animate){
               Fai.top.Fai.closePopupWindowAnimate(ppwObj, options.animateTarget, options.animateOnClose);
           }
           //animate finish
           
           // for ie9 bug
           Fai.top.setTimeout("Fai.closePopupWindow_Internal('" + id + "')");
       // }catch(err){
       // 	console.log(err);
       // }
   }else{
       Fai.removeBg();
       Fai.top.$(".formDialog").remove(); 
   }
};
Fai.removeAllIng = function() {
   Fai.top.$("#ing").remove();
};
Fai.closePopupWindow_Internal = function(id) {
   if (typeof id == 'undefined') {
       //在关闭窗口之前，先把swfuplaod销毁了
       if($.browser.msie && $.browser.version == 10){
           var popupWindowIframe = Fai.top.$(".formDialog").find(".popupWindowIframe")[0];
           if(popupWindowIframe){
               popupWindowIframeWindow = popupWindowIframe.contentWindow;
               
               if(popupWindowIframeWindow){
                   try{
                       if( popupWindowIframeWindow.swfObj ){
                           popupWindowIframeWindow.swfObj.destroy();
                       }
                       if( popupWindowIframeWindow.editor ){
                           if(popupWindowIframeWindow.editor.swfObj){
                               popupWindowIframeWindow.editor.swfObj.destroy();
                           }
                       }
                   }catch( e ){
                       
                   }
               }
           }
       }
       Fai.top.$(".popupBg").not(".popupZoneDelOnlyById").last().remove();
       Fai.top.$(".formDialog").last().remove();
       //Fai.top.$("body").focus();	// 由于这里导致IE9下打开两次以前popupWindow之后。iframe里面的input无法focus进去，先注释掉
       //Fai.top.$(".formDialog").remove(); 
   } else {
       //fix ie10 下图片上传的BUG
       //在关闭窗口之前，先把swfuplaod销毁了
       if($.browser.msie && $.browser.version == 10){
           var popupWindowIframe = Fai.top.document.getElementById("popupWindowIframe" + id);
           if(popupWindowIframe){
               popupWindowIframeWindow = popupWindowIframe.contentWindow;
               
               if(popupWindowIframeWindow){
                   try{
                       if( popupWindowIframeWindow.swfObj ){
                           popupWindowIframeWindow.swfObj.destroy();
                       }
                       if( popupWindowIframeWindow.editor ){
                           if(popupWindowIframeWindow.editor.swfObj){
                               popupWindowIframeWindow.editor.swfObj.destroy();
                           }
                       }
                   }catch( e ){
                       
                   }
               }
           }
           
       }
       Fai.top.Fai.removeBg(id);
       //Fai.top.$("body").focus();	// 由于这里导致IE9下打开两次以前popupWindow之后。iframe里面的input无法focus进去，先注释掉
       Fai.top.$("#popupWindowIframe" + id).remove();	// 这里尝试先remove iframe再后面remove div，看焦点会不会丢失
       Fai.top.$("#popupWindow"+id).remove();
       
   }
};
Fai.removeBg = function(id){
   if(id){
       Fai.top.$("#popupBg" + id).remove();
   }else{
       Fai.top.$(".popupBg").not(".popupZoneDelOnlyById").last().remove();
   }
   
   Fai.startInterval(null);
};
// 启动时间处理函数，id为null表示启动所有
Fai.startInterval = function(id) {
   if (Fai.isNull(Fai.intervalFunc)){
       return;
   }
   for (var i = 0; i < Fai.intervalFunc.length; ++i){
       var x = Fai.intervalFunc[i];
       if (id == null || x.id == id){
           if (x.timer){
               clearInterval(x.timer);
           }
           if (x.type == 1) {
               if(id == "marquee1168"){
                   x.func();
               }
               x.timer = setInterval(x.func, x.interval)
           } else {
               x.timer = setTimeout(x.func, x.interval)
           }
       }
   }
};
Fai.enablePopupWindowBtn = function(id, btnId, enable) {
   var win = Fai.top.$("#popupWindow" + id);
   btnId = "popup" + id + btnId;
   var btn = win.find("#" + btnId);
   if (enable){
       btn.removeAttr('disabled');
       btn.faiButton("enable");
   } else {
       btn.attr('disabled', true);
       btn.faiButton("disable");
   }
};
// {function} Fai.popupWindowVersionTwo.createPopupWindow() //创建弹窗
// {function} Fai.popupWindowVersionTwo.createPopupWindow.getPopupWindowId() //获取弹窗的popupWindowId
// @param {object} option -- 建站弹窗02.参数
//							{string} title -- 标题
//							{int} width -- 弹窗的宽度
//							{int} height -- 弹窗的高度
//							{int} top -- 弹窗的位置
//							{int} left -- 弹窗的位置
//							{string} frameSrcUrl -- iframe的src
//							{string} frameScrolling -- 是否iframe在iframe显示滚动条。1、auto:在需要的情况下出现滚动条（默认值）。2、yes：始终显示滚动条（即使不需要）。3、no：从不显示滚动条（即使需要）。
//							{boolean} bannerDisplay -- 这个先保留，暂时没用到
//							{boolean} framePadding -- 这个先保留，暂时没用到
//							{string} opacity -- 弹窗的透明度
//							{boolean} displayBg -- 是否加背景遮盖层，默认true
//							{boolean} bgClose -- 是否点击背景关闭弹窗，默认false
//							{boolean} waitingPHide -- 弹窗的是否隐藏loading图，默认true
//							{string} divId -- 以div的html来作为内容
//							{string} divContent -- 以html来作为内容
//							{string} msg --关闭弹窗的提示
//							{boolean} replaceContent --替换内容
//							{function} callback 回调函数
// @return {int} result -- popupWindowId
// {function}  只能应用于管理态（原因vue不支持ie9以下）
//   step 1. Fai.addPopupWinBtnComponentDom( use vue component )
//   step 2. Fai.renderPopupWinBtnComponent( new btn component )
//
// (Deprecated) Fai.popupWindowVersionTwo.addPopupWindowButton
// @param {object} option -- 建站弹窗添加按钮2.0参数
//							{int} popupId -- 弹窗的popupId
//							{string} id -- 弹窗里的按钮的id 如save close 
//							{string} extClass -- 弹窗里的按钮的类  这个控制着样式表现
//							{string} text -- 弹窗里的按钮的value
//							{boolean} disable -- 弹窗里的按钮的禁用
//							{function} click -- 弹窗里的按钮的click事件
//							{function} callback -- 回调函数
(function($, FUNC, undefined) {
   FUNC.createPopupWindow = function(opt){
       return new PopupWindow(opt);
   }

   FUNC.renderPopupWinBtnComponent = function(opt){
       var settings = {
           popupId: 0, 
           initEvents: {}
       },popupId;
       settings = $.extend(settings, opt);
       popupId = settings.popupId;

       var	btnPanel = Fai.top.$("#popupWindow" + popupId).find(".pWBtns"),
           vMethods = {
           close: function () {
               Fai.top.Fai.closePopupWindow(popupId);
           }
       };
       for (var key in settings.initEvents) {
           vMethods[key] = settings.initEvents[key];
       }

       var btnVm = new Vue({
           el: btnPanel[0],
           data: {},
           methods : vMethods
       });
       return btnVm;
   }

   FUNC.addPopupWinBtnComponentDom = function(opt){
       var settings = {
           popupId: 0, 
           id: '',
           text: '',
           disable: false,
           active: false,
           style:'',
           click: 'close'
       }, popupId, btnPanel, btnId, btn;
       settings = $.extend(settings, opt);

       popupId = settings.popupId;
       btnPanel = Fai.top.$("#popupWindow" + popupId).find(".pWBtns");
       btnId = "popup" + popupId + settings.id;
       btn = btnPanel.find("#" + btnId);

       if (btn.length > 0) btn.remove();

       var btnHtml = '';
       btnHtml +=	'<button-component';
       btnHtml +=		' class="pWBtn"';
       btnHtml +=		' style="' + settings.style + '"';
       btnHtml +=		' id="' + btnId + '"';
       btnHtml +=		' global-oper';
       btnHtml +=		' :active="' + settings.active + '"';
       btnHtml +=		' :disabled="' + settings.disable + '"';
       btnHtml +=		' @click.stop="'+ settings.click;
       btnHtml +=	'">';
       btnHtml +=		settings.text;
       btnHtml +=	'</button-component>';

       Fai.top.$(btnHtml).appendTo(btnPanel);
   }

   FUNC.addPopupWindowButton = function(opt){
       var settings = {
           popupId: 0, 
           id: '',
           extClass: '',
           text: '', 
           msg: '',
           popUpWinClass: '',
           popUpWinZIndex: 0,
           disable: false,
           click: function(){},
           callback:null
       },popupId,popupWin,
         btnPanel,btnId,btn;

       settings = $.extend(settings, opt);

       popupId = settings.popupId;
       popupWin = Fai.top.$("#popupWindow" + popupId);
       btnPanel = popupWin.find(".pWBtns");
       btnId = "popup" + popupId + settings.id;
       btn = btnPanel.find("#" + btnId);

       if (btn.length > 0){
           btn.remove();
       }

       if( settings.click != "help" ){
           if (typeof settings["extClass"] != "undefined") {
               var extClass = settings["extClass"];
               Fai.top.$("<input id='" + btnId + "' type='button' value='" + settings.text + "' class='editbutton' extClass='" + extClass + "' />").appendTo(btnPanel);
           } else {
               Fai.top.$("<input id='" + btnId + "' type='button' value='" + settings.text + "' class='editbutton' />").appendTo(btnPanel);
           }
       }

       btn = btnPanel.find("#" + btnId);	

       if (typeof btn.faiButton == "function"){
           btn.faiButton();
       }

       if(settings.callback && Object.prototype.toString.call(settings.callback) === "[object Function]"){
           btn.click(function() {
               settings.callback();
               if (Fai.isNull(settings.msg)){
                   Fai.top.Fai.closePopupWindow(popupId);
               } else {
                   Fai.top.Fai.closePopupWindow(popupId, undefined, settings.msg);
               }
           });
       }
       
       if (settings.click == 'close') {
           btn.click(function() {
               if (Fai.isNull(settings.msg)){
                   Fai.top.Fai.closePopupWindow(popupId);
               } else {
                   Fai.top.Fai.closePopupWindow(popupId, undefined, settings.msg);
               }
           });
       } else {
           btn.click(settings.click);
       }
       
       if (settings.disable) {
           btn.attr('disabled', true);
           btn.faiButton("disable");
       }

       // 捕捉弹窗输入Enter键，符合要求则触发保存
       // 性能问题：每次关闭弹窗，keydown函数会自动跟随窗体销毁
       $(document).keydown(function(e){
           if(e.keyCode == 13){
               var saveBtn = popupWin.find("#popup"+ popupId +"save"),
                   focusElem;
               
               if(saveBtn.length > 0 && !saveBtn.prop("disabled")){
                   var focusElem = $(":focus");
                   if(focusElem.is("input[type='text']") || focusElem.is("textarea")){
                       return;
                   }
                   saveBtn.trigger("click");
               }
           }
       });
   }
   var PopupWindow = function(options){
       var settings = {
           title: '', 
           width: 500,
           height: 300,
           top: 0,
           left: 0,
           frameSrcUrl: 'about:_blank', 
           frameScrolling: 'auto',
           bannerDisplay: true, 
           framePadding: true,
           opacity: '0.5',
           displayBg: true, 
           bgClose: false, 
           closeBtnHide: false, 
           waitingPHide: true, 
           divId:null,			
           divContent:null,
           msg: '',
           popUpWinClass: '',
           popUpWinZIndex: 0,
           replaceContent: false,
           noframeUrl: false,
           noHeadLine: false,      //头部
           noHeadBorder: false,	//头部样式的底部边框
           popUpTip: "",
           noBottom:false,			//底部  可自定义底部按钮 addPopupWinBtnComponentDom的会被隐藏
           bottomLine:false,		//底部  边框线，默认没有边框线
           noPopupTipIcon:false,	//提示框  是否带图标
           iconPopupTip: "",		//带图标的提示框  现在写死图标  区别于popUpTip
           pWCenterHeight: 0,		//嵌入html，需要各处中间html内容高度 pWCenterHeight = height - pWHead - pWBottom
           callback: null,        //初始化弹窗回调
           closeFunc: null        //关闭按钮回调
       };
       this.settings = $.extend(settings, options);

       this.contentWidth = parseInt(this.settings.width);
       this.contentHeight = parseInt(this.settings.height);
       this.popUpWinClass = this.settings.popUpWinClass;
       this.popupWindowId = this.settings.replaceContent ? this.settings.popupWindowId : parseInt(Math.random() * 10000);
       // this.popupWindowId = this.settings.popupWindowId;//测试ID 后期要删除的
       this.iframeMode = true;
       this.popupWin;
       this.pWHead;
       this.pWHeadHeight;
       this.pwLoading;
       this.init();
       popupWinloaded(this);


       //noframeUrl的场景：弹出提示语(新弹窗样式)by Alson
       if(this.settings.noframeUrl && !this.settings.iconPopupTip){
           var popupWindowId = this.popupWindowId;
           var savebtnId = "popup"+ this.popupWindowId + "save"; 
           var closebtnId = "popup"+ this.popupWindowId + "cloze";
           var btnPanel = Fai.top.$("#popupWindow"+ this.popupWindowId ).find(".pWBtns");
           var btnConfirmText = this.settings.btnConfirm ? this.settings.btnConfirm : "确定";
           var btnClsText = this.settings.btnCls ? this.settings.btnCls : "取消";
           Fai.top.$("<input id='" + savebtnId + "' type='button' value='" + btnConfirmText + "' class='jz-btn jz-btn-global-oper' extClass='' />").appendTo(btnPanel);
           Fai.top.$("<input id='" + closebtnId + "' type='button' value='" + btnClsText + "' class='jz-btn jz-btn-global-oper' extClass='' />").appendTo(btnPanel);

           Fai.top.$("#" + savebtnId).bind("click", function(){
               Fai.closePopupWindow(popupWindowId, {select: true});
           });
           Fai.top.$("#" + closebtnId).bind("click", function(){
               Fai.closePopupWindow(popupWindowId, {select: false});
           });
       }
   
   }

   function popupWinloaded(context){
       var _this = context,
           popupWin = _this.popupWin;

       popupWin.ready(function() {
           var popupWindowId = _this.popupWindowId;

           if (_this.iframeMode && !_this.settings.noframeUrl) {

               var frameSrcUrlArgs = "popupID=" + popupWindowId;

               Fai.top.$("#popupWindowIframe" + popupWindowId).attr("src", Fai.addUrlParams(_this.settings.frameSrcUrl, frameSrcUrlArgs)).load(function () {
                   
                   var pWCenter = _this.popupWin.find(".pWCenter");
                   var pWBottom = _this.popupWin.find(".pWBottom");
                   var	pWBottomHeight = pWBottom.height();

                   //处理当浏览器展示高度小于弹窗的时候滚动条超出的问题
                   pWCenter.css("border-bottom", "2px solid transparent");

                   //文件素材弹窗不需要在ready的时候赋值宽高
                   if(_this.popUpWinClass != "fileUploadV2"){
                       $(this).contents().find("html").css("overflow-y", "auto");
                       pWCenter.height(_this.contentHeight - _this.pWHeadHeight - pWBottomHeight - parseInt(pWCenter.css("border-bottom-width").replace("px", "")));
                       pWCenter.width(_this.contentWidth);
                   }
                   if( _this.settings.waitingPHide ){
                       _this.pwLoading.hide();
                   }

                   /*if (Fai.top._isTemplateVersion2 && Fai.top._useBannerVersionTwo 
                      && typeof Site != "undefined" && typeof Fai.top._bannerV2Data != "undefined" 
                      && Fai.top._bannerV2Data.bl && Fai.top._bannerV2Data.bl.length > 1) {

                      Site.bannerV2.stopBannerInterval();
                   }	*/
               });
           }

           function draggable() {
               popupWin.draggable({
                   start: function () {
                       // 拖动不选中
                       Fai.top.$("body").disableSelection();
                       // chrome,ie10以上 top选色板focusout失效。
                       Fai.top.$("#colorpanel").remove();
                       Fai.top.$(".faiColorPicker").remove();
                   },
                   handle: ".pWHead",
                   stop: function () {
                       // 拖动不选中
                       Fai.top.$("body").enableSelection();
                       // Fai.logDog(200046, 39);
                   }
               });
           }

           draggable();

           popupWin.find(".pWHead").off("mouseenter.popenter").on("mouseenter.popenter", function () {
               // draggable();
           });

           popupWin.find(".pWHead").off("mouseleave.popleave").on("mouseleave.popleave", function () {
               // popupWin.draggable("destroy");
           });	


           popupWin.find(".J_pWHead_close").bind("click", function(){
               var popupWindowId = _this.popupWindowId;
               if (Fai.isNull(_this.settings.msg)){
                   Fai.closePopupWindow(popupWindowId);
               } else {
                   Fai.closePopupWindow(popupWindowId, undefined, _this.settings.msg);
               }	
               return false;
           });

           // popupWin.find(".J_pWHead_close").disableSelection();
           
           // 如果开启了点击背景关闭
           if(_this.settings.bgClose){
               Fai.top.$("#popupBg" + _this.popupWindowId).bind("click", function(){
                   if (Fai.isNull(_this.settings.msg)){
                       Fai.closePopupWindow(_this.popupWindowId);
                   } else {
                       Fai.closePopupWindow(_this.popupWindowId, undefined, _this.settings.msg);
                   }
                   return false;
               });
           }
           
           if(_this.settings.callback && Object.prototype.toString.call(_this.settings.callback) === "[object Function]"){
               _this.settings.callback();
           }
       });    
   }

   $.extend(PopupWindow.prototype, {
       init: function () {
           var displayModeContent,
               noHeadLine = "",
               noHeadBorder = "",
               positionStyle = "",
               headStyle = "", 
               pWCenterStyle = "",
               popupWindowId,
               pwHtml,
               clientHeight,
               clientWidth,
               hasScroll = false,
               iconPopupContent,
               noBottom = "",
               bottomStyle = "",
               bottomLine = "";
       
           popupWindowId = this.popupWindowId;

           displayModeContent = "<iframe id='popupWindowIframe"+ popupWindowId +"' class='popupWindowIframe' src='' frameborder='0' scrolling='"+ this.settings.frameScrolling +"' style='width:100%;height:100%;'></iframe>";

           iconPopupContent = 
                 "<div style='width: 80px; height:80px; border-radius:50%; border: 4px solid gray; border: 4px solid gray; margin: 20px auto; padding: 0; position: relative; box-sizing: content-box; border-color: #F8BB86;'>"
               +	"<div style='animation: pulseWarningIns 0.75s infinite alternate; -webkit-animation: pulseWarningIns 0.75s infinite alternate;'>"
               + 		"<span style='position: absolute; width: 5px; height: 47px; left: 50%; top: 10px; webkit-border-radius: 2px; border-radius: 2px; margin-left: -2px; background-color: #F8BB86;'></span>"
               + 		"<span style='position: absolute; width: 7px; height: 7px; -webkit-border-radius: 50%; border-radius: 50%; margin-left: -3px; left: 50%; bottom: 10px; background-color: #F8BB86;'></span>"
               +	"</div>"
               + "</div>";

           if(this.settings.divId != null){
               this.iframeMode = false;
               displayModeContent = $(this.settings.divId).html();
           }
           else if(this.settings.divContent != null){
               this.iframeMode = false;
               displayModeContent = this.settings.divContent;
           }
           // 带固定icon的提示框 allen 2017-12-21
           else if(this.settings.noframeUrl && this.settings.iconPopupTip != null){
               this.iframeMode = false;
               // 不带图标
               if(this.settings.noPopupTipIcon){
                   displayModeContent =  this.settings.iconPopupTip;
               }else{
                   displayModeContent = iconPopupContent + this.settings.iconPopupTip;
               }
               //直接在弹窗里加入html，需要各处中间html内容高度 pWCenterHeight = height - pWHead - pWBottom
               if(this.settings.pWCenterHeight){
                   pWCenterStyle = "height:"+this.settings.pWCenterHeight+"px;";
               }
           } 
           //noframeUrl的场景：提示语弹窗(链接控件的删除客服操作) by Alson
           else if(this.settings.noframeUrl){
               this.iframeMode = false;
               displayModeContent =  "<p id='J_popUptip' style='margin-top: 45px; text-align: center;padding-left: 35px;padding-right: 35px;font-size: 15px;'>" + this.settings.popUpTip + "</p>";
           }
           
           //隐藏底部的场景：提示语弹窗自定义底部按钮 
           if(this.settings.noBottom){
               noBottom = "display:none;";
           }
           // 底部有上边框  20180924 allen
           if(this.settings.bottomLine){
               bottomLine = "border-top:1px solid #e3e2e8;";
           }
           bottomStyle = " style='" + bottomLine + noBottom + "'";
           

           //隐藏标题的场景：提示语弹窗
           if(this.settings.noHeadLine){
               noHeadLine = "display:none;";
               pWCenterStyle = "height: 90px;";
           }
           if(this.settings.noHeadBorder){
               noHeadBorder = "border-bottom-color:#ffffff;"
           }

           headStyle = noHeadLine + noHeadBorder;
           headStyle = headStyle ? " style='" + headStyle + "'" : "";

           //加背景
           if(this.settings.displayBg && !this.settings.replaceContent) {
               Fai.bg(popupWindowId, this.settings.opacity, this.settings.popUpWinZIndex);
           }	 
           
           var extStyle = "";
           if (this.settings.popUpWinZIndex) {
               extStyle = "z-index: " + this.settings.popUpWinZIndex;
           }

           if (this.settings.replaceContent) {
               extStyle = "animation: initial;";
           }

           clientHeight = Fai.top.document.body.clientHeight || Fai.top.document.documentElement.clientHeight;
           clientWidth = Fai.top.document.body.clientWidth || Fai.top.document.documentElement.clientWidth;

           if (this.contentHeight > clientHeight) {
               this.contentHeight = clientHeight;
               hasScroll = true;
           }
           if (this.settings.top !== 0 || this.settings.left !== 0) {
               positionStyle = "left: "+ this.settings.left +"px;top: "+ this.settings.top +"px;"
           }
           else {
               positionStyle = "left: "+ (clientWidth - this.contentWidth) / 2 +"px;top: "+ (clientHeight - this.contentHeight) / 2 +"px;";
           }

           pwHtml  =  "<div id=\"popupWindow"+ popupWindowId +"\" hasScroll="+ hasScroll +"  class='fk-popupWindowVT "+ this.settings.popUpWinClass +"' style='"+ positionStyle +" height:"+ this.contentHeight +"px; "+ extStyle +"'>" +
                              "<div class='pWHead'" + headStyle + ">" +
                                  "<div class='pWHead_title'>"+ this.settings.title +"</div>" +
                                  "<div style='" +( this.settings.closeBtnHide ? "display: none;" : "" )+ "' class='pWHead_close'>" +
                                      "<div class='J_pWHead_close pWHead_close_img'></div>" +
                                  "</div>" +
                              "</div>" +
                              "<div class='pWCenter' style='width:"+ this.contentWidth +"px;"+ pWCenterStyle +"'>" +
                                  displayModeContent +
                                  "<div class='tabs_extendedLine' style='display:none;'></div>" +
                              "</div>" +
                              "<div class='pWBottom'" + bottomStyle + ">" +
                               "<div class='pWBtns'></div>" +
                           "</div>" +
                           "<div id=\"pwLoading"+ popupWindowId +"\" class='pwLoading' style='height:auto;'></div>" +
                       "</div>";   

           if (this.settings.replaceContent) {
               Fai.top.$("#popupWindow" + popupWindowId).css("animation", "initial");
               Fai.top.$("#popupWindow" + popupWindowId).replaceWith(pwHtml);
           }
           else {
               Fai.top.$("body").append(pwHtml);
           }

           this.popupWin = Fai.top.$("#popupWindow" + popupWindowId);
           this.pWHead = this.popupWin.find(".pWHead");
           this.pWHeadHeight = this.pWHead.height();
           this.pwLoading = this.popupWin.find("#pwLoading" + popupWindowId);

           if (this.iframeMode) {
               this.pwLoading.height(this.contentHeight - this.pWHeadHeight).width(this.contentWidth);
           } else {
               if( this.settings.waitingPHide ){
                   this.pwLoading.hide();
               }
           }
                   
           if (Fai.isNull(Fai.top._popupOptions)) {
               Fai.top._popupOptions = {};
           }

           if (Fai.isNull(Fai.top._popupOptions["popup" + popupWindowId])) {
               Fai.top._popupOptions["popup" + popupWindowId] = {};
           }

           if(!Fai.isNull(this.settings.callArgs)){
               Fai.top._popupOptions["popup" + popupWindowId].callArgs = this.settings.callArgs;
           }

           Fai.top._popupOptions["popup" + popupWindowId].options = this.settings;
           Fai.top._popupOptions["popup" + popupWindowId].change = false;
       },
       getPopupWindowId: function(){
           return this.popupWindowId;
       }
   });


})(jQuery, Fai.popupWindowVersionTwo || (Fai.popupWindowVersionTwo = {}));