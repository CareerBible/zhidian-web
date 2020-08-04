var profession = document.querySelectorAll('input[name="profession"]')
var career = document.querySelectorAll('input[name="career"]')
var employment = document.querySelectorAll('input[name="employment"]')
var age = document.querySelectorAll('input[name="age"]')
var treatment = document.querySelectorAll('input[name="treatment"]')
var submit = document.querySelector('input[type="submit"]')
var professionNum = 0
var careerNum = 0
var employmentNum = 0
var ageChecked = null
var treatmentChecked = null

// 1.您就读的大学名称
document.querySelector('#university-text').onclick = function () {
  document.querySelector('#university-error').style.display = 'none'
}

// 2.您就读的年级
for(var i=0; i<age.length; i++){
  age[i].index = i
  age[i].onclick = function () {
    for (var j=0; j<age.length; j++) {
      age[j].parentElement.classList.remove('checked')
    }
    age[this.index].parentElement.classList.add('checked')
    ageChecked = age[this.index].checked
    if(ageChecked){
      document.querySelector('#age-error').style.display = 'none'
    }
  }
}

// 3.您的专业是
document.querySelector('#professional-text').onclick = function () {
  document.querySelector('#professional-error').style.display = 'none'
}

// 4.您选择这个专业的原因是
for(var i=0; i<profession.length; i++){
  profession[i].onclick = function () {
    if(this.value === '其他' && this.checked == true) {
      document.querySelector('#profession-text').style.display = 'block'
      document.querySelector('#profession-text').required = 'required'
    } else if(this.value === '其他' && this.checked == false){
      document.querySelector('#profession-text').style.display = 'none'
      document.querySelector('#profession-text').required = ''
    }

    if(this.parentElement.classList.toggle('checked')) {
      this.parentElement.classList.add('checked')
      professionNum++
    } else {
      this.parentElement.classList.remove('checked')
      professionNum--
    }

    if(professionNum !== 0){
      document.querySelector('#profession-error').style.display = 'none'
    }
    if(professionNum == 3) {
      for(var j=0; j<profession.length; j++){
        if(profession[j].checked == false) {
          profession[j].disabled = 'disabled'
          profession[j].parentElement.classList.add('disabled')
        }
      }
    } else {
      for(var j=0; j<profession.length; j++){
        if(profession[j].checked == false) {
          profession[j].disabled = ''
          profession[j].parentElement.classList.remove('disabled')
        }
      }
    }
  }

}

document.querySelector('#profession-text').onclick = function() {
  document.querySelector('#profession-text-error').style.display = 'none'
}

// 5.择业时，您考量最多的是
for(var i=0; i<career.length; i++){
  career[i].onclick = function () {
    if(this.value === '其他' && this.checked == true) {
      document.querySelector('#career-text').style.display = 'block'
      document.querySelector('#career-text').required = 'required'
    } else if(this.value === '其他' && this.checked == false){
      document.querySelector('#career-text').style.display = 'none'
      document.querySelector('#career-text').required = ''
    }
    if(this.parentElement.classList.toggle('checked')) {
      this.parentElement.classList.add('checked')
      careerNum++
    } else {
      this.parentElement.classList.remove('checked')
      careerNum--
    }
    if(careerNum !== 0){
      document.querySelector('#career-error').style.display = 'none'
    }
    if(careerNum == 3) {
      for(var j=0; j<career.length; j++){
        if(career[j].checked == false) {
          career[j].disabled = 'disabled'
          career[j].parentElement.classList.add('disabled')
        }
      }
    } else {
      for(var j=0; j<career.length; j++){
        if(career[j].checked == false) {
          career[j].disabled = ''
          career[j].parentElement.classList.remove('disabled')
        }
      }
    }
  }
}

document.querySelector('#career-text').onclick = function() {
  document.querySelector('#career-text-error').style.display = 'none'
}

// 6.您了解自己专业匹配的市场岗位和未来薪资待遇吗？
for(var i=0; i<treatment.length; i++){
  treatment[i].index = i
  treatment[i].onclick = function () {
    if(this.value == '其他' && this.checked == true) {
      document.querySelector('#treatment-text').style.display = 'block'
      document.querySelector('#treatment-text').required = 'required'
    } else {
      document.querySelector('#treatment-text').style.display = 'none'
      document.querySelector('#treatment-text').required = ''
    }
    for (var j=0; j<treatment.length; j++) {
      treatment[j].parentElement.classList.remove('checked')
    }
    treatment[this.index].parentElement.classList.add('checked')
    console.log(treatment[this.index].checked)
    treatmentChecked = treatment[this.index].checked
    if(treatmentChecked){
      document.querySelector('#treatment-error').style.display = 'none'
    }
  }
}

document.querySelector('#treatment-text').onclick = function() {
  document.querySelector('#treatment-text-error').style.display = 'none'
}

// 7.曾经从哪些渠道了解过专业与就业相关的信息
for(var i=0; i<employment.length; i++){
  employment[i].onclick = function () {
    if(this.value === '其他' && this.checked == true) {
      document.querySelector('#employment-text').style.display = 'block'
      document.querySelector('#employment-text').required = 'required'
    } else if(this.value === '其他' && this.checked == false){
      document.querySelector('#employment-text').style.display = 'none'
      document.querySelector('#employment-text').required = ''
    }
    if(this.parentElement.classList.toggle('checked')) {
      this.parentElement.classList.add('checked')
      employmentNum++
    } else {
      this.parentElement.classList.remove('disabled')
      employmentNum--
    }
    if(employmentNum !== 0){
      document.querySelector('#employment-error').style.display = 'none'
    }
  }
}

document.querySelector('#employment-text').onclick = function() {
  document.querySelector('#employment-text-error').style.display = 'none'
}


submit.onclick = function(){
  if(document.querySelector('#university-text').value == ''){
    document.querySelector('#university-error').style.display = 'block'
    window.location.href = '#university'
    return false
  } else if(ageChecked === null){
    document.querySelector('#age-error').style.display = 'block'
    window.location.href = '#age'
    return false
  }else if(document.querySelector('#professional-text').value == ''){
    document.querySelector('#professional-error').style.display = 'block'
    window.location.href = '#professional'
    return false
  }else if(professionNum === 0){
    window.location.href = '#profession'
    document.querySelector('#profession-error').style.display = 'block'
    return false
  }else if(document.querySelector('#profession-text').value == '' && document.querySelector('#profession-text').required == true){
    window.location.href = '#profession'
    document.querySelector('#profession-text-error').style.display = 'block'
    return false
  }else if(careerNum === 0){
    window.location.href = '#career'
    document.querySelector('#career-error').style.display = 'block'
    return false
  }else if(document.querySelector('#career-text').value == '' && document.querySelector('#career-text').required == true){
    window.location.href = '#career'
    document.querySelector('#career-text-error').style.display = 'block'
    return false
  }else if(treatmentChecked === null){
    document.querySelector('#treatment-error').style.display = 'block'
    window.location.href = '#treatment'
    return false
  }else if(document.querySelector('#treatment-text').value == '' && document.querySelector('#treatment-text').required == true){
    window.location.href = '#treatment'
    document.querySelector('#treatment-text-error').style.display = 'block'
    return false
  }else if(employmentNum === 0){
    window.location.href = '#employment'
    document.querySelector('#employment-error').style.display = 'block'
    return false
  }else if(document.querySelector('#employment-text').value == '' && document.querySelector('#employment-text').required == true){
    window.location.href = '#employment'
    document.querySelector('#employment-text-error').style.display = 'block'
    return false
  }
}