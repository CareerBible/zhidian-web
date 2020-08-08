import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import './xinchou.scss';
import Chart from 'taro-echarts';

// 饼状图配置
const optionBing1 = {
  color: ["#dedede", "#4ccec4"],
  title: {
    text: '12568',
    subtext: '实习薪酬',
    left: 'center',
    top: '40%',
    textStyle: { color: '#4ccec4', fontWeight: 'bold', fontSize: 20 },
    subtextStyle: { color: '#333', fontSize: 14 },
  },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: ['55%','80%'],
    avoidLabelOverlap: false,
    label: { show: false },
    labelLine: { show: false },
  }
};

const optionBing2 = {
  color: ["#dedede", "#ff6235"],
  title: {
    text: '12568',
    subtext: '最高薪酬',
    left: 'center',
    top: '40%',
    textStyle: { color: '#ff6235', fontWeight: 'bold', fontSize: 20 },
    subtextStyle: { color: '#333', fontSize: 14 },
  },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: ['55%','80%'],
    avoidLabelOverlap: false,
    label: { show: false },
    labelLine: { show: false }
  }
};

const optionBing3 = {
  color: ["#dedede", "#fad47f"],
  title: {
    text: '12568',
    subtext: '平均薪酬',
    left: 'center',
    top: '40%',
    textStyle: { color: '#fad47f', fontWeight: 'bold', fontSize: 20 },
    subtextStyle: { color: '#333', fontSize: 14 },
  },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: ['55%','80%'],
    avoidLabelOverlap: false,
    label: { show: false },
    labelLine: { show: false }
  }
};

const optionBing4 = {
  color: ["#dedede", "#6ea4fc"],
  title: {
    text: '12568',
    subtext: '薪酬中位值',
    left: 'center',
    top: '40%',
    textStyle: { color: '#6ea4fc', fontWeight: 'bold', fontSize: 20 },
    subtextStyle: { color: '#333', fontSize: 14 },
  },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: ['55%','80%'],
    // center : ['47%', '50%'],
    avoidLabelOverlap: false,
    label: { show: false },
    labelLine: { show: false },
  }
};

// 圆柱状图配置
const testData = [
  [5000, 10000, 6785.71],
  [4000, 10000, 6825],
  [3000, 6500, 4463.33],
  [2500, 5600, 3793.83],
  [2000, 4000, 3060],
  [2000, 4000, 3222.33],
  [2500, 4000, 3133.33],
  [1800, 4000, 3100],
  [2000, 3500, 2750],
  [2000, 3000, 2500],
  [1800, 3000, 2433.33],
  [2000, 2700, 2375],
  [1500, 2800, 2150],
  [1500, 2300, 2100],
  [1600, 3500, 2057.14],
  [1500, 2600, 2037.5],
  [1500, 2417.54, 1905.85],
  [1500, 2000, 1775],
  [1500, 1800, 1650]
];
const optionZhuzuang = {
  color: ['#6ea4fc'],
  angleAxis: { type: 'category' },
  radiusAxis: { },
  polar: { },
  series: [
    { type: 'bar', itemStyle: { color: 'transparent' }, coordinateSystem: 'polar', stack: '最大最小值', silent: true },
    { type: 'bar', coordinateSystem: 'polar', name: '价格范围', stack: '最大最小值' },
  ]
};

// 堆叠柱状图配置
const labelOption = {
  show: true,
  position: 'insideBottom',
  distance: 15,
  align: 'left',
  verticalAlign: 'middle',
  rotate: 90,
  formatter: '{c} {a}',
  fontSize: 9,
  color: '#fff',
};
const optionDuidie = {
  color: ['#fb633a', '#75a0ff', '#fad47f', '#44d2c2'],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: '5%', left: '5%', right: '8%', bottom: '5%', containLabel: true },
  legend: { show: false },
  xAxis: { type: 'category', axisTick: {show: false} },
  yAxis: [{ type: 'value' }],
  series: [
    { name: 'Forest', type: 'bar', barGap: 0, label: labelOption },
    { name: 'Steppe', type: 'bar', label: labelOption },
    { name: 'Desert', type: 'bar', label: labelOption },
    { name: 'Wetland', type: 'bar', label: labelOption }
  ]
};

// 普通柱状图
const optionPutong = {
  grid: { top: '5%', left: '5%', right: '8%', bottom: '5%', containLabel: true },
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: {
    type: 'bar',
    barWidth: 35,
    label:{
      normal:{
        show: true,
        position: 'top',
        textStyle:{ fontSize: 9 }
      }
    },
  }
};

