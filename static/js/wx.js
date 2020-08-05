/**
 * 微信相关
 */

/**
 * 微信登录
 */
function wxLogin() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/wechat/getAuthorizeCodeUrl')
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code == 200) {
        window.location.href = data.data.url
      } else {
        alert(data.msg)
      }
    }
  }
}

// 微信用户登录判断
var wx_openid = localStorage.getItem('wx_openid')
if(wx_openid == null) {
  wxLogin()
}
