 //数据
 let data = {
    isVip: false, //是否为会员
    showSearch: false,
    searchTxt: '', //搜索框文字
    area: '全国',
    titleName: '哲学',
    districtId: 0,//获取被选中的值，默认选中是0（全国）
    areaList: [],
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
    showPayPop: false,//显示支付弹窗
    onOff: false, //是否搜索来的
    showSuccess: false,
    jobId: '18',
    page: 0,  //页码
    limit: '5', //每页显示多少条数据
    professionAvg: 0,
    clientH:'',
    container: null,// 绑定能被监听滚动的元素
    domHeight: 0,// 内容可视区的高度
    professionSalaryList: [
      {
        workAge: '1年以下',
        avgSalary: ''
      },
      {
        workAge: '1-3年',
        avgSalary: ''
      },{
        workAge: '3-5年',
        avgSalary: ''
      },
      {
        workAge: '5-10年',
        avgSalary: ''
      },
      {
        workAge: '10年以上',
        avgSalary: ''
      }
    ],
    jobList: [],
    totalPage: 0,  //总页数
    Dom: '',
    showToTop: false,//显示置顶按钮
    note: '',
    salaryChart: null,
    dataArr:[],
    profession: 1,
    citySalaryRatio: [],
    yearSalaryRatio:[],
    ratio: 1,
    referreId: '',
    chartOption: {
      color: ['#e53698','#f5e8c8','#3589fc','#22c3aa','#e6b600','#516b91'],
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: [],
          textStyle:{fontSize: 16}
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
                color:'#aaa',
                width: 3,
            }
          },
          nameTextStyle: {
            fontSize: 20
          }
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value} k'
          },
          axisLine:{
            lineStyle:{
                color:'#aaa',
                width: 3
            }
          },
          nameTextStyle: {
            fontSize: 20
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
          this.clientH = document.documentElement.clientHeight;
          this.Dom = document.getElementById('salaryAnalysis');//获取页面DOM的id
          this.referreId = getQueryVariable('referreId');//获取推广id
          if(this.referreId != ''){window.sessionStorage.setItem('referreId',this.referreId)}
          this.getRatioArr();
          // this.userId = '56ed7379da47434292deeb8d472ebb0c';
          this.userId = userId();
          if(!this.userId){
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb3417997b07e0f2e&redirect_uri=https%3A%2F%2Fzhidian.dookbook.info%2Fwx_auth.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
          }else{
            axios.defaults.headers.common["uid"] = this.userId;
            window.document.title = this.titleName; //初始页面title
            var id = getQueryVariable('professionId'), name = getQueryVariable('professionName');
            this.getProfession(id, false, name);
            this.salaryChart = echarts.init(document.getElementById('chart')); 
          }
        })
    },
    methods: {  //  放方法函数
        getAreaOption: function(){  //获取地区选项
            var url = domain() + '/api/district/list';
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
                  if(that.showPayPop){return;}
                  that.showMask = true;
                  that.showPayPop = true;
                }
            });
        },
        selecteProvince: function(item){ //选中省
          if(item.listChild.length==0){//选中“全国”
            this.showProvince = false;
            this.showCity = false;
            this.districtId = '';
            this.area = '全国';
            this.ratio = 1;
            this.clearChart();
            this.page = 0;
            this.getProfession(this.jobId, false, '');
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
          this.showProvince = false;//关闭省列表
          this.showCity = false;//关闭市列表
          this.districtId = item.id;//获取城市id
          this.area = item.name;//获取城市名称
          this.ratio = Number((this.getRatio(item.name,'citySalaryRatio'))).toFixed(2);//获取城市系数
          window.document.title = this.titleName;
          this.clearChart();
          this.page = 0;
          this.getProfession(this.jobId, false, '', item.name)
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
        getSearchTxt: debounce(function(){ //按照专业名称搜索文字  获取专业列表
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(!reg.test(this.searchTxt)){    //非中文
               return;
            }
            this.clearChart();//关闭图表
            var url = domain() + '/api/discipline/list';
            const that = this;
            if(this.searchTxt){
                var params = {'search': this.searchTxt};
                axios.get(url,{params:params}).then(function(res) {
                    var resData = res.data;
                    if(resData.code === 200){
                        that.professList = resData.data.list;
                        that.professList.length == 0 ? that.showSearch = false:that.showSearch = true;
                    }else if(resData.code === 105){
                      if(that.showPayPop){return;}
                      that.showMask = true;
                      that.showPayPop = true;
                    }
                });
            }
        },50),
        getProfession: function(id, onOff, name){ //选择专业获取行业数据
            id!=''? this.jobId = id:this.jobId = '18';
            name!=''? this.titleName = name:this.titleName = '哲学';
            if(onOff){this.page=0;}//如果是搜索来的，页码初始化
            this.onOff = onOff;
            var url = domain() + '/api/statistical/listDiscipline';
            const that = this;
            var params = {  //默认全国数据
              disciplineId: this.jobId,
              districtId: ''
            };
            // if(this.districtId != 0){//判断是否存地区id
            //    params.districtId = this.districtId; 
            // }
            if(name!=''){//判断title
              that.titleName = name;
              window.document.title = that.titleName; 
            }
            this.searchTxt = decodeURIComponent(this.titleName);//搜索完成情况搜索框内容
            axios.get(url,{params: params}).then(function(res) {
                var resData = res.data;
                if(resData.code === 200){
                  that.showSearch = false;//关闭专业列表
                  that.professionAvg = (resData.data.disciplineAvgSalary * that.ratio * 1000);//行业平均值
                  var arr = resData.data.listDisciplineAvgSalaryWorkingYears;
                  if(resData.data.disciplineAvgSalary === 0) {//行业平均值为空显示没有数据
                    that.showNoData = true; 
                    that.note = "暂无数据";
                    that.showTxt = false;
                    that.showLogin = false;
                    that.jobList = [];
                    return;
                  }else{
                    that.showNoData = false;
                  }
                  if(arr.length == 6){arr.pop();}//如果行业平均薪资超过五条，则删除最后一条“经验不限”
                  for(var i = 0; i < arr.length; i++){//年限区间内行业平均水平数组
                    that.professionSalaryList[i].avgSalary = (Number(arr[i].disciplineavgsalaryworkingyears)*that.ratio).toFixed(1);
                  }

                  that.getJodData(true, true);//获取行业相关职业数据
                }else if(resData.code === 105){//未支付，非会员
                  if(that.showPayPop){return;}
                  that.showMask = true;
                  that.showPayPop = true;
                }
            });
        },
        getRatio:function(key,arr){ //获取薪酬系数
          for (var i = 0; i < this[arr].length; i++) {
            if (this[arr][i]['city'] == key) {
              var ratio = this[arr][i].ratio;
              return ratio;
            }
          }
        },
        getRatioArr: function(){ //获取系数数组
          var url = "/static/json/ratio.json";
          const that = this;
          axios.get(url).then(function(res) {
            var resData = res.data;
            if(res.status === 200){
              that.citySalaryRatio = resData.citySalaryRatio;
              that.yearSalaryRatio = resData.yearSalaryRatio;
            }
          })
        },
        getJodData: function(isSearch, init){ //获取岗位数据 
            var url = domain() + '/api/statistical/listPage';
            const that = this;
            if(init){this.page=0;}
            var params = {
              disciplineId: this.jobId,
              limit: this.limit,
              page: this.page,
              districtId: ''  //默认全国数据
            };
            // if(this.districtId != 0){
            //    params.districtId = this.districtId; 
            // }
            axios.get(url,{params: params}).then(function(res) {
                var resData = res.data;
                that.isVip = res.headers.isvip; //是否为会员
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
                        that.modifyData(arr);
                    }
                    if(that.onOff && that.isVip === 'false'){ //onOff为true:搜索来的; isVip为false:非会员
                      var time = null; 
                      time = setTimeout(function(){
                          that.showMask = true;
                          that.showPayPop = true;
                      }, 10000);
                    }
                }else if(resData.code === 105){
                  if(that.showPayPop){return;}
                  that.showMask = true;
                  that.showPayPop = true;
                } else{
                  that.showNoData = true;
                  that.note = "访问失败";
                }
            });
        },
        modifyData: function(arr){//调整职业数据
            //职业平均数修改
          for(var i = 0; i < arr.length; i++){
            this.$set(arr[i], 'compareBtn', true);//每一个职位添加对比/取消属性
            var num = arr[i].positionavgsalary, randomArr = [0.23,0.56,0.43,0.78,0.68,0.90,0.87,0.17,0.76,0.92];
            if(num < 4.5){
              var index = i;
              index > 9 ? index = (index-10) : index = index;
              num = parseFloat((randomArr[index] * (5 - 4.5) + 4.5) * 10) / 10;
            }
            arr[i].positionavgsalary = num*this.ratio;
            var avg = arr[i].positionavgsalary;
                       
            //数据放入数组
            arr[i].jobSalary = [{minSalary:0,maxSalary:0,workAge:"1年以下"},{minSalary:0,maxSalary:0,workAge:"1-3年"},{minSalary:0,maxSalary:0,workAge:"3-5年"},{minSalary:0,maxSalary:0,workAge:"5-10年"},{minSalary:0,maxSalary:0,workAge:"10年以上"}];
            var list = arr[i].listPositionAvgSalaryScope;
            for(var j = 0; j < list.length; j++){
              var curAge = list[j].workingyears;
              switch(true){
                case curAge=='1年以下':
                  arr[i].jobSalary[0].minSalary = parseFloat(list[j].positionavgsalarymin).toFixed(1);
                  arr[i].jobSalary[0].maxSalary = parseFloat(list[j].positionavgsalarymax).toFixed(1);
                  break;
                case curAge=='1-3年':
                  arr[i].jobSalary[1].minSalary = parseFloat(list[j].positionavgsalarymin).toFixed(1);
                  arr[i].jobSalary[1].maxSalary = parseFloat(list[j].positionavgsalarymax).toFixed(1);
                  break;
                case curAge=='3-5年':
                  arr[i].jobSalary[2].minSalary = parseFloat(list[j].positionavgsalarymin).toFixed(1);
                  arr[i].jobSalary[2].maxSalary = parseFloat(list[j].positionavgsalarymax).toFixed(1);
                  break;
                case curAge=='5-10年':
                  arr[i].jobSalary[3].minSalary = parseFloat(list[j].positionavgsalarymin).toFixed(1);
                  arr[i].jobSalary[3].maxSalary = parseFloat(list[j].positionavgsalarymax).toFixed(1);
                  break;
                case curAge=='10年以上':
                  arr[i].jobSalary[4].minSalary = parseFloat(list[j].positionavgsalarymin).toFixed(1);
                  arr[i].jobSalary[4].maxSalary = parseFloat(list[j].positionavgsalarymax).toFixed(1);
                  break;
              }
            }
            if(arr[i].jobSalary[2].minSalary == 0 && arr[i].jobSalary[2].maxSalary == 0){ //3-5年数据不存的情况
              arr[i].jobSalary[2].minSalary = parseFloat(avg-1).toFixed(1);
              arr[i].jobSalary[2].maxSalary = parseFloat(avg+1).toFixed(1);
            }
            this.jobList.push(arr[i]);
          }
          this.modifySalaryData();
        },
        modifySalaryData: function(){
          var arr = this.jobList;
          for(var i = 0; i < arr.length; i++){
            for(var k = 0; k < arr[i].jobSalary.length; k++){
              var interArr = arr[i].jobSalary;
              //无数据处理
              if(interArr[k].minSalary === 0 && interArr[k].maxSalary === 0){
                interArr[k].minSalary = parseFloat(interArr[2].minSalary * this.yearSalaryRatio[k].ratio).toFixed(1);
                interArr[k].maxSalary = parseFloat(interArr[2].maxSalary * this.yearSalaryRatio[k].ratio).toFixed(1);
              }
              //区间数据倒挂
              if(k>0){
                if(parseFloat(arr[i].jobSalary[k].maxSalary) <= parseFloat(arr[i].jobSalary[k-1].maxSalary)){
                  this.jobList[i].jobSalary[k].maxSalary = parseFloat(interArr[2].maxSalary * this.yearSalaryRatio[k].ratio).toFixed(1);
                }
                if(parseFloat(arr[i].jobSalary[k].minSalary) <= parseFloat(arr[i].jobSalary[k-1].minSalary)){
                  this.jobList[i].jobSalary[k].minSalary = parseFloat(interArr[2].minSalary * this.yearSalaryRatio[k].ratio).toFixed(1);
                }
              }
              //乘以城市薪酬系数
              this.jobList[i].jobSalary[k].minSalary = parseFloat(arr[i].jobSalary[2].minSalary * this.yearSalaryRatio[k].ratio).toFixed(1);
              this.jobList[i].jobSalary[k].maxSalary = parseFloat(arr[i].jobSalary[2].maxSalary * this.yearSalaryRatio[k].ratio).toFixed(1);
              //区间值中的最大值小于最小值的情况
              if(parseFloat(arr[i].jobSalary[k].minSalary) > parseFloat(arr[i].jobSalary[k].maxSalary)){
                this.jobList[i].jobSalary[k].maxSalary = parseFloat(arr[i].jobSalary[k].minSalary) + 1;
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
            this.getJodData(false, false);
          }
        },
        viewmore: throttle(function() {  //加载更多
            var domH = this.clientH;
	          var domScrollH = this.Dom.scrollHeight;
	          var domScrollTop = Math.ceil(this.Dom.scrollTop);
	          var scrollArea = parseInt(domScrollH - domH);
            
            //划到底部刷新
            if(domScrollTop == scrollArea){ 
              this.turnPage();
            }

            //安卓手机默认直接刷新翻页
            var u = navigator.userAgent;
            if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
              this.turnPage();
            }

            //置顶按钮设置
            if(domScrollTop < 600){
              this.showToTop = false;
            }else{
              this.showToTop = true;
            }
        },50),
        CompareOrNot: debounce(function(item){  //对比/取消按钮
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
          position.style.marginTop = '520px';
        },
        removeHeight: function(){//删除margin-top
          var position = document.querySelector(".zhiwei");
          position.style.marginTop = '420px';
        },
        addRecord: function(item){ //添加图表数据
            var avg = item.jobSalary,arr = this.chartOption.series;//avg为职业薪资数组， arr为图表存数据的数组
            this.dataArr = [];  //用于存储职业薪资平均值
            for(var i = 0; i < avg.length; i++){
              if(avg[i].minSalary!='none'){
                var num = parseFloat((parseFloat(avg[i].minSalary) + parseFloat(avg[i].maxSalary))/2).toFixed(1);//计算平均值
              }else{
                var num = 0;
              }
              this.dataArr.push(num);
            }
            if(arr.length == 0){//如果图表数据数组为空
                this.addProfessionAvg();    //添加行业平均薪资
            }
            this.addFn(item, this.dataArr); //添加职业薪资数据
            this.addHeight(); //职业列表样式
            this.takeNote();
            this.showChart = true;//显示图表
        },
        takeNote: function(){  //后端记录对比数据
          var url = domain() + '/api/compared/clickCompared';
          axios.get(url,data).then(function(res) {});
        },
        addProfessionAvg: function(){   //对比图添加行业平均数据
            var arr = this.professionSalaryList, salaryLi = [];
            for(var i = 0; i < arr.length; i++){
                salaryLi.push(arr[i].avgSalary);
            }
            this.chartOption.legend.data[0] = '专业平均';
            this.chartOption.series[0] = {
                name: '专业平均',
                data: salaryLi,
                type: 'line',
                lineStyle: {
                  width: 4
                }
            };
        },
        addFn: function(item,arr){//添加职业薪资数据
          this.chartOption.legend.data.push(item.name);
          this.chartOption.series.push({
            name: item.name,
            data: arr,
            type: 'line',
            lineStyle: {
              width: 4
            }
          });
        },
        removeRecord: function(item){ //删除对应数据
          var arr = this.chartOption.legend.data,
              index = arr.indexOf(item.name);//找到要删除的数据的下标
          this.chartOption.legend.data.splice(index, 1);//去掉图表对应名称
          this.chartOption.series.splice(index, 1);
          if(this.chartOption.legend.data.length == 1){ //如果数据只剩下行业平均则清空图表
              this.clearChart();
          }
        },
        closeSuccess: function(msg){  //关闭支付成功
          this.showMask = false;
          this.showSuccess = false;
        },
        closePayPop: function(msg){
          this.showPayPop = false;
          this.showMask = false;
        },
        initData: function(bool){
          if(bool){
            //初始"哲学"数据
            this.getProfession('18', false, '哲学'); 
            this.titleName = '哲学';
            document.activeElement.blur();
            if(this.showChart){//图表关闭
                this.clearChart();
            }
          }else {
            this.showMask = true;
            this.showSuccess = true;
          }
        },
        goToCityList: function(){
          window.location.href = '/cityList.html?professionId=' + this.jobId + '&professionName=' + this.titleName;
        },
        clearTxt: function(){
          this.searchTxt = "";
        }
    },
    watch: {
      'chartOption': {
        handler: function(newVal, oldVal) {
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



