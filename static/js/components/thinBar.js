Vue.component('thinbar', {
    template: '<ul class="thinBar">'+
    '<li v-for="item in barData"><i>{{item.value}}</i><span></span><em>{{item.name}}</em></li>'+
'</ul>',
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