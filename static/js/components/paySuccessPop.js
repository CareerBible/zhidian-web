Vue.component('paysuccess', {
    template: '<div class="success-box" v-if="showSuccess">'+
    '<div class="success">'+
      '<p>支付成功</p>'+
      '<p><img src="/static/img/er-code.jpeg" alt=""></p>'+
      '<p>长按添加客服微信</p>'+
      '<p>快速解决您的使用问题</p>'+
      '<p class="logo"><img src="/static/img/logo.png" alt="">职典</p>'+
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