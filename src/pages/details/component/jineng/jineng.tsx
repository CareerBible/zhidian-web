import Taro, { Component, Config, authorize } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import './jineng.scss';
import Chart from 'taro-echarts';
import jineng from '@/assets/images/jineng.png';
import { CommonApi } from '@/api/Common.api';

// 词云文字颜色集
const colorList = ['#333333', '#514991', '#529b6e', '#5c315d', '#568096', '#3b9b0b', '#951b5a', '#b8976e', '#56a19b']

// 词云图配置
const optionShuju = {
  animationEasingUpdate: 'bounceIn',
  series: {
    type: 'graph',
    layout: 'force',
    force: {
      initLayout: 'circular',
      repulsion: 50,
      gravity: 0.1,
      edgeLength: 30,
      friction: 0.5,
      layoutAnimation: true
    },
    label: {
      show: true,
      backgroundColor: '#fff',
    }
  }
};

// 柱状图配置
const optionZhu = {
  grid: { left: '70', right: '90', bottom: '3%', top: '3%' },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    formatter: function(params) {
      return params[0].name  + ': ' + params[0].value+'%'
    }
  },
  xAxis: {
    show: false,
    type: 'value'
  },
  yAxis: [{
    type: 'category',
    inverse: true,
    axisLabel: {
      formatter:function(value){
        var ret = "";
        var maxLength = 5;
        var valLength = value.length; 
        var rowN = Math.ceil(valLength / maxLength);
        if (rowN > 1) {  
          var temp = "";
          var start = 0;
          var end = maxLength;
          temp = value.substring(start, end)+'\n'+value.substring(end, valLength)					
          ret += temp;
          return ret;  
        } else {
          return value;  
        }
      },
      textStyle: {
        color: '#666666',
        fontSize: '14'
      },
    },
    splitLine: { show: false },
    axisTick: { show: false },
    axisLine: { show: false },
  }, {
    type: 'category',
    inverse: true,
    axisTick: 'none',
    axisLine: 'none',
    show: true,
    axisLabel: {
      textStyle: {
        color: '#333333',
        fontSize: '14'
      },
    formatter: '{value}%'
    },
  }],
  series: {
    name: '值',
    type: 'bar',
    zlevel: 1,
    barWidth: 25,
  }
}

export default class Xuqiu extends Component<any, any> {
  constructor(props:any, context:any) {
    super(props, context)

    this.state = {
      wordCloudArr: [],
      requireData: {
        jineng: false,
        suzhi: false,
        zhishi: true,
      },
      skillRequirements: '',
      professionalRequirementsList: [],
      zhiweiyaoqiuYAxisData: [],
      zhiweiyaoqiuSeriesData: [],
      canvasHeight: '180px'
    }
  };

  componentWillMount () {
    // this.queryWordCloudData()
    this.dataAnalysis()
    this.professionalRequirements()
  };

  componentDidMount () { };

  // 数据分析
  dataAnalysis = () => {
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.dataAnalysis(params).then(resp => {
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        let arr:any = []
        let wordCloudData:any = resp.data.list.map(item => {
          return {name: item.name, value: +item.percentage}
        })
        wordCloudData.map((item:any, idx:number) => {
          arr.push({...item, label: {color: colorList[idx%9], fontSize: Math.floor(item.value/14)}})
        })
        this.setState({
          wordCloudArr: arr
        })
      }
    })
  };

  // 职位要求
  professionalRequirements = () => {
    let colorList = ['#ff9f7f', '#ffda59', '#9ee7b9', '#64e1e2', '#33c6eb', '#34a2db',]
    let { zhiweiyaoqiuSeriesData, zhiweiyaoqiuYAxisData, skillRequirements, professionalRequirementsList, canvasHeight }= this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.professionalRequirements(params).then(resp => {
      if (resp.code == 200 && resp.data) {
        skillRequirements = resp.data.skillRequirements
        professionalRequirementsList =  resp.data.professionalRequirementsList
        canvasHeight = resp.data.professionalRequirementsList.length * 50 + 'px'
        let nameArr:any = resp.data.professionalRequirementsList.map(item => {return item.name})
        let valueArr:any = resp.data.professionalRequirementsList.map((item:any, idx:number) => {
          return {value: item.percentage.replace('%', ''), itemStyle: {color: colorList[idx%6]}}
        })
        
        // const nameArr:any=['留在','到地例','到中小例', 'bbb'];//数据点名称
        // const valueArr:any=[33, 44, 55, 66, 77];//学生满意度
        const rateArr:any =[];//学生满意度100%
        for (let i = 0; i < valueArr.length; i++) {
          rateArr.push(100)
        }
        zhiweiyaoqiuYAxisData = optionZhu.yAxis.map((yAxisItem:any, yAxisIdx:number) => {
          return {...yAxisItem, data: yAxisIdx == 0
            ? nameArr
            : valueArr
          }
        })
        zhiweiyaoqiuSeriesData = {...optionZhu.series, data: valueArr}

        this.setState({
          professionalRequirementsList,
          skillRequirements,
          zhiweiyaoqiuYAxisData,
          zhiweiyaoqiuSeriesData,
          canvasHeight,
        })
      }
    })
  };

  // 点击查看职位要求
  handleViewCont = (str) => {
    let { requireData } = this.state
    Object.keys(requireData).forEach(key => {
      if (str == key) {
        requireData[key] = true
      } else {
        requireData[key] = false
      }
    })
    this.setState({
      requireData
    })
  };

  render() {
    // const jinengClassify = ['JAVA', 'HTML', 'CSS', 'DUBBO', 'VUE', 'JVM', 'HTML']
    let { requireData, wordCloudArr, professionalRequirementsList, skillRequirements, zhiweiyaoqiuYAxisData, zhiweiyaoqiuSeriesData, canvasHeight } = this.state

    return (
      <View className="echarts-box-wrap">
        <View className="font-28 text-center text-gray pl-30 pr-20 pt-0 pb-20">{skillRequirements}</View>

        {/* 数据分析图 */}
        <View className="at-row at-row--wrap default-box">
          <View className="at-col at-col-12 pr-20">
            <Chart
              chartId='aaa'
              width='100%'
              height='300px'
              option={{...optionShuju, series: {...optionShuju.series, data: wordCloudArr}}}
            />
          </View>
        </View>

        {/* 空心饼图 */}
        <View className="has-title-box position-relative">
          <View className="box-title"><Text className="box-title-text">职位要求</Text></View>
          <View className="box-cont2">
            <Chart
              chartId='zhiweiyaoqiu'
              width='100%'
              option={{...optionZhu, yAxis: zhiweiyaoqiuYAxisData, series: zhiweiyaoqiuSeriesData, height: canvasHeight}}
            />
          </View>
        </View>

        <View className="echarts-box-footer">—— 不止诗与远方 ——</View>
      </View>
    );
  }
}
