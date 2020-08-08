import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image, Input } from '@tarojs/components';
import { AtInput, AtForm, AtButton, AtIcon } from 'taro-ui';
import './home.scss';
import logo from '@/assets/images/logo.png';
import wxCode from '@/assets/images/wx-code.jpg';
import { CommonApi } from '@/api/Common.api';

export default class Home extends Component<any,any> {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        searchStr: null,
      }
    }
  }

  // 输入框绑定
  handleInputChange = (key, val) => {
    console.log('👺key: ', key, ', val: ', val)
    let { formData } = this.state
    formData[key] = val

    this.setState({
      formData
    })
  };

  // 根据专业名称搜索
  handleSearch = () => {
    console.log('🧚‍♀️ this.state.formData: ', this.state.formData)
    Taro.navigateTo({
      url: '/pages/catalog/catalog?search=' + this.state.formData.searchStr,
    })
  }

  // 去往专业目录页
  goToCatalog = () => {
    Taro.navigateTo({
      url: '/pages/catalog/catalog',
    })
  };

  render() {
    let { formData } = this.state
    return (
      <View className='home-wrap'>
        <View className="home-cont">
          <View className="home-logo">
            <Image src={logo} />
          </View>

          <View className="biaoyu">
            <Text>看职业</Text>
            <Text>选专业</Text>
          </View>

          <AtForm className="shuruk">
            <AtInput
              placeholder="请输入专业名称"
              name="searchStr"
              border={false}
              value={formData.searchStr}
              onChange={this.handleInputChange.bind(this, 'searchStr')}
            />
            <Button onClick={this.handleSearch}>职典一下</Button>
          </AtForm>

          <View className="pt-20">
            <View className="mulv" onClick={this.goToCatalog}>
              <AtIcon prefixClass='icon' value='search' size="14" />
              <Text className="pl-10">专业目录</Text>
            </View>
          </View>

          <View className="pt-20 chaxun">
            <Text>723</Text>个全专业查询
          </View>

          <View className="wx-code"><Image src={wxCode} /></View>

          <View className="gzh">长按关注公众号“职典”</View>
        </View>
      </View>
    )
  }
}