import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import './xuqiu.scss';
import Chart from 'taro-echarts';
import ChinaMap from './ChinaMap';
import { CommonApi } from '@/api/Common.api';
// import '@/utils/echarts.js';

// 饼状图配置
const optionBing1 = {
  color: ["#dedede", "#ff6235"],
  title: {
    text: '12568',
    subtext: '同届毕业人数',
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
    labelLine: { show: false },
  }
};

const optionBing2 = {
  color: ["#dedede", "#6ea4fc"],
  title: {
    text: '12568',
    subtext: '在聘职位数',
    left: 'center',
    top: '40%',
    textStyle: { color: '#6ea4fc', fontWeight: 'bold', fontSize: 20 },
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

// 实心饼图配置
const optionBing3 = {
  color: ["#b1edd4", "#fe5858", "#ffdc5c", "#c6cad6", "#7c8df5", "#8cccfa", "#8cccfa", "#fcd681", "#f47d99", "#83ddb7", "#e4cfb0", "#f69876", "#c33332", "#79c5e5", "#61a0a9", "#38a1db", "#58c695"],
  series: { name: '访问来源', type: 'pie' }
};

// 空心饼图配置
const optionBing4 = {
  color: ["#6ea4fc", "#fccc5e", "#5bd4e7", "#ffa2ad", "#b4ebd4"],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: { orient: 'vertical', left: 10, data: [] },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: ['50%', '70%'],
    avoidLabelOverlap: false,
    label: { show: false, position: 'center' },
    emphasis: { label: { show: true, fontSize: '20' } },
    labelLine: { show: false },
  }
};

// 南丁格尔饼图配置
const optionBing5 = {
  color: ["#ff9f7f", "#6ff7f7", "#9fe7b9", "#38a1db", "#fad47f"],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 10,
    data: ['互联网', '房地产', '金融', '银行', '媒体']
  },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: '75%',
    center: ['50%', '50%'],
    roseType: 'radius',
    label: {},
    labelLine: { smooth: 0.2, length: 10, length2: 20 },
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function (idx) {
      return Math.random() * 200;
    }
  }
};

export default class Xuqiu extends Component<any, any> {
  mapChart: any;
  constructor(props:any, context:any) {
    super(props, context)

    this.state = {
      fenbuchengshi: [],
      biyerenshuSeriesData: [],
      zaipinzhiweiSeriesData: [],
      chengshizhanbiSeriesData: [],
      hangyetop5LegendData: [],
      hangyetop5SeriesData: [],
      zhiweifenbuSeriesData: [],
    }
  };

  componentWillMount () {
    this.listTotalArea()
    this.listTotalCity()
    this.workExperienceDistributed()
    this.listTotalNumber()
    this.listTotalIndustry()
  };

  componentDidMount() {}

  refMapChart = (node) => {
    console.log('node: ', node)
    this.mapChart = node
  }

