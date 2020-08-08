import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import './gaishu.scss';
import gaishu from '@/assets/images/gaishu.png';

export default class Gaishu extends Component<any, any> {
  constructor(props:any, context:any) {
    super(props, context)

    this.state = { }
  };

  componentWillMount () { };

  componentDidMount () { }

  render() {
    return (
      <View className="gaishu-wrap">
        <View className="gaishu-top-img">
          <Image src={gaishu} />
        </View>

        {/* 职业概述 */}
        <View className="gaishu-cont">
          <View className="gaishu-title">
            <View className="gaishu-title-round">01</View>
            <View className="gaishu-title-text">职业概述</View>
          </View>
          <View className="gaishu-desc">啊沙发沙发大沙发沙发沙发沙发大发大沙发沙发沙大是大非啊沙发沙发大沙发沙发沙发沙发大是大非啊沙发沙发大沙发沙发沙发沙发大是大非啊沙发沙发大沙发沙发沙发沙发大是大非啊沙发沙发大沙发沙发沙发沙发大是大非</View>
        </View>

        {/* 职责解析 */}
        <View className="gaishu-cont">
          <View className="gaishu-title">
            <View className="gaishu-title-round">02</View>
            <View className="gaishu-title-text">职责解析</View>
          </View>
          <View className="gaishu-desc">啊沙发沙发大沙发沙发沙发沙发大发大沙发沙发沙大是大非啊沙发沙发大沙发沙发沙发沙发大是大非啊沙发沙发大沙发沙发沙发沙发大是大非啊沙发沙发大沙发沙发沙发沙发大是大非啊沙发沙发大沙发沙发沙发沙发大是大非</View>
        </View>
      </View>
    );
  }
}
