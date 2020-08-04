const HTTP_QZ= 'https://zhidian.dookbook.info'

var myChart = echarts.init(document.getElementById('main'));
var myChart1 = echarts.init(document.getElementById('main1'));

var option = {
  title: {
    text: '薪酬',
    left: 'center',
    top: 10,
    textStyle: {
        color: '#37a2da',
        fontWeight: 'normal',
        fontSize: 20
    }
  },
grid: {
  top: '25%',
  left: '3%',
  right: '4%',
  bottom: '3%',
  containLabel: true
},
tooltip : {},
xAxis: {
  data: ['最高值', '最低值', '平均值', '中位值']
},
yAxis: {
  type : 'value',
},
itemStyle: {
  barBorderRadius: [30, 30, 0, 0]
},
series : [
  {
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
    data:[5000, 3000, 4000, 3500],
    label: {
      show: true,
      position: 'top',
      color: 'rgba(0, 0, 0, 0.5)'
    },
    roundCap: true
  }
  ]
}

var option1 = {
  color: ["#ff9f7f", "#67e0e3", "#9ee6b7", "#37a2da"],
  tooltip: {},
  title: {
    text: '学历',
    left: 'center',
    top: 10,
    textStyle: {
        color: '#37a2da',
        fontWeight: 'normal',
        fontSize: 20
    }
  },
  series: [
  {
    name: '学历',
    type: 'pie',
    radius: ['50%','80%'],
    avoidLabelOverlap: false,
    label: {
        show: false,
        position: 'center'
    },
    emphasis: {
      label: {
        show: true,
        fontSize: '30',
        fontWeight: 'bold'
      }
    },
    labelLine: {
      show: false
    },
    data: [
      {value: 335, name: '直接访问'},
      {value: 310, name: '邮件营销'},
      {value: 234, name: '联盟广告'},
      {value: 135, name: '视频广告'}
    ]
  }
]
};
myChart.setOption(option);
myChart1.setOption(option1);



// 搜索框
var search = document.querySelector('.search')
var searchInput = document.querySelector('.search input')

search.onclick = function (evevt) {
  event.stopPropagation()
  this.style.width = 'calc(100% - 60px)'
}

// 搜索
var difference = document.querySelector('.search input[type="text"]')
var xiala = document.querySelector('.xiala')

difference.oninput = debounce(function(e) {
  e.stopPropagation()
  if(this.value == ''){
    xiala.style.display = "none"
  } else {
    xiala.style.display = "block"
  }
  listText(this.value, xiala)
}, 240)

difference.onclick = function () {
  this.placeholder = ''
  if(this.value == ''){
    xiala.style.display = "none"
  } else {
    xiala.style.display = "block"
  }
  listText(this.value, xiala)
}

document.body.onclick = function () {
  search.style.width = '160px'
  xiala.style.display = 'none'
}

// 筛选
var filter = document.querySelectorAll('.filter li')
var unfold = document.querySelectorAll('.unfold')

// 展开
for (var i=0; i<unfold.length; i++){
  unfold[i].index = i;
  unfold[i].onclick = function () {
    if (this.querySelector('em').innerHTML == '展开') {
      for (var j = 0; j< unfold.length; j++) {
        unfold[j].querySelector('em').innerHTML = '展开'
        filter[j].style.height='42px'
        unfold[j].querySelector('svg').style.animation = ''
      }
      this.querySelector('em').innerHTML = '收起'
      this.querySelector('svg').style.animation = '1s rotating'
      filter[this.index].style.height='auto'
    } else {
      this.querySelector('svg').style.animation = '1s rotating'
      this.querySelector('em').innerHTML = '展开'
      filter[this.index].style.height='42px'
    }
  }
}

// 年限 薪酬 行业
for(var i=0; i<filter.length; i++){
  var spanbtn = filter[i].querySelectorAll('p span')
  for(var j=0; j<spanbtn.length; j++){
    spanbtn[j].onclick = function () {
      var current = this.parentElement.children
      for(var k=0; k<current.length; k++){
        current[k].classList.remove('active')
      }
      this.classList.add('active')
    }
  }
}

/**
 * 获取搜索列表
 */
function listText(value, box){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', HTTP_QZ + '/api/edu/university/disciplines/?q=' + value)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code === 0) {
        if(data.hints == null || data.hints.length === 0){
          box.innerHTML = '<ul><li><a href="#" class="search-results">暂无搜索结果</a></li></ul>'
        } else {
          box.innerHTML = ''
          for(var i=0;i<data.hints.length;i++){
            box.innerHTML += '<ul><li><a href="https://zhidian.dookbook.info/report/content/?code='+data.hints[i].code+'">'+data.hints[i].name+'</a></li></ul>'
          }
        }
      } else {
        alert(data.errmsg)
      }
    } else {
      console.debug('fetchSearchHintList: connecting')
    }
  }
}

/**
 * 函数防抖，debounce
 * 基本思路就是把多个信号合并为一个信号
 * 
 * @param {*} func 
 * @param {*} delay 
 */
function debounce(func, delay) {
  var timer = null
  return function(e) {
      console.log("clear", timer, e.target.value)
      var context = this, args = arguments
      clearTimeout(timer)

      console.log("new event", timer, e.target.value)
      timer = setTimeout(function(){
        func.apply(context, args)
      }, delay)
  }
}