  // 根据职位查询城市分布
  listTotalArea = () => {
    let { fenbuchengshi } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.listTotalArea(params).then(resp => {
      console.log('🧚‍♀️ 根据职位查询城市分布 resp: ', resp)
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        fenbuchengshi = resp.data.list.map(item => {
          return {name: item.name.replace('省',''), value: +item.totalnumber}
        })
        this.setState({
          fenbuchengshi
        })
        this.mapChart.refresh(fenbuchengshi);
      } else {
        this.mapChart.refresh([]);
      }
    })
  };

  // 根据职位查询城市占比
  listTotalCity = () => {
    let { chengshizhanbiSeriesData } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.listTotalCity(params).then(resp => {
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        console.log('🧚‍♀️ 根据职位查询城市占比 resp: ', resp)
        chengshizhanbiSeriesData = resp.data.list.map(item => {
          return {name: item.name, value: +item.totalnumber}
        })
      } else {
        chengshizhanbiSeriesData = []
      }
      this.setState({
        chengshizhanbiSeriesData
      })
    })
  };

  // 工作经验分布
  workExperienceDistributed = () => {
    let { zhiweifenbuSeriesData } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.workExperienceDistributed(params).then(resp => {
      console.log('🇨🇳🇨🇳🇨🇳 工作经验分布 resp: ', resp)
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        zhiweifenbuSeriesData = resp.data.list.map(item => {
          return {name: item.workingYears, value: +item.number}
        })
      } else {
        zhiweifenbuSeriesData = []
      }
      this.setState({
        zhiweifenbuSeriesData
      })
    })
  };

  // 职位分布
  // listTotalPosition = () => {
  //   let { zhiweifenbuSeriesData } = this.state
  //   let params = {
  //     positionId: this.$router.params.positionid,
  //     disciplineCode: this.$router.params.disciplineCode,
  //   }
  //   CommonApi.listTotalPosition(params).then(resp => {
  //     if (resp.code == 200 && resp.data.list && resp.data.list.length) {
  //       console.log('🧚‍♀️ 职位分布 resp: ', resp)
  //       zhiweifenbuSeriesData = resp.data.list.map(item => {
  //         return {name: item.positionname, value: +item.number}
  //       })
  //     } else {
  //       zhiweifenbuSeriesData = []
  //     }
  //     this.setState({
  //       zhiweifenbuSeriesData
  //     })
  //   })
  // };

  // 统计同届毕业人数，在聘职位数
  listTotalNumber = () => {
    let { biyerenshuSeriesData, zaipinzhiweiSeriesData } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.listTotalNumber(params).then(resp => {
      if (resp.code == 200 && resp.data) {
        console.log('🧚‍♀️ 统计同届毕业人数，在聘职位数 resp: ', resp)
        biyerenshuSeriesData = [
          {value: resp.data.graduatesNumber, name: '同届毕业人数'},
          {value: resp.data.graduatesNumber, name: '-'},
        ]
        zaipinzhiweiSeriesData = [
          {value: resp.data.hiringNumber, name: '在聘职位数'},
          {value: resp.data.hiringNumber, name: '-'},
        ]
      }
      this.setState({
        biyerenshuSeriesData,
        zaipinzhiweiSeriesData
      })
    })
  };

  // 行业top5
  listTotalIndustry = () => {
    let { hangyetop5LegendData, hangyetop5SeriesData } = this.state
    let params = {
      positionId: this.$router.params.positionid,
      disciplineCode: this.$router.params.disciplineCode,
    }
    CommonApi.listTotalIndustry(params).then(resp => {
      console.log('🧚‍♀️ 🧚‍♀️🧚‍♀️🧚‍♀️🧚‍♀️行业top5 resp: ', resp)
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        hangyetop5LegendData = resp.data.list.map(item => {
          return item.industry
        })
        hangyetop5SeriesData = resp.data.list.map(item => {
          return {name: item.industry, value: +item.totalnumber}
        })
      } else {
        hangyetop5LegendData = []
        hangyetop5SeriesData = []
      }
      this.setState({
        hangyetop5LegendData,
        hangyetop5SeriesData,
      })
    })
  };

  render() {
    let { biyerenshuSeriesData, zaipinzhiweiSeriesData, chengshizhanbiSeriesData, hangyetop5LegendData, hangyetop5SeriesData, zhiweifenbuSeriesData } = this.state
    return (
      <View className="echarts-box-wrap">
        {/* 2个饼图合集 */}
        <View className="at-row at-row--wrap default-box">
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='aaa'
              width='100%'
              height='190px'
              option={{...optionBing1, series: {...optionBing1.series, data: biyerenshuSeriesData}}}
            />
          </View>
          <View className="at-col at-col-6 pr-20">
            <Chart
              chartId='bbb'
              width='100%'
              height='190px'
              option={{...optionBing2, series: {...optionBing2.series, data: zaipinzhiweiSeriesData}}}
            />
          </View>
        </View>

        {/* 中国地图 */}
        <View className="has-title-box">
          <View className="box-title"><Text className="color-orange">区域分布</Text></View>
          <View className="box-cont">
            <ChinaMap ref={this.refMapChart} />
          </View>
        </View>

        {/* 实心饼图 */}
        <View className="has-title-box">
          <View className="box-title"><Text className="color-orange">城市分布</Text></View>
          <View className="box-cont pr-30">
            {chengshizhanbiSeriesData.length
            ? <Chart
                chartId='ddd'
                width='100%'
                height='300px'
                option={{...optionBing3, series: {...optionBing3.series, data: chengshizhanbiSeriesData}}}
              />
            : <View className="no-data"></View>
            }
          </View>
        </View>

        {/* 空心饼图 */}
        <View className="has-title-box">
          <View className="box-title"><Text className="color-orange">行业TOP5</Text></View>
          <View className="box-cont pr-30">
            {hangyetop5SeriesData.length
            ? <Chart
                chartId='ddd'
                width='100%'
                height='300px'
                option={{...optionBing4, legend: {...optionBing4.legend, data: hangyetop5LegendData}, series: {...optionBing4.series, data: hangyetop5SeriesData}}}
              />
            : <View className="no-data"></View>
            }
          </View>
        </View>

        {/* 南丁格尔饼图 */}
        <View className="has-title-box">
          <View className="box-title"><Text className="color-orange">工作经验分布</Text></View>
          <View className="box-cont pr-30">
            {zhiweifenbuSeriesData.length
            ? <Chart
              chartId='ddd'
              width='100%'
              height='300px'
              option={{...optionBing5, series: {...optionBing5.series, data: zhiweifenbuSeriesData}}}
            />
            : <View className="no-data"></View>
            }
          </View>
        </View>

        <View className="echarts-box-footer">—— 不止诗与远方 ——</View>
      </View>
    );
  }
}
