window.onload = function(){
    shareLink();
    function shareLink(){
      var url = domain() + '/api/wechat/share';
      var strWxCurUrl = window.location.href;
      var params = {'url': strWxCurUrl};

      axios.get(url,{params:params}).then(function(res) {
        var resData = res.data;
        if(resData.code == 200){
          var info = resData.data;
          wx.config({
            debug: false,
            appId: info.appId,
            timestamp: info.timestamp,
            nonceStr: info.nonceStr,
            signature: info.signature,
            jsapi_ticket: info.jsapi_ticket,
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
          });

          var shareData = {
            title: '职典-查职业，查薪酬', // 分享标题
            desc: '找一份稳定体面、且有前途、高薪酬，还能被亲朋好友羡慕的工作。', // 分享描述
            imgUrl: 'https://zhidian.dookbook.info/static/img/linkLogo.jpg', // 分享图标
          }

          wx.ready(function () {      //分享好友
            wx.onMenuShareAppMessage({ 
              title: shareData.title, 
              desc: shareData.desc, 
              link: strWxCurUrl,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: shareData.imgUrl,
              success: function () {
                // 设置成功
                console.log('分享成功')
              }
            })

            wx.onMenuShareTimeline({ //分享朋友圈
              title: shareData.title, 
              desc: shareData.desc,
              link: strWxCurUrl,
              imgUrl: shareData.imgUrl,
              success: function () {
                // 设置成功
                console.log('分享成功')
              }
            })
          });

          wx.error(function (res) {
            // alert(res.errMsg);//错误提示
          });
        }
      })
    }
  }