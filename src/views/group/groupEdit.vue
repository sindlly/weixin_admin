/**
* Created by sindlly on 2018-06-04.
*/
<template>
    <div class="main-container">
        <h2><router-link to="/group/group">部门管理</router-link>-编辑部门</h2>
        <hr>
        <div style="margin-top: 20px">
            <span style="font-size: 18px">部门名称:<Input :value="groupName"/></span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
    export default{
        data(){
            return {
                groupName:"xx"
            }
        },
        mounted(){

        },
        component:{

        },
        methods: {}
    }
</script>
<style scoped>
    .main-container{
        width: 100%;
        height: 100%;
        padding: 15px;
        background: #fff;
    }
    .search{
        margin-top: 20px;
        font-size: 14px;
    }
    .table{
        margin-top: 20px;
    }
    .page{
        margin-top: 20px;
        text-align: right;
    }
</style>