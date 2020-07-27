const HTTP_QZ= 'https://zhidian.dookbook.info'
var discipline_code = getQueryVariable('code')
var filter_page = 0
var filter_city_rank = ''

/**
  * 获取URL查询参数
  * @param {String} param URL parameter name
  */
 function getQueryVariable (param) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === param) { return pair[1] }
  }
  return false
}

//切换
var tab = document.querySelectorAll('.tab li')
var ranking = document.querySelectorAll('.ranking');
for (var i = 0; i < tab.length; i++){
  tab[i].index = i;
  tab[i].onclick = function () {
    for (var j = 0; j< tab.length; j++) {
      tab[j].className=''
    }
    for (var j=0; j<ranking.length; j++) { 
      ranking[j].style.display='none'
    }
    
    tab[this.index].className='active'
    ranking[this.index].style.display='block'
  }
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
      }
      this.querySelector('em').innerHTML = '收起'
      filter[this.index].style.height='auto'
    } else {
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
      if(this.classList.contains('filter_city_rank')){
        if(this.textContent === '不限'){
          filter_city_rank = ''
        } else {
          filter_city_rank = this.textContent
        }
      }
      console.log(filter_city_rank)

      getPositionList()
    }
  }
}

// 回到顶部
var backTop = document.querySelector(".top")
window.onscroll = function (){
  var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
  if(scrollTop > 600){
    backTop.style.display = "block"
  } else {
    backTop.style.display = "none"
  }
}

var  time = null;
backTop.addEventListener("click", function(){
  time = setInterval(function(){
    var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
    if(scrollTop === 0){
      clearInterval(time);
    }
    document.documentElement.scrollTop = scrollTop - 100
    document.body.scrollTop = scrollTop - 100
  }, 16);
})

// 学校信息
var school = document.querySelectorAll('.school li')
for(var i=0; i<school.length; i++){
  school[i].onclick = function () {
    if (this.querySelector('.info section') != null) {
      if(this.querySelector('.info section').style.display != 'block'){
        this.querySelector('.info section').style.display = 'block'
      } else {
        this.querySelector('.info section').style.display = 'none'
      }
    }
  }
}

var fenshu =  document.querySelectorAll('.fenshu')

for (var i=0; i<fenshu.length; i++){
  fenshu[i].onclick = function (event) {
    event.stopPropagation()

  }
}

function listText(value, box){
  var xhr = new XMLHttpRequest()
  xhr.open('GET', HTTP_QZ + '/api/edu/university/disciplines/?q=' + value)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code === 0) {
        if(data.hints == null || data.hints.length === 0){
          box.innerHTML = '<li><a href="#" class="search-results">暂无搜索结果</a></li>'
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

/**
 * 节流，throttle
 * 强制函数以固定的速率执行，比较适合应用于动画相关的场景
 * 如：resize, touchmove, mousemove, scroll
 * 
 * @param {*} func 
 * @param {*} threshhold 
 */
function throttle(func, threshhold) {
  var timer = null;
  var start = new Date;
  var threshhold = threshhold || 160

  return function () {
    var context = this, args = arguments, curr = new Date() - 0
    clearTimeout(timer)  //总是干掉事件回调

    if(curr - start >= threshhold){ 
      console.log("now", curr, curr - start)//注意这里相减的结果，都差不多是160左右
      func.apply(context, args) //只执行一部分方法，这些方法是在某个时间段内执行一次
      start = curr
    }else{
      //让方法在脱离事件后也能执行一次
      timer = setTimeout(function(){
        func.apply(context, args) 
      }, threshhold);
    }
  }
}


var difference = document.querySelector('section input[type="text"]')
var cXial = document.querySelector('.c-xial')
difference.oninput = debounce(function(e) {
  if(this.value == ''){
    cXial.style.display = "none"
  } else {
    cXial.style.display = "block"
  }
  listText(this.value, cXial)
}, 240)

difference.onclick = function (event) {
  event.stopPropagation()
  if(this.value == '') {
    cXial.style.display = "none"
  } else {
    cXial.style.display = "block"
    listText(this.value, cXial)
  }
}

document.body.onclick = function () {
  cXial.style.display = "none"
}


var qiehua = document.querySelectorAll('.qiehua li')
var record = document.querySelectorAll('.record');
for (var i = 0; i < qiehua.length; i++){
  qiehua[i].index = i;
  qiehua[i].onclick = function () {
    for (var j = 0; j< qiehua.length; j++) {
      qiehua[j].className=''
    }
    for (var i=0; i<record.length; i++) { 
      record[i].style.display='none'
    }
    
    qiehua[this.index].className='active'
    record[this.index].style.display='block'
  }
}


var shenfen = document.querySelector('.shenfen')
var close1 = document.querySelector('.close1')
var province = document.querySelectorAll('.province')

for (var i=0; i<province.length; i++) {
  province[i].onclick = function () {
    shenfen.style.display = "block"
  }
}

close1.onclick = function () {
  shenfen.style.display = "none"
}


for (var i=0; i<shenfen.querySelectorAll('ul li').length; i++) {
  shenfen.querySelectorAll('ul li')[i].index = i
  shenfen.querySelectorAll('ul li')[i].onclick = function () {
    for(var j=0; j<shenfen.querySelectorAll('ul li').length; j++){
      shenfen.querySelectorAll('ul li')[j].style.color = '#333'
      shenfen.querySelectorAll('ul li')[j].style.fontWeight='normal'
    }
    shenfen.querySelectorAll('ul li')[this.index].style.color='#18366a'
    shenfen.querySelectorAll('ul li')[this.index].style.fontWeight='bold'
  }
}

document.querySelector('.shangyiye').onclick = function () {
  window.history.go(-1); 
}


var tabTbody = document.querySelector('table tbody')
getPositionList()



/**
 * 获取职位列表
 */
function getPositionList() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', HTTP_QZ + '/api/report/positions/?discipline_code='+discipline_code+'&city_rank='+filter_city_rank+'&page='+filter_page)
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      console.log(data)
      if(data.code === 0) {
        if(filter_page === 0){
          tabTbody.innerHTML = ''
        }
        for(var i=0; i<data.data.length; i++){
          tabTbody.innerHTML += '<tr><td>'+data.data[i].name+'</td><td>'+data.data[i].industry+'</td><td>'+data.data[i].required+'</td><td>'+data.data[i].salary+'</td></tr>'
        }
      } else {
        alert(data.errmsg)
      }
    }else {
      console.debug('获取职位列表: 正在连接中')
    }
  }
}
