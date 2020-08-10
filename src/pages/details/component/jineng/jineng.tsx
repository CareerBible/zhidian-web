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

// 饼状图配置
const optionBing1 = {
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
        var ret = "";//拼接加\n返回的类目项  
        var maxLength = 5;//每项显示文字个数  
        var valLength = value.length;//X轴类目项的文字个数  
        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
        if (rowN > 1)//如果类目项的文字大于5,
        {  
          var temp = "";//每次截取的字符串  
          var start = 0;//开始截取的位置  
          var end = maxLength;//结束截取的位置  
          temp = value.substring(start, end)+'\n'+value.substring(end, valLength)					
          ret += temp; //凭借最终的字符串  

          return ret;  
        }
        else{
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
    itemStyle: {
      normal: {
        color: '#4E7BFE'
      },
    },
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
      // professionalRequirements: {
      //   jineng: [],
      //   suzhi: [],
      //   zhishi: [],
      // },
      // zhiweiyaoqiuNameArr: [],
      // zhiweiyaoqiuYAxisData: [],
      skillRequirements: '',
      zhiweiyaoqiuYAxisData: [],
      zhiweiyaoqiuSeriesData: [],
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
        console.log('🧚‍♀️ 数据分析 resp: ', resp)
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
    console.log('🇫🇯 职位要求', )
    let { professionalRequirements, zhiweiyaoqiuNameArr, zhiweiyaoqiuSeriesData, zhiweiyaoqiuYAxisData, skillRequirements }= this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.professionalRequirements(params).then(resp => {
      if (resp.code == 200 && resp.data) {
        // console.log('🇫🇯 职位要求 resp: ', resp)
        skillRequirements = resp.data.skillRequirements
        
        const getmydmc:any=['留在','到地例','到中小例', 'bbb'];//数据点名称
        const getmyd:any=[33, 44, 55, 66, 77];//学生满意度
        const getmydzd:any =[];//学生满意度100%
        for (let i = 0; i < getmyd.length; i++) {
          getmydzd.push(100)
        }
        zhiweiyaoqiuYAxisData = optionBing1.yAxis.map((yAxisItem:any, yAxisIdx:number) => {
          return {...yAxisItem, data: yAxisIdx == 0
            ? getmydmc
            : getmyd
          }
        })
        console.log('🇫🇯🇫🇯zhiweiyaoqiuYAxisData: ', zhiweiyaoqiuYAxisData)
        zhiweiyaoqiuSeriesData = {...optionBing1.series, data: getmyd}

        this.setState({
          // professionalRequirements,
          skillRequirements,
          zhiweiyaoqiuYAxisData,
          zhiweiyaoqiuSeriesData,
        })
      }
    })
  };

  // 点击查看职位要求
  handleViewCont = (str) => {
    let { requireData } = this.state
    console.log('str: ', str)
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
    let { requireData, wordCloudArr, professionalRequirements, skillRequirements, zhiweiyaoqiuYAxisData, zhiweiyaoqiuSeriesData } = this.state

    return (
      <View className="echarts-box-wrap">
        <View className="font-28 text-center text-gray pall-30">{skillRequirements}</View>

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
        {/* <View className="has-title-box position-relative" style={{marginBottom: requireData.zhishi && professionalRequirements.zhishi.length ? '150px' : '50px'}}> */}
        <View className="has-title-box position-relative">
          <View className="box-title">职位要求</View>
          <View className="box-cont2">
            <Chart
              chartId='bbb'
              width='100%'
              height='300px'
              option={{...optionBing1, yAxis: zhiweiyaoqiuYAxisData, series: zhiweiyaoqiuSeriesData}}
            />
            {/* <View className="yaoqiu-wrap">
              <View className={requireData.jineng ? 'yaoqiu-classify green active' : 'yaoqiu-classify green'}>
                <View className="classify-round" onClick={() => {this.handleViewCont('jineng')}}>工作技能</View>
                  {professionalRequirements && professionalRequirements.jineng.length 
                    ? <View className="classify-cont">
                      {professionalRequirements.jineng.map((item:any, idx:number) => {
                        return (<Text key={idx}>{item}</Text>)
                      })}
                    </View>
                  : null}
              </View>

              <View className={requireData.suzhi ? 'yaoqiu-classify blue active' : 'yaoqiu-classify blue'}>
                <View className="classify-round" onClick={() => {this.handleViewCont('suzhi')}}>通用素质</View>
                  {professionalRequirements && professionalRequirements.suzhi.length 
                    ? <View className="classify-cont">
                      {professionalRequirements.suzhi.map((item:any, idx:number) => {
                        return (<Text key={idx}>{item}</Text>)
                      })}
                    </View>
                  : null}
              </View>

              <View className={requireData.zhishi ? 'yaoqiu-classify yello active' : 'yaoqiu-classify yello'}>
                <View className="classify-round" onClick={() => {this.handleViewCont('zhishi')}}>专业知识</View>
                {professionalRequirements && professionalRequirements.zhishi.length 
                    ? <View className="classify-cont">
                      {professionalRequirements.zhishi.map((item:any, idx:number) => {
                        return (<Text key={idx}>{item}</Text>)
                      })}
                    </View>
                  : null}
              </View>

              <View className="yaoqiu-round">
                <View className="zhiwei">{decodeURI(this.$router.params.positionname)}</View>
                <Image src={jineng} />
              </View>
            </View> */}
          </View>
        </View>

        <View className="echarts-box-footer">—— 不止诗与远方 ——</View>
      </View>
    );
  }
}
