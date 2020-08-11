import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import './xinchou.scss';
import Chart from 'taro-echarts';
import { CommonApi } from '@/api/Common.api';

// 饼状图配置
const optionBing1 = {
  color: ["#dedede", "#4ccec4"],
  title: {
    // text: '12568',
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
  [2500, 5600, 3793.83]
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
  grid: { top: '5%', left: '8%', right: '12%', bottom: '5%', containLabel: true },
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
  grid: { top: '5%', left: '8%', right: '12%', bottom: '5%', containLabel: true },
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: {
    type: 'bar',
    barWidth: 30,
    label:{
      normal:{
        show: true,
        position: 'top',
        color: '#333',
        textStyle:{ fontSize: 9 }
      }
    },
  }
};

export default class Xinchou extends Component<any, any> {
  constructor(props:any, context:any) {
    super(props, context)

    this.state = {
      shixiXc: [],
      zuigaoXc: [],
      pingjunXc: [],
      zhongweiXc: [],
      cityArr: [],
      chengshiXinchouSeries: [],
      hangyeXinChouXAxisData: [],
      hangyeXinChouSeries: [],
      pingjunXinChouXAxisData: [],
      pingjunXinChouSeries: [],
      salaryInternship: 0,
      salaryAvg: 0,
      salaryMax: 0,
      salaryMedian: 0,
    }
  };

  componentWillMount () {
    this.listTotalSalary()
    this.listTotalCitySalary()
    this.listTotalWorkingYearsSalaryAvg()
    this.listTotalIndustrySalary()
  };

  componentDidMount () { }

  // 统计薪酬，最高、中位值、平均、实习
  listTotalSalary = () => {
    let { shixiXc, zuigaoXc, pingjunXc, zhongweiXc, salaryInternship,salaryMax, salaryAvg, salaryMedian } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.listTotalSalary(params).then(resp => {
      if (resp.code == 200 && resp.data) {
        salaryInternship = resp.data.salaryInternship
        salaryAvg = resp.data.salaryAvg
        salaryMax = resp.data.salaryMax
        salaryMedian = resp.data.salaryMedian
        shixiXc = [
          {value: resp.data.salaryInternship, name: '实习薪酬'},
          {value: resp.data.salaryAvg, name: '-'},
        ]
        zuigaoXc = [
          {value: resp.data.salaryMax, name: '最高薪酬'},
          {value: resp.data.salaryAvg, name: '-'},
        ]
        pingjunXc = [
          {value: resp.data.salaryAvg, name: '平均'},
          {value: resp.data.salaryAvg, name: '-'},
        ]
        zhongweiXc = [
          {value: resp.data.salaryMedian, name: '中位'},
          {value: resp.data.salaryAvg, name: '-'},
        ]
        this.setState({
          shixiXc, zuigaoXc, pingjunXc, zhongweiXc,
          salaryInternship,salaryMax, salaryAvg, salaryMedian
        })
      }
    })
  };

  // 城市薪酬top20
  listTotalCitySalary = () => {
    let { cityArr, chengshiXinchouSeries } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.listTotalCitySalary(params).then(resp => {
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        cityArr = resp.data.list.map((item:any) => {return item.cityname})
        let arr:any = resp.data.list.map((item:any) => {
          return [item.salary * 0.5, item.salary, item.salary * 0.6]
        })
        optionZhuzuang.series.map((seriesItem:any, seriesIdx:number) => {
          let obj:any = seriesIdx == 0
          ? {...seriesItem, data: arr.map(function (d) { return d[0] })}
          : {...seriesItem, data: arr.map(function (d) { return d[1] - d[0] })}
          chengshiXinchouSeries.push(obj)
        })
        this.setState({
          cityArr,
          chengshiXinchouSeries
        })
      }
    })
  };

  // 工作经验平均薪酬
  listTotalWorkingYearsSalaryAvg = () => {
    let { pingjunXinChouXAxisData, pingjunXinChouSeries } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    const colorArr = ['#fea67e', '#65e1e1', '#9fe7b9', '#38a1db', '#fad47f']
    
    CommonApi.listTotalWorkingYearsSalaryAvg(params).then(resp => {
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        pingjunXinChouXAxisData = resp.data.list.map(item => {
          return item.workingYears
        })
        const arr = resp.data.list.map(item => {
          return item.salary
        })
        arr.map((num:any, idx:number) => {
          pingjunXinChouSeries.push({value: num, itemStyle: {normal: { color: colorArr[idx%5] }}})
        })
        this.setState({
          pingjunXinChouXAxisData,
          pingjunXinChouSeries,
        })
      }
    })
  };

  // 行业薪酬
  listTotalIndustrySalary = () => {
    let { hangyeXinChouXAxisData, hangyeXinChouSeries } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.listTotalIndustrySalary(params).then(resp => {
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        hangyeXinChouXAxisData = resp.data.list.map(item => {return item.industryname})

        let salaryMinArr = resp.data.list.map(item => {return item.salaryMin})
        let salaryAvgArr = resp.data.list.map(item => {return item.salaryAvg})
        let salaryMedianArr = resp.data.list.map(item => {return item.salaryMedian})
        let salaryMaxArr = resp.data.list.map(item => {return item.salaryMax})
        let arr:any = [salaryMinArr, salaryAvgArr, salaryMedianArr, salaryMaxArr]
        optionDuidie.series.map((seriesItem:any, seriesIdx:number) => {
          let obj = {...seriesItem, data: arr[seriesIdx]}
            hangyeXinChouSeries.push(obj)
        })
      }
      this.setState({
        hangyeXinChouXAxisData,
        hangyeXinChouSeries,
      })
    })
  };

  render() {
    let { 
      shixiXc, zuigaoXc, pingjunXc, zhongweiXc,
      salaryInternship,salaryMax, salaryAvg, salaryMedian,
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
              option={{...optionBing1, title: {...optionBing1.title, text: salaryInternship}, series: {...optionBing1.series, data: shixiXc}}}
            />
          </View>
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='bbb'
              width='100%'
              height='190px'
              option={{...optionBing2, title: {...optionBing2.title, text: salaryMax}, series: {...optionBing2.series, data: zuigaoXc}}}
            />
          </View>
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='ccc'
              width='100%'
              height='190px'
              option={{...optionBing3, title: {...optionBing3.title, text: salaryAvg}, series: {...optionBing3.series, data: pingjunXc}}}
            />
          </View>
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='ddd'
              width='100%'
              height='190px'
              option={{...optionBing4, title: {...optionBing4.title, text: salaryMedian}, series: {...optionBing4.series, data: zhongweiXc}}}
            />
          </View>
        </View>

        {/* 圆柱状图 */}
        <View className="has-title-box">
          <View className="box-title"><Text className="box-title-text">城市薪酬-<Text className="color-orange">TOP20</Text></Text></View>
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
          <View className="box-title"><Text className="box-title-text">行业薪酬-<Text className="color-orange">TOP5</Text></Text></View>
          <View className="box-cont">
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
          <View className="box-title"><Text className="box-title-text">工作经验-<Text className="color-orange">平均薪酬</Text></Text></View>
          <View className="box-cont">
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
