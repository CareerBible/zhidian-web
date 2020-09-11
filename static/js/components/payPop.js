
Vue.component('paypop', {
    template: '<section class="payPop" v-if="showPop">'+
    '<div>'+
        '<p><em>解锁所有数据</em>每天2分钱 · 原价：<span>30元/月</span></p>'+
        '<p><span><em>9.9</em>元/年</span>找个好工作，年薪10万起</p>'+
    '</div>'+
    '<button @click="goToPayFor">9月求职季特惠 · 立即购买</button>'+
'</section>',
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
        goToPayFor: function(){//跳转支付页面
            window.location.href = '/payFor.html';
        }
    },
    watch: {
        show: function(newVal, oldVal) {
            this.showPop = newVal;
        }
    }
})