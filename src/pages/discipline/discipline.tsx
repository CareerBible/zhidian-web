import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import './discipline.scss';
import { AtIcon, AtButton } from 'taro-ui';
import Chart from 'taro-echarts';
import { CommonApi } from '@/api/Common.api';

    
// 柱状图配置
const optionZhu = {
  title: {
    text: '薪酬',
    left: 'center',
    top: 10,
    textStyle: { color: '#37a2da', fontWeight: 'normal', fontSize: 16 }
  },
  grid: {
    top: '25%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  tooltip : {},
  xAxis: [{
    type: 'category',
    data: ['最高值', '最低值', '平均值', '中位值'],
    axisPointer: {
      type: 'line'
    },
    axisLabel: {
      // margin: 8,
      // rotate: 45,
      textStyle: { fontSize: 9 }
    },
    splitLine: {
      show: false
    }
  }],
  yAxis: {
    type : 'value',
    axisLabel: {
      textStyle: { fontSize: 9 }
    },
  },
  itemStyle: {
    barBorderRadius: [30, 30, 0, 0]
  },
  series : {
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
    // data: xinchouData,
    label: {
      show: true,
      position: 'top',
      color: 'rgba(0, 0, 0, 0.5)',
      fontSize: 9
    },
    roundCap: true
  }
}

// 饼状图配置
const optionBing = {
  color: ["#ff9f7f", "#67e0e3", "#9ee6b7", "#37a2da"],
  title: {
    text: '学历',
    left: 'center',
    top: 10,
    textStyle: { color: '#37a2da', fontWeight: 'normal', fontSize: 16 }
  },
  tooltip: {
    show: false
  },
  legend: {
    show: false
  },
  series: {
    name: '访问来源',
    type: 'pie',
    radius: ['40%','65%'],
    center : ['50%', 110],
    avoidLabelOverlap: false,
    label: {
      position: 'center',
      color: '#fff'
    },
    labelLine: { show: false },
    // data: xueliData,
  }
};

export default class Discipline extends Component<any,any> {
  config = {
    navigationBarTitleText: '专业职位列表'
  }
  constructor(props) {
    super(props);
    this.state = {
      sortXinchou: null,
      sortZhiwei: null,
      filterData: {
        districtRank: null,
        workingYears: null,
        salary: null,
      },
      filterList: [
        {title: '城市', key: 'districtRank', expand: false, list: [
          {name: '不限', code: '0'},
          {name: '一线城市', code: '1'},
          {name: '二线城市', code: '2'},
          {name: '新一线城市', code: '3'}
        ]},
        {title: '年限', key: 'workingYears', expand: false, list: [
          {name: '不限', code: '0'},
          {name: '2年以下', code: '1'},
          {name: '1-3年', code: '2'},
          {name: '3-5年', code: '3'},
          {name: '5-10年', code: '4'},
          {name: '10年以上', code: '5'}
        ]},
        {title: '薪酬', key: 'salary', expand: false, list: [
          {name: '不限', code: '0'},
          {name: '2k以下', code: '1'},
          {name: '2k-5k', code: '2'},
          {name: '5k-8k', code: '3'},
          {name: '8k-12k', code: '4'},
          {name: '12k以上', code: '5'}
        ]}
      ],
      dataSource: [],
    }
  };

  componentDidMount () {
    console.log('this.$router.params: ', this.$router.params)
    if (this.$router.params.code) {
      this.query(this.$router.params.code)
    }

    if (this.$router.params.name) {
      Taro.setNavigationBarTitle({
        title: this.$router.params.name + '专业'
      })
    }
  }

  // 根据专业检索职位列表
  query = (code) => {
    let { filterData } = this.state
    var params = {
      disciplineCode: code,
    }
    Object.keys(filterData).forEach(key => {
      if (filterData[key]) {
        params[key] = filterData[key]
      }
    })
    // console.log('👺 根据专业检索职位列表 params: ', params)
    CommonApi.queryRecruitmentDataList(params).then(resp => {
      if (resp.code == 200) {
        console.log('resp.data.list: ', resp.data.list)
        this.setState({
          dataSource: [{
            totalnumber: 10,
            avgSalaryMax: '15K',
            avgSalaryMin: '12K',
            disciplinename: '专业名称',
            positionname: '职位名称',
            xinchouData: [100, 200, 300, 400],
            xueliData: [
              {name: '最低值', value: 100},
              {name: '最高值', value: 200},
              {name: '中位值', value: 300},
              {name: '平均值', value: 400},
            ]
          }],
        })
      }
    })
  };

  // 展开收起
  handleToggle = (idx) => {
    const { filterList } = this.state
    filterList[idx].expand = !filterList[idx].expand
    this.setState({
      filterList
    })
  };

  // 点击筛选
  handleFilter = (key, name) => {
    let { filterData } = this.state
    filterData[key] = name
    this.setState({
      filterData
    })
    this.query(this.$router.params.code)
  };

  // 点击排序
  handleChangeSort = (key:any) => {
    let { sortXinchou, sortZhiwei } = this.state
    if (key == 'xinchou') {
      sortXinchou = !sortXinchou
      this.setState({
        sortXinchou
      })
    } else if (key == 'zhiwei') {
      sortZhiwei = !sortZhiwei
      this.setState({
        sortZhiwei
      })
    }
  };

  // 去往详情页
  goToDetails = (val) => {
    Taro.navigateTo({
      url: '/pages/details/details',
    })
  };

  render() {
    const { filterList, sortXinchou, sortZhiwei, dataSource, xinchouData, xueliData } = this.state

    return (
      <View className='discipline-wrap'>
        <View className="discipline-header">
          {/* 筛选 */}
          <View className="discipline-filter">
            {filterList.length && filterList.map((item:any, idx:number) => {
              return (
                <View className={item.expand ? 'discipline-filter-item expand' : 'discipline-filter-item'} key={idx}>
                  <View className="discipline-filter-item-title">{item.title}：</View>
                  <View className="discipline-filter-item-rank">
                    {item.list && item.list.map((item_c:any, idx_c:number) => {
                      return (
                        <Text key={idx_c} onClick={() => this.handleFilter(item.key, item_c.name)}>{item_c.name}</Text>
                      )
                    })}
                  </View>
                  <View className="discipline-filter-action" onClick={() => this.handleToggle(idx)}>
                    <Text className="pr-10">{item.expand ? '收起' : '展开'}</Text>
                    <AtIcon prefixClass='icon' value={item.expand ? 'sanjiao-top' : 'sanjiao-below'} size="1" />
                  </View>
                </View>
              )
            })}
          </View>

          {/* 排序 */}
          <View className="at-row discipline-sort">
            <View className="at-col" onClick={() => this.handleChangeSort('xinchou')}>
              <Text className={sortXinchou ? 'discipline-sort-text up' : 'discipline-sort-text down'}>按薪酬排序</Text>
            </View>
            <View className="at-col" onClick={() => this.handleChangeSort('zhiwei')}>
              <Text className={sortZhiwei ? 'discipline-sort-text up' : 'discipline-sort-text down'}>按职位数排序</Text>
            </View>
          </View>
        </View>

        {/* 卡片 */}
        <View className="professional-card">
          {dataSource.length
            ? dataSource.map((item:any, idx:number) => {
              let itemXinchouData = item.xinchouData
              let itemXueliData = item.xueliData
                return (
                  <View className="professional" key={idx}>
                    <View className="professional-title">
                      <View className="professional-title-text">{item.positionname}</View>
                      <View className="professional-title-btn">
                        <AtButton type="secondary" size="small" circle onClick={this.goToDetails}>查看详情</AtButton>
                      </View>
                    </View>
                    <View className="professional-cont">
                      <View className="professional-cont-text">薪酬：<Text className="text-info">{item.avgSalaryMin}-{item.avgSalaryMax}</Text></View>
                      <View className="professional-cont-text">在聘职位人数：<Text className="text-info">{item.totalnumber}</Text></View>
                      <View className="professional-cont-tag proprietary">{item.disciplinename}</View>

                      {/* echarts */}
                      <View className="at-row">
                        <View className="at-col at-col-6">
                          <Chart
                            chartId='aaa'
                            width='100%'
                            height='190px'
                            option={{...optionZhu, series: {...optionZhu.series, data: itemXinchouData}}}
                          />
                        </View>
                        <View className="at-col at-col-6">
                          <Chart
                            chartId='bbb'
                            width='100%'
                            height='190px'
                            option={{...optionBing, series: {...optionBing.series, data: itemXueliData}}}
                          />
                        </View>
                      </View>
                      {/* echarts end */}    
                    </View>
                  </View>
                )
              })
            : <View className="pt-100 pb-60">
                <View className="no-data"></View>
              </View>
          }
        </View>
      </View>
    )
  }
}