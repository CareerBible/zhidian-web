Vue.component('paysuccess', {
    template: '<div class="success-box" v-if="showSuccess">'+
    '<div class="success">'+
        '<p>支付成功<span>恭喜您开通职典年费会员</span></p>'+
        '<p><img src="/static/img/success.png" alt=""></p>'+
        '<p>填写问卷或转发链接<br/>再送一年会员</p>'+
        '<div>'+
            '<button>分享链接</button><button>填写问卷</button>'+
         '</div>'+
         '<div class="wrap">'+
            '<img src="/static/img/er-code.jpeg" alt=""><span>添加客服微信</span>'+
            '<p>职典梦想很大<br/>但每一步都需要您的支持</p>'+
         '</div>'+
    '</div>'+
        '<span class="xian"></span>'+
        '<img src="/static/img/shut-down.svg" alt="" class="shut-down" @click="closeSuccessPop">'+
'</div>',
    data: function(){
        return {
            showSuccess: false
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
            this.showSuccess = this.show;
        })
    },
    methods: {
        closeSuccessPop: function(){
            this.$emit('close', false)
        }
    },
    watch: {
        show: function(newVal, oldVal) {
            this.showSuccess = newVal;
        }
    }
})