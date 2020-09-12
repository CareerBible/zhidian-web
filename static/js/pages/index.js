var data = {}

var vm = new Vue({
    el: "#index",    //挂载元素
    data: {
        tabs:[
            {name: '查职业', check: true, type: 'salary', text:'输入专业名，搜专业对口的职业薪酬'},
            {name: '查城市', check: false, type: 'city', text:'输入专业名，选就业高薪城市'}
        ],
        placeholder: '输入专业名，搜专业对口的职业薪酬',
        showSearch: false,
        searchTxt: '',
        searchType: 'salary',
        professList: []
    },
    mounted: function(){
        this.$nextTick(function() {
                    
        })
    },
    methods: {
        tabSearch: function(item){  //tab交互
            for(var i = 0; i < this.tabs.length; i++){
                this.tabs[i].check = false;
            }
            this.placeholder = item.text;
            this.searchType = item.type;
            this.$set(item, 'check', true)
        },
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
                        that.professList = [];
                        that.professList = resData.data.list;
                        that.professList.length == 0 ? that.showSearch = false:that.showSearch = true;
                    }
                });
            }
        },50),
        toNext: function(item){//进入下一页
            var id = item.id, name = item.name;
            window.location.href = '/'+ this.searchType + 'List.html?professionId=' + id + '&professionName=' + name;
        }
    }
})