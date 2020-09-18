var option1 = {
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

var option2 = {
    boundaryGap: false,
    backgroundColor:'#fff',
    grid: {
        left: 0,
        right: 0,
        top: 0
    },
    xAxis: {
        type: 'category',
        data: ['10分位', '25分位', '50分位', '75分位','90分位','平均值']
        
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
                    var colorList = ['#9ee6b7', '#67e0e3', '#32c5e9', '#ff9f7f', '#37a3da', '#ffd95a'];
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
