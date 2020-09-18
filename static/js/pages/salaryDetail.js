var vm = new Vue({
    el: "#salaryDetail",    //挂载元素
    data: {
        pageId: '97a16a2f45c444178ed73134e838a378',
        positionName: '',
        positionSalaryAvg: 0,
        requiredCount: 0,
        salaryData: [],
        listEducationPercentage: [],
        educationSalaryAvg:[],
        listWorkingYearsSalaryAvgList: [],
        listWorkExperienceDistributed: [],
        salaryFrequency: [],
        quantile: [],
        positionId: '',
        chart1: null,
        chartOption1: option1,
        chart2: null,
        chartOption2: option2,
        suggest: ''
    },
    mounted: function(){
        this.$nextTick(function() {
            this.positionId = getQueryVariable('positionId');
            this.positionName = decodeURIComponent(getQueryVariable('positionName'));
            this.getSalaryDetail();
            this.chart1 = echarts.init(document.getElementById('chart1'));
            this.chart2 = echarts.init(document.getElementById('chart2'));
            this.chart1.setOption(this.chartOption1);
            this.chart2.setOption(this.chartOption2);
            // wsPolling(this.userId,this.pageId);
        })
    },
    methods: {
        getSalaryDetail: function(){//获取页面数据
            var url = domain() + '/api/salary/salaryDetails',that = this;
            var params = {positionId: this.positionId}
            axios.get(url,{params:params}).then(function(res) {
                var resData = res.data;
                if(resData.code === 200){
                    var data = resData.data;
                    that.positionSalaryAvg = data.positionSalaryAvg;
                    that.requiredCount = data.requiredCount;
                    //薪酬总体分析
                    that.salaryData = [data.maxSalary,data.minSalary,data.positionSalaryAvg,data.median];
                    that.chartOption1.series[0].data = that.salaryData;

                    //招聘学历分析
                    for(var i = 0; i < data.listEducationPercentage.length; i++){
                        data.listEducationPercentage[i].value = data.listEducationPercentage[i].educationPercentage+'%';
                        data.listEducationPercentage[i].name = data.listEducationPercentage[i].education;
                    }
                    that.listEducationPercentage = data.listEducationPercentage;

                    //学历与薪酬
                    for(var i = 0; i < data.educationSalaryAvg.length; i++){
                        data.educationSalaryAvg[i].value = Number(data.educationSalaryAvg[i].educationavgsalary/1000).toFixed(1) + 'k';
                        data.educationSalaryAvg[i].name = data.educationSalaryAvg[i].education;
                    }
                    that.educationSalaryAvg = data.educationSalaryAvg;

                    //招聘工作经验分析
                    for(var i = 0; i < data.listWorkExperienceDistributed.length; i++){
                        data.listWorkExperienceDistributed[i].value = Number(data.listWorkExperienceDistributed[i].workingYearsPercentage).toFixed(1) + '%';
                        data.listWorkExperienceDistributed[i].name = data.listWorkExperienceDistributed[i].workingyears;
                    }
                    that.listWorkExperienceDistributed = data.listWorkExperienceDistributed;

                    //工作经验与薪酬
                    for(var i = 0; i < data.listWorkingYearsSalaryAvgList.length; i++){
                        data.listWorkingYearsSalaryAvgList[i].value = Number(data.listWorkingYearsSalaryAvgList[i].workingyearsavgsalary/1000).toFixed(1) + 'k';
                        data.listWorkingYearsSalaryAvgList[i].name = data.listWorkingYearsSalaryAvgList[i].workingyears;
                    }
                    that.listWorkingYearsSalaryAvgList = data.listWorkingYearsSalaryAvgList;

                    //薪酬频度
                    var values = Object.values(data.salaryFrequency);
                    var keys = Object.keys(data.salaryFrequency)
                    that.salaryFrequency = [];
                    for(var i = 0; i < values.length; i++){
                        that.salaryFrequency.push({
                            value: values[i]+'%',
                            name: keys[i]
                        })
                    }

                    //薪酬水平
                    that.quantile = Object.values(data.quantile);
                    that.quantile.push(that.positionSalaryAvg);
                    that.chartOption2.series[0].data = that.quantile;
                }
            })
        },
        getSeggestion: function(){//提交建议
            var url = domain() + '/api/compared/collectSuggestions',that = this;
            var params = {suggestions: this.suggest}
            axios.get(url,{params:params}).then(function(res) {
                var resData = res.data;
                if(resData.code === 200){
                    alert('感谢您宝贵的建议！')
                }
            })
        }
    },
    watch: {
        'chartOption1': {
            handler: function(newVal, oldVal) {
                if (this.chart1) {
                    if (newVal) {
                        this.chart1.setOption(newVal,true);
                    } else {
                        this.chart1.setOption(oldVal,true);
                    }
                } else {
                    this.init();
                }
            },
            deep: true //对象内部属性的监听，关键。
        },
        'chartOption2': {
            handler: function(newVal, oldVal) {
                if (this.chart2) {
                    if (newVal) {
                        this.chart2.setOption(newVal,true);
                    } else {
                        this.chart2.setOption(oldVal,true);
                    }
                } else {
                    this.init();
                }
            },
            deep: true //对象内部属性的监听，关键。
        }
    }
})




