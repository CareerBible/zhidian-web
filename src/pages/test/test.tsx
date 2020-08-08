import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import './test.scss';

export default class Test extends Component<any,any> {
  config = {
    navigationBarTitleText: '范例'
  }
  constructor(props) {
    super(props);
    this.state = { }
  }

  render() {
    return (
      <View className='index'>范例</View>
    )
  }
}