//获取用户名
userId();
function userId(){
    // var userId = '56ed7379da47434292deeb8d472ebb0c';
    var userId = window.localStorage.getItem('uid');
  
    if(!userId){
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb3417997b07e0f2e&redirect_uri=https%3A%2F%2Fzhidian.dookbook.info%2Fwx_auth.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    }else{
        axios.defaults.headers.common["uid"] = userId;
    }
}