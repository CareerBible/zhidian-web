var data = {
    isVip: false, //是否为会员
    showToTop: false,
    professList:[
        {
            id: '',
            name: '',
            code: ''
        }
    ],
    userId: '',
    showPayPop: false,
    showSearch: false,
    showLoading: false,
    showNoData: false,
    showLogin: false,
    showTxt: false,
    note: '',
    searchTxt: '',
    titleName: '',
    cityAvg: 0,
    clientH:'',
    avgSalary: 0,
    limit: 5,
    page: 0,
    cityChart: null,
    professionId: '',
    totalPage: 0,
    cityList: [],
    showChart: false,
    pageId: 'd4c5158a4e5e4ddeb873c71bd0406386',
    chartOption: {
        backgroundColor: '#fff',
        color:['#e53698','#22c3ab','#516b91'],
        tooltip: {},
        grid: {
            top: "10"
        },
        legend: {
            data: [],
            width: "100%",
            left:"1%",
            textStyle: {
                fontSize: 16
            },
            itemGap: 14
        },
        radar: {
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#3589fc',
                    borderRadius: 3,
                    padding: [7, 6],
                    fontSize: 16
                }
            },
            indicator: [
                { name: '平均薪酬', max: 50000},
                { name: '对口职业在聘数', max: 50000},
                { name: '房租收入比', max: 100},
                { name: '月人均消费', max: 10000},
                { name: '净流入人才数', max: 800},
                { name: '平均房价', max: 100000}
            ],
            center: ["50%", "55%"],
            radius: "68%"
        },
        series: [{
            name: '城市平均数据',
            type: 'radar',
            data: [],
            lineStyle: {
                width: 3
            }
        }]
    }
}
var vm = new Vue({
    el: "#cityList",    //挂载元素
    data: data,
    mounted: function(){
        this.$nextTick(function() {
            this.clientH = document.documentElement.clientHeight;
            this.Dom = document.getElementById('cityList');//获取页面DOM的id
            var id = getQueryVariable('professionId'), name = getQueryVariable('professionName');
            var uid = localStorage.getItem('uid');
            wsPolling(uid,this.pageId);
            this.getCityAvg(id, name);
            this.cityChart = echarts.init(document.getElementById('chart'));
            this.cityChart.setOption(this.chartOption);
        })
    },
    methods: {
        getSearchTxt: debounce(function(){ //按照专业名称搜索文字  获取专业列表
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(!reg.test(this.searchTxt)){    //非中文
                return;
            }
            var url = domain() + '/api/discipline/list';
            const that = this;
            if(this.searchTxt){
                var params = {'search': this.searchTxt};
                axios.get(url,{params:params}).then(function(res) {
                    var resData = res.data;
                    if(resData.code === 200){
                        that.professList = resData.data.list;
                        that.professList.length == 0 ? that.showSearch = false:that.showSearch = true;
                    }
                });
            }
        },50),
        getCityAvg: function(id,name){ //获取城市平均数据
            var url = domain() + '/api/cityDiscipline/positionCityAvgCount', that = this;
            this.clearChart();
            id!=''? this.professionId = id:this.professionId = '18';
            name!=''? this.titleName = name:this.titleName = '哲学';
            window.document.title = decodeURIComponent(this.titleName);
            this.searchTxt = decodeURIComponent(this.titleName);

            var params = {disciplineId: this.professionId}
            axios.get(url,{params:params}).then(function(res) {
                var resData = res.data;
                that.isVip = res.headers.isvip; //是否为会员
                if(resData.code == 200){
                    that.showSearch = false;
                    that.avgSalary = resData.data.disciplineAvgSalary;
                    that.cityAvg = resData.data.positionCityAvgCount;
                    that.getCityList(true);
                }
            })
        },
        getCityList: function(isSearch){    //获取城市列表
            if(isSearch){this.page=0;}
            var url = domain() + '/api/cityDiscipline/listPage', that = this;
            var params = {
                disciplineId: this.professionId,
                limit: this.limit,
                page: this.page
            }
            axios.get(url,{params:params}).then(function(res) {
                var resData = res.data;
                
                if(resData.code == 200){
                    var arr = resData.data.listCityPosition;
                    that.totalPage = Math.ceil(resData.data.totaCount/that.limit)-1;//总页数
                    if(arr.length == 0){//显示暂无数据
                        that.showNoData = true;
                        that.cityList = [];
                        that.note = "暂无数据";
                        that.showTxt = false;
                    }else{
                        that.showNoData = false;
                        if(isSearch){   //是否搜索来的
                            that.cityList = [];
                        }
                        for(var i = 0; i < arr.length; i++){
                            that.$set(arr[i], 'compareBtn', true); //加一个对比/取消的自定义属性
                            that.cityList.push(arr[i]);
                        }
                    }
                }
            })
        },
        viewmore: throttle(function() {  //加载更多
            var domH = this.clientH;
            var domScrollH = this.Dom.scrollHeight;
            var domScrollTop = Math.ceil(this.Dom.scrollTop);
            var scrollArea = parseInt(domScrollH - domH);

            var u = navigator.userAgent;
            if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
              domScrollTop = domScrollTop + 1;
            }

            if(domScrollTop >= scrollArea){
                if(this.isVip == 'false') {
                  this.showPayPop = true;
                  return;
                }else {
                  this.showPayPop = false;
                }
                this.turnPage();
            }else{
                this.showPayPop = false;
            }

            //置顶按钮设置
            if(domScrollTop < 600){
                this.showToTop = false;
            }else{
                this.showToTop = true;
            }
        },50),
        turnPage: function(){//翻页
            if(this.page == this.totalPage){ //最后一页
                this.showLogin = false;
                this.showTxt = true;
                return;
            }else {
                this.showLogin = true;
                this.showTxt = false;
                this.page++;
                this.getCityList(false);
            }
        },
        CompareOrNot: debounce(function(item){//对比or取消
            if(item.compareBtn) {
                this.compareRecord();
                this.addRecord(item);
            }else {
                this.removeRecord(item);
            }
        },200),
        addRecord: function(item){  //添加记录
            this.showChart = true;//显示图表
            this.$set(item, 'compareBtn', false);//按钮变色
            if(this.chartOption.legend.data.length == 3){//最多对比三个
                alert('最多只能对比三个城市')
                return;
            }
            this.chartOption.legend.data.push(item.districtnname);//添加图表示例
            this.chartOption.series[0].data.push({
                name: item.districtnname,
                value:[parseInt(item.cityAvgSalary),//城市平均薪酬
                        item.totalrequired,//在聘职位数 
                        parseFloat((item.rentIncome*100).toFixed(1)),//房租收入比
                        parseInt(item.monthlyPerCapitaConsumption),//月人均消费
                        parseInt(item.netInflowOfTalents/1000),//净流入人才
                        item.averageHousePrice//平均房价
                    ]
            })
            this.modifyIndicator();
        },
        modifyIndicator: function(){    //修改最大值
            var arr = this.chartOption.series[0].data;
            if(arr.length == 1){return;}
            for(var j = 0; j < 6; j++){
                if(j==2){continue;}//房租收入比不计算
                var maxArr = []; 
                for(var i = 0; i < arr.length; i++){
                    maxArr.push(arr[i].value[j]);
                }
                var maxVal = maxArr.sort(function(a,b){
                    return b-a;
                })[0];
                this.chartOption.radar.indicator[j].max = this.getMax(maxVal);
            }
        },
        getMax: function(val){
            var str = val.toString();
            var arr = str.split('');
            var n = arr.length-1;
            var num = (Number(arr[0])+1) * Math.pow(10,n);
            return num
        },
        removeRecord: function(item){//删除记录
            var arr = this.chartOption.legend.data,
              index = arr.indexOf(item.districtnname);//找到要删除的数据的下标
            this.$set(item, 'compareBtn', true);//按钮变色
            this.chartOption.legend.data.splice(index, 1);//去掉图表对应名称
            this.chartOption.series[0].data.splice(index, 1);
            if(this.chartOption.legend.data.length == 0){ //如果数据只剩下行业平均则清空图表
                this.clearChart();
            }
        },
        clearChart: debounce(function(){ //清空图表数据并关闭
            for(var i = 0; i < this.cityList.length; i++){
              this.$set(this.cityList[i], 'compareBtn',true);
            }
            this.chartOption.legend.data = [];
            this.chartOption.series[0].data = [];
            this.showChart = false;
        },50),
        goToSalary: function(){
            window.location.href = '/salaryList.html?professionId=' + this.professionId + '&professionName=' + this.titleName;
        },
        toIndex: function(){//返回上一页
            window.location.href = '/index.html';
        },
        clearTxt: function(){
            this.searchTxt = "";
        },
        compareRecord: function(){  //记录对比次数
            var url = domain() + '/api/compared/clickComparedCity';
            axios.get(url).then(function(res) {})
        }
    },
    watch: {
        'chartOption': {
            handler: function(newVal, oldVal) {
                if (this.cityChart) {
                    if (newVal) {
                    this.cityChart.setOption(newVal,true);
                    } else {
                    this.cityChart.setOption(oldVal,true);
                    }
                } else {
                    this.init();
                }
            },
            deep: true //对象内部属性的监听，关键。
        },
        'showChart': function(newVal,oldVal){
            var position = document.querySelector(".list");
            if(newVal){
                position.style.marginTop = '520px';
            }else{
                this.clearChart();
                position.style.marginTop = '240px';
            }
        }
    }
})