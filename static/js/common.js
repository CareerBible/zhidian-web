var ifFirst = sessionStorage.getItem('first');
var PageHeight = document.documentElement.clientHeight,
    PageWidth = document.documentElement.clientWidth;
var page = window.location.href;
var ifIndex = page.indexOf('index.html')
  if(ifIndex != -1 && !ifFirst){ //第一次进入首页
    open();
    sessionStorage.setItem('first', true);
  }else {
    Loading();
    document.addEventListener('DOMContentLoaded', function(){//页面加载完成之后移除遮罩层
      removeDiv();
    })
  }


//开屏海报
function open(){
    var LoadingHtml = '<img id="loadingDiv" src="/static/img/poster.jpg"'
    +'style="position:fixed; left:0; width:' + PageWidth + 'px; height:' + PageHeight + 'px; top:0; background:#fff; opacity:1; z-index:10000;">';
    document.write(LoadingHtml);

    setTimeout(function(){
      removeDiv();
    },3000)
}

//加载页面
function Loading(){
    var LoadingHtml = '<div id="loadingDiv"'
    +'style="position:absolute; left:0; width:100%; height:' + PageHeight + 'px; top:0; background:#fff; opacity:1; filter:alpha(opacity=80); z-index:10000;">'
    +'<div id="loadingMask" style="position: absolute; cursor: wait; left: 50%; top: 50%; text-align:center; margin: -75px 0 0 -100px; color: #000; font-family:\'Microsoft YaHei\';"><img src="/static/img/logo.png" alt="" style="display:inline-block; width:120px" ><p style="font-size:26px;letter-spacing: 4px;color:#666">查职业<span style="padding:0 6px;">·</span>查薪酬</p></div></div>';
    document.write(LoadingHtml);
}

//删除loading div
function removeDiv(){
  var loadingDiv = document.querySelector('#loadingDiv');
  loadingDiv.remove();
}


var limitConnect = 3;  // 断线重连次数
var timeConnect = 0;
//websocket轮询
function wsPolling(userId,pageId){
  var ws = new WebSocket("ws://zhidian.dookbook.info/api/websocket/"+userId);
  
  ws.onopen = function(evt) { 
      // ws.send("我是连接");
  };
  
  ws.onmessage = function(evt) {
      var markId = JSON.parse(evt.data).data.markId;
      if(markId){
         var params = {
          pageId: pageId,
          usreId: userId,
          markId: markId
        }
        params = JSON.stringify(params);
        setInterval(function(){
          ws.send(params);
        }, 1000);
      }
  };
  
  ws.onclose = function () {
    console.log('服务器已经断开');
    reconnect();
  };

  ws.onerror = function (err) {
    console.log("服务器报错：" + err);
    reconnect();
  }; 
}

// 重连
function reconnect() {
  // lockReconnect加锁，防止onclose、onerror两次重连
  if(limitConnect>0){
    if(localStorage.getItem('lockReconnect')!=true){
      localStorage.setItem("lockReconnect",1);
      limitConnect --;
      timeConnect ++;
      console.log("第"+timeConnect+"次重连");
      // 进行重连
      setTimeout(function(){
        wsPolling(userId,pageId);
        localStorage.removeItem("lockReconnect");
      },2000);
    }
  }else{
    console.log("TCP连接已超时");
  }
}


//全局域名
function domain (){
  return 'https://zhidian.dookbook.info';
}

//获取url中参数
function getQueryVariable(param){
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === param) { return pair[1] }
  }
  return ''
}

/**
 * 函数防抖，debounce
 * 基本思路就是把多个信号合并为一个信号
 * 
 * @param {*} func 
 * @param {*} delay 
 */
function debounce(func, delay) {
    var timer = null
    return function(e) {
        // console.log("clear", timer, e.target.value)
        var context = this, args = arguments
        clearTimeout(timer)
  
        // console.log("new event", timer, e.target.value)
        timer = setTimeout(function(){
          func.apply(context, args)
        }, delay)
    }
  }
  
  /**
   * 节流，throttle
   * 强制函数以固定的速率执行，比较适合应用于动画相关的场景
   * 如：resize, touchmove, mousemove, scroll
   * 
   * @param {*} func 
   * @param {*} threshhold 
   */
  function throttle(func, threshhold) {
    var timer = null;
    var start = new Date;
    var threshhold = threshhold || 160
  
    return function () {
      var context = this, args = arguments, curr = new Date() - 0
      clearTimeout(timer)  //总是干掉事件回调
  
      if(curr - start >= threshhold){ 
        // console.log("now", curr, curr - start)//注意这里相减的结果，都差不多是160左右
        func.apply(context, args) //只执行一部分方法，这些方法是在某个时间段内执行一次
        start = curr
      }else{
        //让方法在脱离事件后也能执行一次
        timer = setTimeout(function(){
          func.apply(context, args) 
        }, threshhold);
      }
    }
  }