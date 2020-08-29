Loading();
function Loading(){
    var PageHeight = document.documentElement.clientHeight,
        PageWidth = document.documentElement.clientWidth;
    var LoadingTop = PageHeight > 61 ? (PageHeight - 61) / 2 : 0,
        LoadingLeft = PageWidth > 215 ? (PageWidth - 215) / 2 : 0;
    var LoadingHtml = '<div id="loadingDiv"'
    +'style="position:absolute; left:0; width:100%; height:' + PageHeight + 'px; top:0; background:#fff; opacity:1; filter:alpha(opacity=80); z-index:10000;">'
    +'<div id="loadingMask" style="position: absolute; cursor1: wait; left: ' + LoadingLeft + 'px; top:' + LoadingTop + 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; color: #000; font-family:\'Microsoft YaHei\';">页面加载中，请等待...</div></div>';
    document.write(LoadingHtml);
}

document.addEventListener('DOMContentLoaded', function(){//页面加载完成之后移除遮罩层
    var loadingDiv = document.querySelector('#loadingDiv');
    var loadingMask = loadingDiv.querySelector('#loadingMask');
    loadingDiv.remove();
})