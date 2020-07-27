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
      for(var k=0;k<current.length;k++){
        current[k].className = ''
      }
      this.className='active'
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

var difference = document.querySelector('section input[type="text"]')

if (difference != null) {
  difference.onfocus = function () {
    this.value = ''
  }

  difference.onblur = function () {
    this.value = this.name
  }
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
