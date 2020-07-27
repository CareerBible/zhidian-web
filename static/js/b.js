const HTTP_QZ= 'https://zhidian.dookbook.info'

var xhr = new XMLHttpRequest()
  xhr.open('GET', HTTP_QZ + '/api/edu/university/disciplines/')
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText)
      if(data.code === 0) {
        var list = document.querySelector('nav ul')
        for(var i=0; i<data.data.length; i++){
          var sub = ''
          for(var j=0; j<data.data[i].children.length; j++){
            var sub2 = ''
            for(var k=0; k<data.data[i].children[j].children.length; k++){
              sub2 += '<li><a href="https://zhidian.dookbook.info/report/content/?code='+data.data[i].children[j].children[k].code+'">'+data.data[i].children[j].children[k].name+'</a></li>'
            }
            sub += '<li><svg viewbox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M328.555136 515.587823l364.265028-364.265028c20.07399-20.049007 20.07399-52.553369 0-72.577393-20.024024-20.049007-52.528386-20.049007-72.577393 0L220.992263 477.971128c-20.024024 20.024024-20.024024 52.528386 0 72.577393 1.578929 1.578929 3.383306 2.83188 5.112534 4.160179 0.300796 0.325779 0.526243 0.701724 0.827039 1.027503l389.877663 389.877663c19.57293 19.57293 51.300418 19.57293 70.873148 0s19.57293-51.300418 0-70.873148L328.555136 515.587823z" fill="#bbb"></path></svg>'+data.data[i].children[j].name+'<ul>'+sub2+'</ul></li>'
          }
          list.innerHTML += '<li><svg viewbox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M328.555136 515.587823l364.265028-364.265028c20.07399-20.049007 20.07399-52.553369 0-72.577393-20.024024-20.049007-52.528386-20.049007-72.577393 0L220.992263 477.971128c-20.024024 20.024024-20.024024 52.528386 0 72.577393 1.578929 1.578929 3.383306 2.83188 5.112534 4.160179 0.300796 0.325779 0.526243 0.701724 0.827039 1.027503l389.877663 389.877663c19.57293 19.57293 51.300418 19.57293 70.873148 0s19.57293-51.300418 0-70.873148L328.555136 515.587823z" fill="#bbb"></path></svg>'+data.data[i].name+'<ul>'+sub+'</ul></li>'
        }

        var nav = document.querySelectorAll('nav > ul > li')
        for(var i=0; i<nav.length;i++){
          nav[i].addEventListener('click', function () {
             if(this.querySelector('ul').style.display != 'block' ) {
              this.querySelector('ul').style.display = 'block'
            } else {
              this.querySelector('ul').style.display = 'none'
            }
          });
        }

        var erji = document.querySelectorAll('nav > ul > li > ul > li')
        for (var j=0; j<erji.length; j++){
          erji[j].addEventListener('click', function () {
            event.stopPropagation()
            if(this.querySelector('ul').style.display != 'block' ) {
              this.querySelector('ul').style.display = 'block'
            } else {
              this.querySelector('ul').style.display = 'none'
            }
          })
        }

        var sanji = document.querySelectorAll('nav > ul > li > ul > li > ul >li')
        for (var i=0; i<sanji.length; i++){
          sanji[i].addEventListener('click', function () {
            event.stopPropagation()
          })
        }

      } else {
        console.debug('fetchSearchHintList: connecting')
      }
    }
  }

var shangyiye = document.querySelector('.shangyiye')

shangyiye.onclick = function () {
  window.history.go(-1); 
}
