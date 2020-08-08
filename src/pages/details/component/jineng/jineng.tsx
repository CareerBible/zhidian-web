import Taro, { Component, Config, authorize } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import './jineng.scss';
import Chart from 'taro-echarts';
import jineng from '@/assets/images/jineng.png';

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
      }
    }
  };  

  componentWillMount () {
    this.queryWordCloudData()
  };

  componentDidMount () { };

  // 获取词云参数
  queryWordCloudData = () => {
    let arr:any = []
    let wordCloudData = [
      { name: "aaaaaaaaaaa", value: 237 },
      { name: "按时发大水打发", value: 221 },
      { name: "去玩儿群无", value: 222 },
      { name: "更舒服大概", value: 224 },
      { name: "阿斯顿发阿斯顿发", value: 245 },
      { name: "阿萨", value: 346 },
      { name: "万千瓦若", value: 241 },
      { name: "电饭锅和", value: 242 },
      { name: "几个号", value: 237 },
      { name: "申达股份是的", value: 221 },
      { name: "航空港好接口哥哥", value: 237 },
      { name: "改改改返回电饭锅和", value: 224 },
      { name: "十多个从VB是否", value: 345 },
      { name: "陈先生的发个", value: 346 },
      { name: "认为他问", value: 241 },
      { name: "薪酬VB", value: 242 },
    ]
    wordCloudData.map((item:any, idx:number) => {
      arr.push({...item, label: {color: colorList[idx%9], fontSize: Math.floor(item.value/14)}})
    })
    this.setState({
      wordCloudArr: arr
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
    const jinengClassify = ['JAVA', 'HTML', 'CSS', 'DUBBO', 'VUE', 'JVM', 'HTML']
    let { requireData, wordCloudArr } = this.state

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
                <View className="classify-cont">
                  {jinengClassify && jinengClassify.map((item:any, idx:number) => {
                    return (<Text key={idx}>{item}</Text>)
                  })}
                </View>
              </View>

              <View className={requireData.suzhi ? 'yaoqiu-classify blue active' : 'yaoqiu-classify blue'}>
                <View className="classify-round" onClick={() => {this.handleViewCont('suzhi')}}>通用素质</View>
                <View className="classify-cont">
                  {jinengClassify && jinengClassify.map((item:any, idx:number) => {
                    return (<Text key={idx}>{item}</Text>)
                  })}
                </View>
              </View>

              <View className={requireData.zhishi ? 'yaoqiu-classify yello active' : 'yaoqiu-classify yello'}>
                <View className="classify-round" onClick={() => {this.handleViewCont('zhishi')}}>专业知识</View>
                <View className="classify-cont">
                  {jinengClassify && jinengClassify.map((item:any, idx:number) => {
                    return (<Text key={idx}>{item}</Text>)
                  })}
                </View>
              </View>

              <View className="yaoqiu-round">
                <View className="zhiwei">JAVA工程师</View>
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
