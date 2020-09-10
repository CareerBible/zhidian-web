Vue.component('totop', {
    template: '<button class="top" v-if="showTopTop" @click="backTop"><img src="/static/img/top.svg" alt=""></button>',
    data: function(){
        return {
            idDiv: '',
            showTopTop: false
        }
    },
    props:{
        dom: {
            type: String,
            default: ''
        },
        show:{
            type: Boolean,
            default: false
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.showTopTop = this.show;
            this.idDiv = document.getElementById(this.dom);
        })
    },
    methods: {
        backTop: throttle(function(){  //回到顶部
            var time = null , that = this;
            time = setInterval(function(){
              if(that.idDiv.scrollTop === 0){
                clearInterval(time);
              }else{
                that.idDiv.scrollTop -= 1300;
              }
            }, 16);
        },50)
    },
    watch: {
        show: function(newVal, oldVal) {
            this.showTopTop = newVal;
        }
    }
})