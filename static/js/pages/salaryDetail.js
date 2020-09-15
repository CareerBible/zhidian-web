var vm = new Vue({
    el: "#salaryDetail",    //挂载元素
    data: {
        userId: '',
        pageId: '97a16a2f45c444178ed73134e838a378',
        Chart1: null,
        chartOption: {
            boundaryGap:false,
            backgroundColor:'#fff',
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
                data:[5000, 3000, 4000, 3500],
                label: {
                    show: true,
                    position: 'top',
                    color: 'rgba(0, 0, 0, 0.5)'
                },
                roundCap: true
            }
          ]
        }
    },
    mounted: function(){
        this.$nextTick(function() {
            this.userId = window.localStorage.getItem('uid');
            this.Chart1 = echarts.init(document.getElementById('chart1'));
            this.Chart1.setOption(this.chartOption);
            // wsPolling(this.userId,this.pageId);
        })
    },
    methods: {
        
    }
})