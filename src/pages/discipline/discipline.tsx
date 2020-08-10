import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image, Input } from '@tarojs/components';
import './discipline.scss';
import { AtIcon, AtButton, AtSearchBar, AtInput } from 'taro-ui';
import Chart from 'taro-echarts';
import { Common } from '@/utils/common.js';
import { CommonApi } from '@/api/Common.api';

    
// 柱状图配置
const optionZhu = {
  title: {
    text: '薪酬',
    left: 'center',
    top: 10,
    textStyle: { color: '#32c5e9', fontWeight: 'normal', fontSize: 16 }
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
    // show: false,
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
    textStyle: { color: '#32c5e9', fontWeight: 'normal', fontSize: 16 }
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
    radius: '60%',
    center: ['50%', '60%'],
    label: {
      fontSize: 10,
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    labelLine: {
      show: true,
      length: 5,
      length2: 5,
    }
  }
};

export default class Discipline extends Component<any,any> {
  config = {
    // navigationBarTitleText: '专业名称 - 职典'
  }
  constructor(props) {
    super(props);
    this.state = {
      searchDisciplineCode: null,
      sortXinchou: 'DESC',
      sortZhiwei: null,
      filterData: {
        searchVal: '',
        districtRank: null,
        workingYears: null,
        salary: null,
      },
      filterList: [
        {title: '城市', key: 'districtRank', itemCurrentCode: null, expand: false, list: [
          {name: '不限', code: null},
          {name: '一线城市', code: '一线城市'},
          {name: '二线城市', code: '二线城市'},
          {name: '新一线城市', code: '新一线城市'}
        ]},
        {title: '年限', key: 'workingYears', itemCurrentCode: null, expand: false, list: [
          {name: '不限', code: null},
          {name: '1年以下', code: '1年以下'},
          {name: '1-3年', code: '1-3年'},
          {name: '3-5年', code: '3-5年'},
          {name: '5-10年', code: '5-10年'},
          {name: '10年以上', code: '10年以上'}
        ]},
        {title: '薪酬', key: 'salary', itemCurrentCode: null, expand: false, list: [
          {name: '不限', code: null},
          {name: '2k以下', code: '20-'},
          {name: '2k-5k', code: '2-5'},
          {name: '5k-8k', code: '5-8'},
          {name: '8k-12k', code: '8-12'},
          {name: '12k以上', code: '12+'}
        ]}
      ],
      dataSource: [],
      searchDownlist: [],
      isShowDownBox: true,
      searchInpIsOnFocus: false,
    }
  };

  componentDidMount () {
    console.log('this.$router.params: ', this.$router.params)
    if (this.$router.params.code) {
      this.query()
    }

    if (this.$router.params.name) {
      Taro.setNavigationBarTitle({
        title: decodeURI(this.$router.params.name) + ' - 职典'
      })
    }
  }

  // 根据专业检索职位列表
  query = () => {
    console.log('✨ 根据专业检索职位列表')
    let { searchDisciplineCode, filterData, sortXinchou, sortZhiwei } = this.state
    var params = {
      disciplineCode: searchDisciplineCode ? searchDisciplineCode : this.$router.params.code,
      whetherOrderBySalaryMin: sortXinchou,
      whetherOrderByPosts: sortZhiwei
    }
    Object.keys(filterData).forEach(key => {
      if (filterData[key]) {
        params[key] = filterData[key]
      }
    })
    // console.log('👺 根据专业检索职位列表 params: ', params)
    CommonApi.queryRecruitmentDataList(params).then(resp => {
      if (resp.code == 200 && resp.data.list && resp.data.list.length) {
        console.log('👺👺resp.data.list: ', resp.data.list)
        let arr:any = []
        resp.data.list.map(item => {
          arr.push({
            ...item,
            xinchouData: [item.salarymax, item.salarymin, item.avg, item.median],
            xueliData: item.totalEducation.map(Education => {
              return {name: Education.education, value: Education.count}
            })
          })
        })
        this.setState({
          dataSource: arr
        })
      } else {
        this.setState({
          dataSource: []
        })
      }
    })
  };

  // 展开收起
  handleToggle = (idx) => {
    const { filterList } = this.state
    filterList[idx].expand = !filterList[idx].expand
    this.setState({
      filterList,
      isShowDownBox: false,
    })
  };

  // 点击筛选
  handleFilter = (idx, key, code, name) => {
    console.log('🌹 key: ', key, ', name: ', name)
    let { filterList, filterData } = this.state
    filterData[key] = code
    filterList[idx].itemCurrentCode = code
    // console.log('filterList[idx]: ', filterList[idx])
    this.setState({
      filterList,
      filterData,
    })
    this.query()
  };

  // 点击排序
  handleChangeSort = (key:any) => {
    let { sortXinchou, sortZhiwei } = this.state
    if (key == 'xinchou') {
      sortXinchou = sortXinchou == 'DESC' ? 'ASC' : 'DESC'
      sortZhiwei = null
    } else if (key == 'zhiwei') {
      sortZhiwei = sortZhiwei == 'DESC' ? 'ASC' : 'DESC'
      sortXinchou = null
    }
    this.setState({
      sortXinchou,
      sortZhiwei,
    })
    setTimeout(() => {
      this.query()
    });
  };

  searchBarOnFocus = () => {
    this.setState({
      searchInpIsOnFocus: true
    })
  };

  searchBarOnBlur = () => {
    this.setState({
      searchInpIsOnFocus: false,
      isShowDownBox: false,
      searchDownlist: []
    })
  };

  // 搜索栏-输入改变
  searchBarOnChange (value) {
    let { filterData, searchDownlist, isShowDownBox } = this.state
    console.log('value: ', value)
    CommonApi.searchDisciplineName({search: value}).then(resp => {
      console.log('👺 根据专业名称获取目录 resp: ', resp)
      if (resp.code == 200) {
        let arr:any = Common.getTree(resp.data.list, 'name', 'code', 'listChild')
        this.setState({
          searchDownlist: arr,
        })
      }
    })
    filterData.searchVal = value
    isShowDownBox = true
    this.setState({
      filterData,
      searchDownlist,
      isShowDownBox,
    })
  };

  // 点击搜索下拉列表
  handleClickSearchItem = (val, name) => {
    let { filterData, searchDisciplineCode, isShowDownBox } = this.state
    filterData.searchVal = name
    searchDisciplineCode = val
    isShowDownBox = false
    this.setState({
      filterData,
      searchDisciplineCode,
      isShowDownBox,
    })
    setTimeout(() => {
      this.query() 
    });
  }

  // 搜索栏-确定搜索
  handOnSearch () {
    Taro.navigateTo({
      url: '/pages/catalog/catalog?search=' + this.state.filterData.searchVal,
    })
  }

  // 去往详情页
  goToDetails = (id, name) => {
    Taro.navigateTo({
      url: '/pages/details/details?disciplineCode=' + this.$router.params.code + '&positionid=' + id + '&positionname=' + encodeURI(name),
    })
  };

  // 返回上一级页面
  goBack = () => {
    Taro.navigateBack({
      delta: 1
    });
  }

  render() {
    const { filterData, filterList, searchDownlist, isShowDownBox, sortXinchou, sortZhiwei, dataSource, xinchouData, xueliData, searchInpIsOnFocus } = this.state

    return (
      <View className='discipline-wrap'>
        <View className="discipline-header">
          <View className="at-row discipline-search">
            <View className="at-col at-col-2">
              <AtIcon value='chevron-left' size='30' color='#fff' onClick={this.goBack}></AtIcon>
            </View>
            <View className="at-col at-col-10">
              <View className={searchInpIsOnFocus ? 'discipline-search-input-wrap w-100' : 'discipline-search-input-wrap w-30'}>
                <AtInput 
                  name="searchVal"
                  placeholder="专业"
                  value={filterData.searchVal}
                  onChange={this.searchBarOnChange.bind(this)} 
                  onFocus={this.searchBarOnFocus.bind(this)} 
                  onBlur={this.searchBarOnBlur.bind(this)} 
                />
                {filterData.searchVal && searchDownlist.length && isShowDownBox
                  ? <View className="down-box">
                      {searchDownlist.map(searchItem => {
                        return (<View className="down-box-item" onClick={() => this.handleClickSearchItem(searchItem.value, searchItem.name)}>{searchItem.name}</View>)
                      })}
                    </View>
                  : null
                }
              </View>
              {/* <AtSearchBar value={filterData.searchVal} onChange={this.searchBarOnChange.bind(this)} onActionClick={this.handOnSearch.bind(this)} /> */}
            </View>
          </View>
          {/* 筛选 */}
          <View className="discipline-filter">
            {filterList.length && filterList.map((item:any, idx:number) => {
              return (
                <View className={item.expand ? 'discipline-filter-item expand' : 'discipline-filter-item'} key={idx}>
                  <View className="discipline-filter-item-title">{item.title}：</View>
                  <View className="discipline-filter-item-rank">
                    {item.list && item.list.map((item_c:any, idx_c:number) => {
                      return (
                        <Text key={idx_c} className={item_c.code == item.itemCurrentCode ? 'active': ''} onClick={() => this.handleFilter(idx, item.key, item_c.code, item.c_name)}>{item_c.name}</Text>
                      )
                    })}
                  </View>
                  <View className="discipline-filter-action" onClick={() => this.handleToggle(idx)}>
                    <Text className={item.expand ? 'action-text sanjiao-top' : 'action-text sanjiao-below'}>{item.expand ? '收起' : '展开'}</Text>
                    {/* <AtIcon prefixClass='icon' value={item.expand ? 'sanjiao-top' : 'sanjiao-below'} size="1" /> */}
                  </View>
                </View>
              )
            })}
          </View>

          {/* 排序 */}
          <View className="at-row discipline-sort">
            <View className="at-col at-col-5" onClick={() => this.handleChangeSort('xinchou')}>
              <Text className={'discipline-sort-text ' + (sortXinchou == 'DESC' ? 'down' : (sortXinchou == 'ASC' ? 'up' : ''))}>按薪酬排序</Text>
            </View>
            <View className="at-col at-col-7" onClick={() => this.handleChangeSort('zhiwei')}>
              <Text className={'discipline-sort-text ' + (sortZhiwei == 'DESC' ? 'down' : (sortZhiwei == 'ASC' ? 'up' : ''))}>按职位数排序</Text>
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
                        <Button onClick={() => this.goToDetails(item.positionid, item.positionname)}>查看详情</Button>
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
            : <View className="pt-100 pb-150">
                <View className="no-data"></View>
              </View>
          }
        </View>
      </View>
    )
  }
}