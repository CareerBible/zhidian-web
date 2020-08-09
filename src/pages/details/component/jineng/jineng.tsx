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
// const optionBing1 = {
//   color: ["#5dd3e9", "#7aacfe", "#fdb84d"],
//   title: {
//     text: '12568',
//     left: 'center',
//     top: '45%',
//     textStyle: { color: '#ff6235', fontWeight: 'bold', fontSize: 20 },
//   },
//   series: [
//     {
//       name: '访问来源',
//       type: 'pie',
//       radius: ['55%','75%'],
//       label: {
//         show: true,
//         position: 'inside',
//       },
//       data: this.state.zhiyeyaoqiu
//     }
//   ]
// };

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
      professionalRequirements: {
        jineng: [],
        suzhi: [],
        zhishi: [],
      }
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

  // 职业要求
  professionalRequirements = () => {
    console.log('🇫🇯 职业要求', )
    let { professionalRequirements }= this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.professionalRequirements(params).then(resp => {
      if (resp.code == 200 && resp.data) {
        console.log('🇫🇯 职业要求 resp: ', resp)
        resp.data.professionalRequirementsList.map(item => {
          if (item.name == '工作技能') {
            professionalRequirements.jineng = item.list
          } else if (item.name == '通用素质') {
            professionalRequirements.suzhi = item.list
          } else if (item.name == '专业知识') {
            professionalRequirements.zhishi = item.list
          }
        })
        this.setState({
          professionalRequirements
        })
      }
    })
  };

  // 点击查看职业要求
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
    let { requireData, wordCloudArr, professionalRequirements } = this.state

    return (
      <View className="echarts-box-wrap">
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
        <View className="has-title-box position-relative" style={{marginBottom: requireData.zhishi ? '150px' : '50px'}}>
          <View className="box-title">职业要求</View>
          <View className="box-cont2">
            {/* <Chart
              chartId='bbb'
              width='100%'
              height='300px'
              option={optionBing1}
            /> */}
            <View className="yaoqiu-wrap">
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
            </View>
          </View>
        </View>

        <View className="echarts-box-footer">—— 不止诗与远方 ——</View>
      </View>
    );
  }
}
