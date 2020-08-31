 //数据
 let data = {
    domain: 'https://zhidian.dookbook.info',  //域名
    isVip: false, //是否为会员
    showSearch: false,
    searchTxt: '', //搜索框文字
    area: '全国',
    titleName: '哲学',
    districtId: 0,//获取被选中的值，默认选中是0（全国）
    areaList: [],
    search: 0,
    cityList:[],
    professList:[
      {
        id: '',
        name: '',
        code: ''
      }
    ],
    showChart: false,  //是否显示对比图表
    showLogin: true,   //显示“加载中”
    showTxt: false, //显示“诗与远方”
    showLoading: false,   //显示“正在加载” 
    showNoData: false,   //显示“没有数据”
    showProvince: false,  //显示省
    showCity: false,  //显示市
    showMask: false,
    showPop: false,
    showSuccess: false,
    jobCode: '010101',
    page: 0,  //页码
    limit: '5', //每页显示多少条数据
    professionAvg: 0,
    container: null,// 绑定能被监听滚动的元素
    domHeight: 0,// 内容可视区的高度
    professionSalaryList: [
      {
        workAge: '1年以下',
        avgSalary: 1
      },
      {
        workAge: '1-3年',
        avgSalary: 1
      },{
        workAge: '3-5年',
        avgSalary: 1
      },
      {
        workAge: '5-10年',
        avgSalary: 1
      },
      {
        workAge: '10年以上',
        avgSalary: 1
      }
    ],
    jobList: [],
    totalPage: 0,  //总页数
    Dom: '',
    clientH: '',
    note: '',
    salaryChart: null,
    dataArr:[],
    profession: 1,
    num: 0,
    chartOption: {
      color: ['#516b91','#59c4e6','#edafda','#93b7e3','#a5e7f0'],
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: []
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
          axisLine:{
            lineStyle:{
                color:'#888'
            }
          } 
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value} k'
          },
          axisLine:{
            lineStyle:{
                color:'#888'
            }
          } 
      },
      series: []
    }
}

