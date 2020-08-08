import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import './details.scss';
import { AtTabs, AtTabsPane } from 'taro-ui';
import Gaishu from './component/gaishu/gaishu';
import Xinchou from './component/xinchou/xinchou';
import Xuqiu from './component/xuqiu/xuqiu';
import Jineng from './component/jineng/jineng';
import detailHeader from '@/assets/images/detail_header.png';
import arrow from '@/assets/images/arrow.png';

export default class Details extends Component<any,any> {
  config = {
    navigationBarTitleText: '详情'
  }
  constructor(props) {
    super(props);

    this.state = {
      tabList: [
        {title: '技能要求'},
        {title: '职业薪酬'},
        {title: '市场供需'},
      ],
      currentTab: 1,
    }
  }

  handleClick (value) {
    this.setState({
      currentTab: value
    })
  }

  render() {
    let { tabList, currentTab } = this.state
    return (
      <View className="details-wrap">
        <View className="details-header">
          <View className="details-header-title">前端工程师</View>
          <Image src={detailHeader} />
          <View className="arrow">
            <Image src={arrow} />
          </View>
        </View>
        <AtTabs current={currentTab} tabList={tabList} onClick={this.handleClick.bind(this)} className="details-tab">
          {/* 职位概述 */}
          {/* <AtTabsPane current={currentTab} index={0}>
            <Gaishu />
          </AtTabsPane> */}

          {/* 技能要求 */}
          <AtTabsPane current={currentTab} index={0}>
            <Jineng />
          </AtTabsPane>
          
          {/* 职业薪酬 */}
          <AtTabsPane current={currentTab} index={1} >
            <Xinchou />
          </AtTabsPane>

          {/* 市场供需 */}
          <AtTabsPane current={currentTab} index={2}>
            <Xuqiu />
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}