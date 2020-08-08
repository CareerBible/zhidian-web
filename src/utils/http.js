import Taro from '@tarojs/taro'
import { AtMessage } from 'taro-ui'

// const env = 'develop'
const env = 'production'

const server_url = env === 'develop' ? 'https://zhidian.dookbook.info' : 'https://zhidian.dookbook.info'

 
function getHeader() {
  if (Taro.getStorageSync('token')) {
    return {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + Taro.getStorageSync('token')
    }
  }
  return {
    'content-type': 'application/json'
  }
}
 
function showErrToast(err, type) {
  Taro.atMessage({
    'message': err,
    'type': type,
  })
}
 
function getPromise(url, data, method, methodKey) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${server_url}${url}`,
      header: getHeader(),
      method: method,
      [methodKey]: data,
      success: function(res) {
        if (res.data) {
          // if (res.data.code != 0) {
          //   showErrToast(res.data.msg, 'error')
          //   if ([100005, 100006].indexOf(res.data.code) != -1) {
          //     // Taro.clearStorageSync() // 清除全部缓存
          //     Taro.removeStorageSync('loginInfo')
          //     Taro.removeStorageSync('token')
              
          //     setTimeout(() => {
          //       Taro.reLaunch({
          //         url: '/pages/home/home',
          //       })
          //     }, 1500);
          //   } else if ([100026].indexOf(res.data.code) != -1) {
          //     setTimeout(() => {
          //       Taro.navigateBack({
          //         delta: 1 // 返回上一级页面。
          //       });
          //     }, 1500);
          //   }
          // }
          resolve(res.data)
        } else {
          reject(res.data.msg)
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  }).catch(function(err) {
    showErrToast(err, 'error')
  })
}
 
const http = {
  serverUrl: server_url,
  
  getData: function(url, data) {
    return getPromise(url, data, 'GET', 'data')
  },
  getParams: function(url, data) {
    return getPromise(url, data, 'GET', 'params')
  },
  postData: function(url, data) {
    return getPromise(url, data, 'POST', 'data')
  },
  postParams: function(url, data) {
    return getPromise(url, data, 'POST', 'params')
  },
  putData: function(url, data) {
    return getPromise(url, data, 'PUT', 'data')
  },
  putParams: function(url, data) {
    return getPromise(url, data, 'PUT', 'params')
  }
}
 
export default http