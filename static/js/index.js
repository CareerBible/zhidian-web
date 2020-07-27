const HTTP_QZ= 'https://zhidian.dookbook.info'

var text = document.querySelector('.text')
var xiala = document.querySelector('.xiala')

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
        console.debug('fetchSearchHintList: connecting')
      }
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

text.oninput = debounce(function(e) {
  console.log('input starts ...')
  e.stopPropagation()
  if(this.value == ''){
    xiala.style.display = "none"
  } else {
    xiala.style.display = "block"
  }
  listText(this.value, xiala)
}, 300)

text.onclick = function (event) {
  event.stopPropagation()
  if(this.value == '') {
    xiala.style.display = "none"
  } else {
    xiala.style.display = "block"
    listText(this.value, xiala)
  }
}

document.body.onclick = function () {
  xiala.style.display = "none"
}

for (var i=0; i<xiala.querySelectorAll('p').length; i++){
  var pText = xiala.querySelectorAll('p')
  pText[i].index = i
  pText[i].onclick = function () {
    text.value = pText[this.index].innerHTML
    xiala.style.display = "none"
  }
}
