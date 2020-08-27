axios.defaults.headers.common["uid"] = '56ed7379da47434292deeb8d472ebb0c';

// window.onload = function(){
//     //ajax方法
//     function ajax (method, url, params, fun) {
//         method = method.toUpperCase()            //在传入method的时候可以忽略大小写
//         var xhr = new XMLHttpRequest()
//         if (typeof params === 'object') {        //如果在地址传入的东西是一个对象，我们将它的格式转化为urlencoded
//           var tempArr = []
//           for (var key in params) {
//             var value = params[key]
//             tempArr.push(key + '=' + value)
//           }
//           params = tempArr.join('&') //===>这里的格式就为parsms=[key1=value&key2=value2]
//         }
//         if (method === 'GET') {
//           url += '?' + params
//         }
//         xhr.open(method, url, false)
//         var data = null
//         if (method === 'POST') {    //如果请求的方式为POST，需要手动设置请求头的Content-Type
//           xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
//           data = params
//         }
//         xhr.onreadystatechange = function () {
//           if (this.readyState !== 4) return
//           // console.log(this.responseText)  //这里可以得到响应体，但是后面要处理的内容应该根据使用者的需要来处理
//           fun(this.responseText)
//         }
//         xhr.send(data)                  
//   }

//     //获取url中"?"符后的字串
//     function GetRequest() { 
//       var url = location.search; 
//       var theRequest = new Object();
//       if (url.indexOf("?") != -1) {
//         var str = url.substr(1);
//         strs = str.split("&");
//         for(var i = 0; i < strs.length; i ++) {
//         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
//         }
//       }
//       return theRequest;
//     }

//     //判断是否存有uid
//     function isLogin(){
//       var uid = window.localStorage.getItem('uid'),
//           openid = window.localStorage.getItem('openid'),
//           skipUrl = '',
//           url = 'https://zhidian.dookbook.info/api/wechat/getAuthorizeCodeUrl';
//       if(uid === null && openid === null){//没有用户id
//         ajax('get', url,{},function (res) {
//             var resData = JSON.parse(res);
//             if(resData.code == 200){
//               skipUrl = resData.data.url;
//               window.location.href = skipUrl + 'index.html';
//             }
//         })
//       }
//     }
//     // isLogin();

//     //得到code再获取用户信息
//     function getUserInfo(str){
//       var obj = GetRequest(str),
//           Code = obj['code'],
//           url = 'https://zhidian.dookbook.info/api/wechat/getAuthorizeCodeUrl';
//       ajax('get', url,{
//         'code': Code
//       },function (res) {
//           var resData = JSON.parse(res);
//           if(resData.code == 200){
//             var data = resData.data;
//             window.localStorage.setItem('uid', data.id);
//             window.localStorage.setItem('openid', data.openid);
//             window.localStorage.setItem('unionid', data.unionid);
//           }
//       })
//     }
// }

 
