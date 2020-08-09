import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import './catalog.scss';
import Tree from '../../components/tree';
import { Common } from '@/utils/common.js';
import { CommonApi } from '@/api/Common.api';
import { AtToast } from 'taro-ui';

// const dataSource = [
//   {
//     label: '大类A',
//     value: 'a',
//     children: [
//       {label: 'A-小类1', value: 'a-1', children: [{label: 'A-a-孙类1', value: 'a-1-1'}, {label: 'A-a-孙类2', value: 'a-1-2'}]},
//       {label: 'A-小类2', value: 'a-2'},
//       {label: 'A-小类3', value: 'a-3'},
//       {label: 'A-小类4', value: 'a-4'},
//     ]
//   },
//   {
//     label: '大类B',
//     value: 'a',
//     children: [
//       {label: 'B-小类1', value: 'b-1'},
//       {label: 'B-小类2', value: 'b-2'},
//       {label: 'B-小类3', value: 'b-3'},
//       {label: 'B-小类4', value: 'b-4'},
//     ]
//   },
//   {
//     label: '大类C',
//     value: 'a',
//     children: [
//       {label: 'C-小类1', value: 'c-1'},
//       {label: 'C-小类2', value: 'c-2'},
//       {label: 'C-小类3', value: 'c-3'},
//       {label: 'C-小类4', value: 'c-4'},
//     ]
//   }
// ]

export default class Catalog extends Component<any,any> {
  config = {
    navigationBarTitleText: '专业目录'
  }
  constructor(props) {
    super(props);
    this.state = {
      treeVal: null,
      dataSource: [],      
      isLoadingOver: false,
    }
  }

  componentDidMount () {
    console.log('this.$router.params: ', this.$router.params)
    if (this.$router.params.search) {
      this.searchDisciplineName(this.$router.params.search)
    } else {
      this.query()
    }
  }

  // 根据专业名称获取目录
  searchDisciplineName = (str) => {
    CommonApi.searchDisciplineName({search: str}).then(resp => {
      console.log('👺 根据专业名称获取目录 resp: ', resp)
      if (resp.code == 200) {
        let arr:any = Common.getTree(resp.data.list, 'name', 'id', 'listChild')
        this.setState({
          dataSource: arr,
          isLoadingOver: true,
        })
      }
    })
  };

  // 获取默认目录
  query = () => {
    CommonApi.queryDisciplineList().then(resp => {
      console.log('👺 获取默认目录 resp: ', resp)
      if (resp.code == 200) {
        let arr:any = Common.getTree(resp.data.list, 'name', 'id', 'listChild')
        this.setState({
          dataSource: arr,
          isLoadingOver: true,
        })
      }
    })
  };
  
  // 点击某个分类
  onChange = val => {
    console.log('👺 val: ',val)
		this.setState({
			treeVal: val
    })
    let selectedArr:any = []
    let selectedObjArr = Common.searchTree(this.state.dataSource, [val], selectedArr,  'value', 'children')
    console.log('👺 selectedObjArr: ',selectedObjArr)
    if (!(selectedObjArr[0].children && selectedObjArr[0].children.length)) {
      // let currentObj = selectedObjArr[0]
      this.goToDiscipline(selectedObjArr[0].code, selectedObjArr[0].name)
    }
  }
  
  // 去往专业页
  goToDiscipline = (val, name) => {
    Taro.navigateTo({
      url: '/pages/discipline/discipline?code=' + val + '&name=' + encodeURI(name),
    })
  };

  render() {
    const { treeVal, dataSource, isLoadingOver } = this.state
    return (
      <View className='catalog-wrap'>
        {isLoadingOver
          ? <View>
            {dataSource.length
              ? <Tree
                value={treeVal}
                dataSource={dataSource} 
                onChange={this.onChange}
                treeDefaultExpandAll={false}
              />
              : <View className="no-data"></View>
            }
          </View>
          : <AtToast isOpened={!isLoadingOver} text="正在加载…"></AtToast>
        }
      </View>
    )
  }
}