var option = {
    boundaryGap: false,
    backgroundColor:'#fff',
    grid: {
        left: 0,
        right: 0,
        top: 0
    },
    xAxis: {
        type: 'category',
        data: ['最高值', '最低值', '平均值', '中位值']
        
    },
    tooltip: {
        trigger: "axis"
    },
    yAxis: {
        type: 'value',
        axisLine:{
            show:true,
            lineStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#ccc']
            }  
        }
    },
    series : [
    {
        name: '薪酬',
        type: 'bar',
        itemStyle: {
            normal: {
                color: function(params) {
                    var colorList = ['#ff9f7f','#67e0e3','#9ee6b7','#37a2da',];
                    return colorList[params.dataIndex]
                },
            }
        },
        barWidth: '50%',
        data:[],
        label: {
            show: true,
            position: 'top',
            color: 'rgba(0, 0, 0, 0.5)'
        },
        roundCap: true
    }
  ]
}

Vue.component('bar', {
    template: '<div id="chart"></div>',
    data: function(){
        return {
            chart: null,
            chartOption: option,
        }
    },
    props: {
        'data': {
            type: Array,
            default:function(){
                return [5000, 3000, 4000, 3500];
            } 
        }
    },
    mounted: function(){
        this.chart = echarts.init(document.getElementById('chart'));
    },
    watch: {
        'data': function() {
            this.chartOption.series[0].data = this.data;
        },
        'chartOption': {
            handler: function(newVal, oldVal) {
                if (this.chart) {
                    if (newVal) {
                        this.chart.setOption(newVal,true);
                    } else {
                        this.chart.setOption(oldVal,true);
                    }
                } else {
                    this.init();
                }
            },
            deep: true //对象内部属性的监听，关键。
        }
    }
})