export default class Xinchou extends Component<any, any> {
  constructor(props:any, context:any) {
    super(props, context)

    this.state = {
      shixiXc: [{value: 335, name: '直接访问'}, {value: 310, name: '邮件营销'}],
      zuigaoXc: [{value: 335, name: '直接访问'}, {value: 310, name: '邮件营销'}],
      pingjunXc: [{value: 335, name: '直接访问'}, {value: 310, name: '邮件营销'}],
      zhongweiXc: [{value: 335, name: '直接访问'}, {value: 310, name: '邮件营销'}],
      cityArr: ['北京', '上海', '深圳', '广州', '苏州', '杭州', '南京', '福州', '青岛', '济南', '长春', '大连', '温州', '郑州', '武汉', '成都', '东莞', '沈阳', '烟台'],
      chengshiXinchouSeries: [],
      hangyeXinChouXAxisData: ['互联网', '房地产', '金融', '银行', '媒体'],
      hangyeXinChouSeries: [],
      pingjunXinChouXAxisData: ['1年以下', '1-3年', '3-5年', '5-7年', '10年以上'],
      pingjunXinChouSeries: [],
    }
  };

  componentWillMount () {
    this.queryTestData()
  };

  componentDidMount () { }

  queryTestData = () => {
    let { chengshiXinchouSeries, hangyeXinChouSeries, pingjunXinChouSeries } = this.state

    // 城市薪酬
    optionZhuzuang.series.map((seriesItem:any, seriesIdx:number) => {
      let obj:any = seriesIdx == 0
      ? {...seriesItem, data: testData.map(function (d) { return d[0] })}
      : {...seriesItem, data: testData.map(function (d) { return d[1] - d[0] })}
      chengshiXinchouSeries.push(obj)
    })

    // 行业薪酬
    optionDuidie.series.map((seriesItem:any, seriesIdx:number) => {
      let arr:any = [
        [320, 332, 301, 334, 390],
        [220, 182, 191, 234, 290],
        [150, 232, 201, 154, 190],
        [98, 77, 101, 99, 40]
      ]
      let obj = {...seriesItem, data: arr[seriesIdx]}
      console.log('obj: ', obj)
      hangyeXinChouSeries.push(obj)
    })

    // 平均薪酬
    const colorArr = ['#fea67e', '#65e1e1', '#9fe7b9', '#38a1db', '#fad47f']
    const arr = [1000, 2000, 3000, 4000, 5000]
    arr.map((num:any, idx:number) => {
      pingjunXinChouSeries.push({value: num, itemStyle: {normal: { color: colorArr[idx%5] }}})
    })

    this.setState({
      chengshiXinchouSeries,
      hangyeXinChouSeries,
      pingjunXinChouSeries,
    })
  }

  render() {
    let { 
      shixiXc, zuigaoXc, pingjunXc, zhongweiXc, 
      cityArr, 
      chengshiXinchouSeries, // 城市薪酬-数据配置
      hangyeXinChouXAxisData, // 行业薪酬-X轴文字
      hangyeXinChouSeries, // 行业薪酬-数据配置
      pingjunXinChouXAxisData, // 平均薪酬-X轴文字
      pingjunXinChouSeries, // 平均薪酬-数据配置
    } = this.state
    return (
      <View className="echarts-box-wrap">
        {/* 4个饼图合集 */}
        <View className="at-row at-row--wrap default-box">
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='aaa'
              width='100%'
              height='190px'
              option={{...optionBing1, series: {...optionBing1.series, data: shixiXc}}}
            />
          </View>
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='bbb'
              width='100%'
              height='190px'
              option={{...optionBing2, series: {...optionBing2.series, data: zuigaoXc}}}
            />
          </View>
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='ccc'
              width='100%'
              height='190px'
              option={{...optionBing3, series: {...optionBing3.series, data: pingjunXc}}}
            />
          </View>
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='ddd'
              width='100%'
              height='190px'
              option={{...optionBing4, series: {...optionBing4.series, data: zhongweiXc}}}
            />
          </View>
        </View>

        {/* 圆柱状图 */}
        <View className="has-title-box">
          <View className="box-title">城市薪酬-<Text className="color-orange">TOP5</Text></View>
          <View className="box-cont pr-30">
            <Chart
              chartId='ddd'
              width='100%'
              height='300px'
              option={{
                ...optionZhuzuang,
                angleAxis: {...optionZhuzuang.angleAxis, data: cityArr},
                series: chengshiXinchouSeries,
              }}
            />
          </View>
        </View>

        {/* 堆叠柱状图 */}
        <View className="has-title-box">
          <View className="box-title">行业薪酬-<Text className="color-orange">TOP5</Text></View>
          <View className="box-cont pr-20">
            <Chart
              chartId='ddd'
              width='100%'
              height='240px'
              option={{
                ...optionDuidie,
                xAxis: {...optionDuidie.xAxis, data: hangyeXinChouXAxisData},
                series: hangyeXinChouSeries,
              }}
            />
          </View>
        </View>

        {/* 普通柱状图 */}
        <View className="has-title-box">
          <View className="box-title">工作经验-<Text className="color-orange">平均薪酬</Text></View>
          <View className="box-cont pr-20">
            <Chart
              chartId='ddd'
              width='100%'
              height='240px'
              option={{
                ...optionPutong,
                xAxis: {...optionPutong.xAxis, data: pingjunXinChouXAxisData},
                series: {...optionPutong.series, data:pingjunXinChouSeries},
              }}
            />
          </View>
        </View>

        <View className="echarts-box-footer">—— 不止诗与远方 ——</View>
      </View>
    );
  }
}
