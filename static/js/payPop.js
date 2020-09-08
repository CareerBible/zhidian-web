
Vue.component('paypop', {
    template: '<div class="pop-box"  v-if="showPop">'+
    '<div class="pop-ups">'+
      '<p>9月限定<span>体验价</span></p>'+
      '<p><span>1元</span>/月</p>'+
      '<p><del>原价：9.9元/月</del></p>'+
      '<p><span></span><em>高薪职业，从职典开始</em><span></span></p>'+
      '<ul>'+
        '<li>'+
          '<p><img src="/static/img/icon-03.svg" alt=""></p>'+
          '<p>查对口职业</p>'+
        '</li>'+
        '<li>'+
          '<p><img src="/static/img/icon-04.svg" alt=""></p>'+
          '<p>查职业薪资</p>'+
        '</li>'+
        '<li>'+
          '<p><img src="/static/img/icon-05.svg" alt=""></p>'+
          '<p>看职业对比</p>'+
        '</li>'+
      '</ul>'+
      '<button @click="payFor">立即开通</button>'+
      '<p class="logo"><img src="/static/img/logo.png" alt="">职典</p>'+
    '</div>'+
    '<span class="xian"></span>'+
    '<img src="/static/img/shut-down.svg" alt="" class="shut-down" @click="closePop">'+
  '</div>',
    data: function(){
        return {
            userId: '',
            showPop: false
        }
    },
    props:{
        show:{
            type: Boolean,
            default: false
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.userId = userId();
            this.showPop = this.show;
        })
    },
    methods: {
        payFor: function(){
            var url = domain() + '/api/pay/initPay';
            const that = this;
            var data = {
              userId: this.userId,
              tradeType: 'JSAPI'
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
                    that.showPop = false;
                    this.$emit('close', false);
                    this.$emit('init', false);
                    that.getOrder(data.outTradeNo);//支付成功后查询订单
                }else {
                    that.closePop();
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
        getOrder: function(orderCode){ //查询订单
            var url = domain() + '/api/orderQuery/order';
            const that = this;
            var params = {"outTradeNo": orderCode};
            axios.get(url,{params: params}).then(function(res) {
              var resData = res.data;
              if(resData.code === 200){
                var isVip = resData.data.isVip;
                if(isVip){
                  // that.showMask = true;
                  // that.showSuccess = true;
                }
              }
            })
        },
        closePop: function(){   //关闭支付弹窗
            this.$emit('close', false);
            this.$emit('init', true);
        }
    },
    watch: {
        show: function(newVal, oldVal) {
            this.showPop = newVal;
        }
    }
})