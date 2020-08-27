 //数据
 let data = {
    domain: 'https://zhidian.dookbook.info',  //域名
    showSearch: false,
    searchTxt: '', //搜索框文字
    area: '全国',
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
    showLogin: false,   //显示“加载中”
    showLoading: false,   //显示“正在加载” 
    showNoData: false,   //显示“没有数据”
    showProvince: false,  //显示省
    showCity: false,  //显示市
    showMask: false,
    showPop: false,
    showSuccess: false,
    jobCode: '010101',
    page: 1,  //页码
    limit: '5', //每页显示多少条数据
    professionAvg: 0,
    container: null,// 绑定能被监听滚动的元素
    domHeight: 0,// 内容可视区的高度
    professionSalaryList: [],
    jobList: [],
    totalPage: 0,  //总页数
    Dom: '',
    clientH: '',
    note: '',
    salaryChart: null,
    dataArr:[],
    profession: 1,
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
        this.salaryChart = echarts.init(document.getElementById('chart')); 
        this.$nextTick(function() {  
          this.clientH = document.documentElement.clientHeight;
          this.Dom = document.getElementById('salaryAnalysis');
          
          //this.userId = window.localStorage.getItem('uid');
          //axios.defaults.headers.common["uid"] = this.userId;
        })
        //初始"哲学"数据
        window.document.title = '哲学';
        this.getProfession('010101', false, '哲学');
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
                      listChild: []
                    });
                    for(var i = 0; i<that.areaList.length; i++){
                      that.$set(that.areaList[i], show, false);
                    }
                }
            });
        },
        selecteProvince: function(item){ //选中省
          if(item.listChild.length==0){
            item.show = false;
            return;
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
          this.getProfession(this.jobCode, true, this.searchTxt);
        },
        getSearchTxt: function(){ //按照专业名称搜索文字获取专业列表
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
                    }
                });
            }
        },
        getProfession: function(code, onOff, name){ //选择专业获取行业数据
            // if(name == ''){this.searchTxt = }
            this.searchTxt = '';
            this.jobCode = code;
            var url = this.domain + '/api/statistical/listDiscipline';
            const that = this;
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
                    
                    window.document.title = name;              
                    that.showSearch = false;
                    that.professionAvg = (resData.data.disciplineAvgSalary * 1000);
                    var arr = resData.data.listDisciplineAvgSalaryWorkingYears;
                    if(arr.length === 0) {that.showNoData = true; that.professionSalaryList=[]; return;}else{that.showNoData = false;}
                    for(var i = 0; i < arr.length; i++){
                      that.professionSalaryList[i] = arr[i];
                    }
                }
            });
            
            this.getJodData(true, true);
            if(onOff){
                var time = null;
                time = setTimeout(function(){
                    that.showMask = true;
                    that.showPop = true;
                }, 10000);
            }
        },
        getJodData: function(isSearch, init){ //获取岗位数据
            var url = this.domain + '/api/statistical/listPage';
            const that = this;
            if(init){this.page=1;}
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
                    that.totalPage = parseInt(resData.data.totaCount/that.limit);
                    var arr = resData.data.listPositionAvgSalary;
                    if(arr.length == 0){
                        that.showNoData = true;
                        that.jobList = [];
                        that.note = "暂无数据";
                        return;
                    }else{
                        that.showNoData = false;
                        if(isSearch){   //是否搜索来的
                            that.jobList = [];
                        }
                        for(var i = 0; i < arr.length; i++){
                            that.$set(arr[i], 'compareBtn', true);
                            that.jobList.push(arr[i]);
                        }
                    }
                }else {
                  that.showNoData = true;
                  that.note = "访问失败";
                }
            });
        },
        turnPage: function(){ 
          if(this.page == this.totalPage){ //没有剩余页数
            this.showLogin = false;
            return;
          }else {
            this.showLogin = true;
            this.page++;
            setTimeout(this.getJodData(false, false),500);
          }
        },
        viewmore: function() {  //加载更多
            var domH = this.clientH;
            var domScrollH = this.Dom.scrollHeight;
            var domScrollTop = Math.ceil(this.Dom.scrollTop);
            var scrollArea = parseInt(domScrollH - domH);
            var toTop = document.querySelector('.top');

            this.setFixed();

            if(domScrollTop == scrollArea){
                this.turnPage();
            }else {
                this.showLogin = false;
            }
            if(domScrollTop < 600){
              toTop.style.display = 'none';
            }else{
              toTop.style.display = 'block';
            }
        },
        compareOrCancel: function(item){  //对比/取消按钮
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
        },
        addRecord: function(item){ //添加图表数据
            var avg = item.listPositionAvgSalaryScope,arr = this.chartOption.series;
            this.dataArr = [];
            for(var i = 0; i < avg.length; i++){
              var num = parseFloat((avg[i].positionavgsalarymax + avg[i].positionavgsalarymin)/2).toFixed(1);
              this.dataArr.push(num);
            }
            this.chartOption.legend.data.push(item.name);  //职业名称
            if(arr.length == 0){
                this.addProfessionAvg();    //添加行业平均薪资
                this.addFn(item, this.dataArr);
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
                salaryLi.push(arr[i].disciplineavgsalaryworkingyears);
            }
            this.chartOption.legend.data.push('行业平均');
            this.chartOption.series.push({
                name: '行业平均',
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
                this.chartOption.legend.data = [];
                this.chartOption.series = []
                this.showChart = false;
          }
        },
        setFixed: function(){//固定图表
            if(!this.showChart){return;}
            var scrollTop = this.Dom.scrollTop;
            var profession = document.querySelector('#profession');
          if(scrollTop > 120){
              profession.style.position = 'fixed'
              profession.style.top = '0'
              profession.style.width = 'calc(100% - 80px)'
              profession.style.zIndex = '3'
              profession.querySelector('section').style.marginTop = '0'
          } else {
              profession.style.position = 'static'
              profession.querySelector('section').style.marginTop = '40px'
              profession.style.width = '100%'
          }
        },
        backTop: function(){  //回到顶部
          var time = null , that = this;
          var scrollTop = that.Dom.scrollTop;
         
          time = setInterval(function(){
            if(that.Dom.scrollTop === 0){
              clearInterval(time);
            }else{
              that.Dom.scrollTop -= 100;
            }
          }, 16);
        },
        closePop: function(){   //未支付关闭弹窗
            this.showMask = false;
            this.showPop = false;
            var profession = document.querySelector('#profession');
            //初始"哲学"数据
            this.getProfession('010101', false, '哲学'); 
            if(this.showChart){//图表关闭
                this.chartOption.legend.data = [];
                this.chartOption.series = []
                this.showChart = false; 
            }
            //行业平均样式恢复
            profession.style.position = 'static';
            profession.querySelector('section').style.marginTop = '40px'
            profession.style.width = '100%'
        }
    },
    watch: {
      'chartOption': {
        handler: function(newVal, oldVal) {
          if (this.salaryChart) {
            if (newVal) {
              this.salaryChart.setOption(newVal);
            } else {
              this.salaryChart.setOption(oldVal);
            }
          } else {
            this.init();
          }
        },
        deep: true //对象内部属性的监听，关键。
      }
    }
})