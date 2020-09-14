var vm = new Vue({
    el: "#payFor",    //挂载元素
    data: {
        userId: '',
        showSuccess: false,
        pageId: ''
    },
    mounted: function(){
        this.$nextTick(function() {
            this.userId = window.localStorage.getItem('uid');
            this.pageId = getQueryVariable('pageId');
        })
    },
    methods: {
        goToPay: function(){    //获取支付签名
            var url = domain() + '/api/pay/initPay';
            const that = this;
            var data = {
              userId: this.userId,
              tradeType: 'JSAPI',
              pageId: this.pageId
            }
            axios.post(url,data).then(function(res) {
                var resData = res.data;
                if(resData.code === 200){
                  var payForData = resData.data;
                  that.payForToWx(payForData);
                }
            })
        },
        payForToWx: function(data){//微信支付
            const that = this;
            WeixinJSBridge.invoke('getBrandWCPayRequest', {
                "appId": data.appId,
                "timeStamp": data.timeStamp,
                "nonceStr": data.nonceStr,
                "package": data.packageStr,
                "signType": data.signType,
                "paySign": data.paySign 
            },function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    that.showSuccess = true;//弹出支付成功窗口
                    that.getOrder(data.outTradeNo);//支付成功后查询订单
                }else {
                    alert('支付失败');
                }
            });
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                that.payForToWx();
            }
        },
        getOrder: function(orderCode){ //查询订单，告诉后端该用户已经成为会员
            var url = domain() + '/api/orderQuery/order';
            const that = this;
            var params = {"outTradeNo": orderCode};
            axios.get(url,{params: params}).then(function(res) {})
        },
        closeSuccess: function(){//关闭支付成功弹窗并返回上一页
            that.showSuccess = false;
            window.history.back(-1);
        }
    }
})