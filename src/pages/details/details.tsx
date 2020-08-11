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
    // navigationBarTitleText: '职位名称 - 职典'
  }
  constructor(props) {
    super(props);

    this.state = {
      positionName: null,
      tabList: [
        {title: '技能要求'},
        {title: '职业薪酬'},
        {title: '市场供需'},
      ],
      currentTab: 1,
    }
  }

  componentDidMount () {
    if (this.$router.params.positionname) {
      this.setState({
        positionName: decodeURI(this.$router.params.positionname)
      })
      Taro.setNavigationBarTitle({
        title: decodeURI(this.$router.params.positionname) + ' - 职典'
      })
    }
  }

  handleClick (value) {
    this.setState({
      currentTab: value
    })
  }

  render() {
    let { positionName, tabList, currentTab } = this.state
    return (
      <View className="details-wrap">
        <View className="details-header">
          <View className="details-header-title">{positionName}</View>
          <Image src={detailHeader} />
          <View className={currentTab == 1 ? 'arrow' : (currentTab == 0 ? 'arrow arrow-1' : 'arrow arrow-2')}>
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