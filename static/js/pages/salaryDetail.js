var vm = new Vue({
    el: "#salaryDetail",    //挂载元素
    data: {
        pageId: '97a16a2f45c444178ed73134e838a378',
        positionSalaryAvg: 0,
        requiredCount: 0,
        salaryData: [],
        listEducationPercentage: [],
        educationSalaryAvg:[],
        listWorkingYearsSalaryAvgList: [],
        listWorkExperienceDistributed: [],
        salaryFrequency: [
            {
                name: '2k-5k',
                value: 0
            },
            {
                name: '2k以下',
                value: 0
            },
            {
                name: '5k-10k',
                value: 0
            },
            {
                name: '10k-15k',
                value: 0
            },
            {
                name: '15k以上',
                value: 0
            }
        ],
        positionId: '891f9ca0ef1611eaa4388438355448de'
    },
    mounted: function(){
        this.$nextTick(function() {
            this.getSalaryDetail();
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
                }
            })
        }
    }
})




