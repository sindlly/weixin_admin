<style lang="less">
    @import "./home.less";
</style>
<template>
    <div class="home-main">
        <div class="part">
            <div class="title">部门总数</div>
            <div class="num">{{department_total}}</div>
        </div>
        <div class="part">
            <div class="title">团队总数</div>
            <div class="num">{{team_total}}</div>
        </div>
        <div class="part">
            <div class="title">人员总数</div>
            <div class="num">{{users_total}}</div>
        </div>
    </div>
</template>

<script>
    import api from"../../libs/api"
    export default {
        name: 'home',
        data () {
            return {
                department_total:'',
                team_total:'',
                users_total:''
                //
            };
        },
        mounted(){
            var _this = this;
            api.getDashboard().then(function (res) {
                _this.department_total = res.data.data.department_total;
                _this.team_total = res.data.data.team_total;
                _this.users_total = res.data.data.users_total;
            })

        },
    };
</script>
