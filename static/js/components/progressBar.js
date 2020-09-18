Vue.component('progressbar', {
    template: '<section>'+
    '<div class="bar">'+
        '<span v-for="item in barData" :style="{width:item.value}"></span>'+
    '</div>'+
    '<div class="explain">'+
        '<p v-for="item in barData"><span></span>{{item.name+item.value}}</p>'+
    '</div>'+
'</section>',
    data: function(){
        return {
            barData: []
        }
    },
    props: {
        data: {
            'data': {
                type: Array,
                default:function(){
                    return [];
                } 
            }
        }
    },
    watch: {
        'data': function(newVal, oldVal) {
            this.barData = newVal;
        }
    }
})