//Vm实例
var vm = new Vue({
    el: "#salaryAnalysis",    //挂载元素
    data: data,
    mounted: function(){
        this.$nextTick(function() { 
          this.Dom = document.getElementById('salaryAnalysis');//获取页面DOM的id
          this.clientH = document.documentElement.clientHeight;
          // this.userId = '56ed7379da47434292deeb8d472ebb0c';
          this.userId = window.localStorage.getItem('uid');
          if(!this.userId){
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb3417997b07e0f2e&redirect_uri=https%3A%2F%2Fzhidian.dookbook.info%2Fwx_auth.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
          }else{
            axios.defaults.headers.common["uid"] = this.userId;
            window.document.title = this.titleName; //初始页面title
            this.getProfession('010101', false, '哲学');//初始"哲学"数据
            this.salaryChart = echarts.init(document.getElementById('chart')); 
          }
        })
    },
    methods: {  //  放方法函数
        getAreaOption: function(){  //获取地区选项
            var url = this.domain + '/api/district/list';
            const that = this;
            axios.get(url).then(function(res) {
                var resData = res.data;
                if(resData.code === 200){
                    that.showProvince = true;
                    that.areaList = resData.data.list;
                    
                    that.areaList.unshift({
                      name: '全国',
                      listChild: [],
                      id: 0
                    });
                    for(var i = 0; i<that.areaList.length; i++){
                      that.$set(that.areaList[i], 'show', false);
                    }
                }else if(resData.code === 105){
                  that.showMask = true;
                  that.showPop = true;
                }
            });
        },
        selecteProvince: function(item){ //选中省
          if(item.id==0){ this.clearChart();}
          if(item.listChild.length==0){
            this.showProvince = false;
            this.showCity = false;
            this.districtId = '';
            this.area = '全国';
            this.getProfession(this.jobCode, false, '');
            return;
          }
          for(var i = 0; i<this.areaList.length; i++){
            this.$set(this.areaList[i], 'show', false);
          }
          item.show = true;
          this.showCity = item.show;
          this.cityList = item.listChild;
          for(var i = 0; i < this.cityList.length; i++){
            this.cityList.show = false;
          }
        },
        selectCity: function(item){//选中市
          this.showProvince = false;
          this.showCity = false;
          this.districtId = item.id;
          this.area = item.name;
          window.document.title = this.titleName;
          this.clearChart();
          this.getProfession(this.jobCode, false, '')
        },
        clearChart: debounce(function(){ //清空图表数据并关闭
          for(var i = 0; i < this.jobList.length; i++){
            this.$set(this.jobList[i], 'compareBtn',true);
          }
          this.chartOption.legend.data = [];
          this.chartOption.series = [];
          this.showChart = false;
          this.removeHeight();
        },50),
        getSearchTxt: debounce(function(){ //按照专业名称搜索文字获取专业列表
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(!reg.test(this.searchTxt)){    //非中文
               return;
            }
            var url = this.domain + '/api/discipline/list';
            const that = this;
            if(this.searchTxt){
                var params = {'search': this.searchTxt};
                axios.get(url,{
                    params:params
                }).then(function(res) {
                    var resData = res.data;
                    if(resData.code === 200){
                        that.professList = resData.data.list;
                        that.professList.length == 0 ? that.showSearch = false:that.showSearch = true;
                    }else if(resData.code === 105){
                      that.showMask = true;
                      that.showPop = true;
                    }
                });
            }
        },50),
        getProfession: function(code, onOff, name){ //选择专业获取行业数据
            this.searchTxt = '';//搜索完成情况搜索框内容
            this.jobCode = code;//职业code获取
            var url = this.domain + '/api/statistical/listDiscipline';
            const that = this;
            var params = {
              disciplineCode: this.jobCode,
              limit: this.limit,
              page: this.page
            };
            if(this.districtId != 0){//判断是否存地区id
               params.districtId = this.districtId; 
            }
            if(name!=''){//判断title
              that.titleName = name;
              window.document.title = that.titleName; 
            }
            axios.get(url,{params: params}).then(function(res) {
                var resData = res.data;
                that.isVip = res.headers.isVip; //是否为会员
                if(resData.code === 200){
                  if(onOff && !that.isVip){ //onOff为true:搜索来的; isVip为false:非会员
                    that.search+=1;
                    if(that.search == 0){ //第一次搜索成功，十秒后弹出支付窗口
                      var time = null; 
                      time = setTimeout(function(){
                          that.showMask = true;
                          that.showPop = true;
                      }, 10000);
                    }
                  }
                  that.showSearch = false;//关闭专业列表
                  that.professionAvg = (resData.data.disciplineAvgSalary * 1000);//行业平均值
                  var arr = resData.data.listDisciplineAvgSalaryWorkingYears;
                  if(resData.data.disciplineAvgSalary === 0) {//行业平均值为空显示没有数据
                    that.showNoData = true; 
                    that.showTxt = false;
                    that.showLogin = false;
                    that.jobList = [];
                    return;
                  }else{
                    that.showNoData = false;
                  }
                  for(var i = 0; i < arr.length; i++){//年限区间内行业平均水平数组
                    that.professionSalaryList[i].avgSalary = arr[i].disciplineavgsalaryworkingyears.toFixed(1);
                  }

                  that.getJodData(true, true);//获取行业相关职业数据
                }else if(resData.code === 105){//未支付，非会员
                  that.showMask = true;
                  that.showPop = true;
                }
            });
        },
        getJodData: function(isSearch, init){ //获取岗位数据 
            var url = this.domain + '/api/statistical/listPage';
            const that = this;
            if(init){this.page=0;}
            var params = {
              disciplineCode: this.jobCode,
              limit: this.limit,
              page: this.page
            };
            if(this.districtId != 0){
               params.districtId = this.districtId; 
            }
            axios.get(url,{params: params}).then(function(res) {
                var resData = res.data;
                if(resData.code === 200){
                    that.totalPage = Math.ceil(resData.data.totaCount/that.limit)-1;//总页数
                    var arr = resData.data.listPositionAvgSalary;
                    if(arr.length == 0){//职业平均薪资数组为空则显示暂无数据
                        that.showNoData = true;
                        that.jobList = [];
                        that.note = "暂无数据";
                        that.showTxt = false;
                    }else{
                        that.showNoData = false;
                        if(isSearch){   //是否搜索来的
                            that.jobList = [];
                        }
                        for(var i = 0; i < arr.length; i++){
                            that.$set(arr[i], 'compareBtn', true);//每一个职位添加对比/取消属性
                            arr[i].jobSalary = [{minSalary:0,maxSalary:1,workAge:"1年以下"},{minSalary:0,maxSalary:1,workAge:"1-3年"},{minSalary:0,maxSalary:1,workAge:"3-5年"},{minSalary:0,maxSalary:1,workAge:"5-10年"},{minSalary:0,maxSalary:1,workAge:"10年以上"}];
                            var list = arr[i].listPositionAvgSalaryScope;
                            for(var j = 0; j < list.length; j++){
                              var curAge = list[j].workingyears;
                              switch(true){
                                case curAge=='1年以下':
                                    that.addNumData(arr[i], 0, list[j].positionavgsalarymin,list[j].positionavgsalarymax);
                                  break;
                                case curAge=='1-3年':
                                    that.addNumData(arr[i], 1, list[j].positionavgsalarymin,list[j].positionavgsalarymax);
                                  break;
                                case curAge=='3-5年':
                                    that.addNumData(arr[i], 2, list[j].positionavgsalarymin,list[j].positionavgsalarymax);
                                  break;
                                case curAge=='5-10年':
                                    that.addNumData(arr[i], 3, list[j].positionavgsalarymin,list[j].positionavgsalarymax);
                                  break;
                                case curAge=='10年以上':
                                    that.addNumData(arr[i], 4, list[j].positionavgsalarymin,list[j].positionavgsalarymax);
                                  break;
                              }
                            }
                            that.jobList.push(arr[i]);
                            that.getWholeData();
                        }
                    }
                }else if(resData.code === 105){
                  that.showMask = true;
                  that.showPop = true;
                } else{
                  that.showNoData = true;
                  that.note = "访问失败";
                }
            });
        },
        addNumData: function(obj,index,min,max){//对比塞数据
          obj.jobSalary[index].minSalary = parseFloat(min).toFixed(1);
          obj.jobSalary[index].maxSalary = parseFloat(max).toFixed(1);
        },
        getWholeData: function(){ //拼接得到完整职业数据
          for(var i = 0; i < this.jobList.length; i++){
            var arr = this.jobList[i].jobSalary;
            for(var j = 0; j < arr.length; j++){
              if(j != 0 && arr[j].minSalary == 0 && arr[j].maxSalary == 1){
                this.jobList[i].jobSalary[j].minSalary = arr[j-1].minSalary;
                this.jobList[i].jobSalary[j].maxSalary = arr[j-1].maxSalary;
              }
            }
          }
        },
        turnPage: function(){ //再加载一页
          if(this.page == this.totalPage){ //最后一页
            this.showLogin = false;
            this.showTxt = true;
            return;
          }else {
            this.showLogin = true;
            this.showTxt = false;
            this.page++;
            setTimeout(this.getJodData(false, false),500);
          }
        },
        viewmore: throttle(function() {  //加载更多
            var domH = this.clientH;
            var domScrollH = this.Dom.scrollHeight;
            var domScrollTop = Math.ceil(this.Dom.scrollTop);
            var scrollArea = parseInt(domScrollH - domH);
            var toTop = document.querySelector('.top');
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
            // this.turnPage();//浏览器测试时打开
            this.showLogin = true;
            if(isAndroid && domScrollTop == (scrollArea-15)){
              this.showLogin = true;
              this.turnPage();
            }else if(isiOS && domScrollTop == scrollArea){
              this.showLogin = true;
              this.turnPage();
            }else {
              this.showLogin = false;
            }
            
            if(domScrollTop < 600){
              toTop.style.display = 'none';
            }else{
              toTop.style.display = 'block';
            }
            if(domScrollTop > 20){
              document.querySelector('#profession').className = 'box-profession'
            } else {
              document.querySelector('#profession').className = ''
            }
        },50),
        CompareOrNot: debounce(function(item){  //对比/取消按钮
          console.log(222222)
          if(item.compareBtn){ //加对比
            if(this.chartOption.legend.data.length == 6){
                alert('最多只能对比五个职位');
                return;
            }
            this.addRecord(item);
            item.compareBtn = false;
          }else {//取消
            this.removeRecord(item);
            item.compareBtn = true;
          }
        },200),
        addHeight: function(){  //增加margin-top
          var position = document.querySelector(".zhiwei");
          position.style.marginTop = '836px';
        },
        removeHeight: function(){//删除margin-top
          var position = document.querySelector(".zhiwei");
          position.style.marginTop = '470px';
        },
        addRecord: function(item){ //添加图表数据
            var avg = item.jobSalary,arr = this.chartOption.series;
            this.dataArr = [];
            for(var i = 0; i < avg.length; i++){
              var num = parseFloat((parseFloat(avg[i].minSalary) + parseFloat(avg[i].maxSalary))/2).toFixed(1);
              this.dataArr.push(num);
            }
            this.chartOption.legend.data.push(item.name);  //职业名称
            if(arr.length == 0){
                this.addProfessionAvg();    //添加行业平均薪资
                this.addFn(item, this.dataArr);
                this.addHeight();
                this.showChart = true;
                return;
            }
            for(var i = 0; i < arr.length; i++){ //薪资数据
              if(arr[i].name == ''){
                this.chartOption.series[i] = {
                  name: item.name,
                  data: this.dataArr,
                  type: 'line'
                }
                return;
              }
            }
            this.addFn(item, this.dataArr);
        },
        addProfessionAvg: function(){   //对比图添加行业平均数据
            var arr = this.professionSalaryList, salaryLi = [];
            for(var i = 0; i < arr.length; i++){
                salaryLi.push(arr[i].avgSalary);
            }
            this.chartOption.legend.data.push('专业平均');
            this.chartOption.series.push({
                name: '专业平均',
                data: salaryLi,
                type: 'line'
            });
        },
        addFn: function(item,arr){
          this.chartOption.series.push({
            name: item.name,
            data: arr,
            type: 'line'
          });
        },
        removeRecord: function(item){ //删除对应数据
          var arr = this.chartOption.legend.data,
              index = arr.indexOf(item.name);
          this.chartOption.legend.data.splice(index, 1);//去掉图表对应名称
          this.chartOption.series[index] = {
              name: '',
              data: [],
              type: 'line'
          }
          if(this.chartOption.legend.data.length == 1){
              this.clearChart();
          }
        },
        backTop: throttle(function(){  //回到顶部
          var time = null , that = this;
          var scrollTop = that.Dom.scrollTop;
         
          time = setInterval(function(){
            if(that.Dom.scrollTop === 0){
              clearInterval(time);
            }else{
              that.Dom.scrollTop -= 1300;
            }
          }, 16);
        },50),
        closePop: function(){   //关闭支付弹窗
            this.showMask = false;
            this.showPop = false;
            this.showSuccess = false;
            //初始"哲学"数据
            this.getProfession('010101', false, '哲学'); 
            this.titleName = '哲学';
            document.activeElement.blur();
            if(this.showChart){//图表关闭
                this.clearChart();
            }
        },
        payFor: function(){ //点击支付
            var url = this.domain + '/api/pay/initPay';
            const that = this;
            var data = {
              userId: this.userId,
              tradeType: 'JSAPI'
            }
            axios.post(url,data).then(function(res) {
                var resData = res.data;
                if(resData.code === 200){
                  var payForData = resData.data;
                  that.payForToWx(payForData);
                }
            })
        },
        payForToWx: function(data){//微信支付
          const that = this;
          WeixinJSBridge.invoke('getBrandWCPayRequest', {
              "appId": data.appId,
              "timeStamp": data.timeStamp,
              "nonceStr": data.nonceStr,
              "package": data.packageStr,
              "signType": data.signType,
              "paySign": data.paySign 
          },function(res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                  that.showMask = true;
                  that.showSuccess = true;
              }else {
                  that.closePop();
              }
          });
          if (typeof WeixinJSBridge == "undefined") {
              if (document.addEventListener) {
                  document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
              } else if (document.attachEvent) {
                  document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                  document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
              }
          } else {
              that.payForToWx();
          }
        },
        closeSuccessPop: function(){  //关闭支付成功
          this.showMask = false;
          this.showSuccess = false;
          this.showPop = false;
          //初始"哲学"数据
          this.getProfession('010101', false, '哲学'); 
          this.titleName = '哲学';
        }
    },
    watch: {
      'chartOption': {
        handler: function(newVal, oldVal) {
          this.num++;
          if (this.salaryChart) {
            if (newVal) {
              this.salaryChart.setOption(newVal,true);
            } else {
              this.salaryChart.setOption(oldVal,true);
            }
          } else {
            this.init();
          }
        },
        deep: true //对象内部属性的监听，关键。
      }
    }
})