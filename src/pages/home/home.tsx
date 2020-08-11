import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image, Input } from '@tarojs/components';
import { AtInput, AtForm, AtButton, AtIcon } from 'taro-ui';
import './home.scss';
import logo from '@/assets/images/logo.png';
import wxCode from '@/assets/images/wx-code.jpg';
import { Common } from '@/utils/common.js';
import { CommonApi } from '@/api/Common.api';

export default class Home extends Component<any,any> {
  config = {
    navigationBarTitleText: '职典 - 数据指导就业'
  }

  constructor(props) {
    super(props);
    this.state = {
      searchDisciplineCode: null,
      searchDownlist: [],
      isShowDownBox: true,
      searchInpIsOnFocus: false,
      formData: {
        searchStr: null,
      }
    }
  }

  componentDidMount () {
    // this.getAuthorizeCodeUrl()
  };

  // 获取codeURL
  getAuthorizeCodeUrl = () => {
    CommonApi.getAuthorizeCodeUrl().then(resp => {
      if (resp.code == 200 && resp.data.url) {
        window.open(resp.data.url, '_blank')
      }
    })
  };

  // 搜索栏-输入改变
  searchBarOnChange (value) {
    let { formData, searchDownlist, isShowDownBox } = this.state
    CommonApi.searchDisciplineName({search: value}).then(resp => {
      if (resp.code == 200) {
        let arr:any = Common.getTree(resp.data.list, 'name', 'code', 'listChild')
        this.setState({
          searchDownlist: arr,
        })
      }
    })
    formData.searchStr = value
    isShowDownBox = true
    this.setState({
      formData,
      searchDownlist,
      isShowDownBox,
    })
  };

  // 点击搜索下拉
  handleClickSearchItem = (val, name) => {
    let { formData, searchDisciplineCode, isShowDownBox } = this.state
    formData.searchStr = name
    searchDisciplineCode = val
    isShowDownBox = false
    this.setState({
      formData,
      searchDisciplineCode,
      isShowDownBox,
    })
    setTimeout(() => {
      // this.query() 
      Taro.navigateTo({
        url: '/pages/discipline/discipline?code=' + val + '&name=' + encodeURI(name),
      })
    });
  }

  // 输入框绑定
  handleInputChange = (key, val) => {
    let { formData } = this.state
    formData[key] = val

    this.setState({
      formData
    })
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

  // 根据专业名称搜索
  handleSearch = () => {
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
    let { formData, searchDisciplineCode, searchDownlist, isShowDownBox, searchInpIsOnFocus } = this.state
    return (
      <View className='home-wrap'>
        <View className="home-cont at-row">
          <View className="home-logo">
            <Image src={logo} />
            <Text className="home-logo-txt">内测版</Text>
          </View>

          <View className="biaoyu">
            <Text>数据指导就业</Text>
          </View>

          {/* <AtForm className="shuruk">
            <AtInput
              placeholder="请输入专业名称"
              name="searchStr"
              border={false}
              value={formData.searchStr}
              onChange={this.handleInputChange.bind(this, 'searchStr')}
            />
            <Button onClick={this.handleSearch}>职典一下</Button>
          </AtForm> */}

          <View className="shuruk">
            <AtInput
              name="searchStr"
              placeholder="请输入专业名称"
              value={formData.searchStr} 
              onChange={this.searchBarOnChange.bind(this)}
              onFocus={this.searchBarOnFocus.bind(this)}
              onBlur={this.searchBarOnBlur.bind(this)}
            />
            {formData.searchStr && searchDownlist.length && isShowDownBox
                ? <View className="down-box">
                  {searchDownlist.map(searchItem => {
                    return (<View className="down-box-item" onClick={() => this.handleClickSearchItem(searchItem.value, searchItem.name)}>{searchItem.name}</View>)
                  })}
                </View>
              : null
            }
          </View>

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