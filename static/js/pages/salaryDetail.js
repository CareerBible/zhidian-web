var vm = new Vue({
    el: "#salaryDetail",    //挂载元素
    data: {
        userId: '',
        pageId: '97a16a2f45c444178ed73134e838a378'
    },
    mounted: function(){
        this.$nextTick(function() {
            this.userId = window.localStorage.getItem('uid');
            // wsPolling(this.userId,this.pageId);
        })
    }
})