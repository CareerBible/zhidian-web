
import http from '@/utils/http.js';

export class Common {
  /*数组去重*/
  static toHeavy (arr) {
    if (arr.length) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            arr.splice(j, 1)
            j--
          }
        }
      }
    }
    return arr
  }

  // 遍历树
  static getTree (data, labelKey, valueKey, childArrKey) {
    data.map((item, index) => {
      item.value = item[valueKey]
      item.label = item[labelKey]
      // item.isCheckAll = false
      item.children = item[childArrKey]
      
      if (item[childArrKey] && item[childArrKey].length) {
        this.getTree(item[childArrKey], labelKey, valueKey, childArrKey)
      }
    })
    return data
  }

  // 查找树
  static searchTree (data, selectedIdArr, overObjArr, valueKey, childArrKey) {
    data.map((item, index) => {
      if (selectedIdArr.indexOf(item[valueKey]) != -1) {
        overObjArr.push(item)
      }
      
      if (item[childArrKey] && item[childArrKey].length) {
        this.searchTree(item[childArrKey], selectedIdArr, overObjArr, valueKey, childArrKey)
      }
    })
    return overObjArr
  }

  // 过滤对象中的空值
  static filterObj (obj) {
    var param = {};
    if ( obj === null || obj === undefined || obj === '' ) return param;
    for ( var key in obj ) {
      if ( obj[key] && obj[key] !== null && obj[key] !== undefined && obj[key] !== '' && obj[key] !== [] ) {
        param[key] = obj[key];
      }
    }
    return param;
  }

  // 分享-无用
  static handleOnShareAppMessage (shareInfo) {
    return {
      title: shareInfo.title,
      path: shareInfo.path,
      // imageUrl: http.serverImgUrl + '/pic/top/zhaomu.jpg'
    }    
  }
}