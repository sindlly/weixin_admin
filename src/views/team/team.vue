/**
* Created by sindlly on 2018-06-04.
*/
<template>
    <div class="main-container">
        <h2><router-link to="/group/group">部门管理</router-link>/{{title}}-团队管理</h2>
        <hr>
        <div class="search">
            <label>团队:</label> <Input v-model="searchData" placeholder="请输入团队名称" style="width: 300px" />
            <Button type="info" icon="ios-search" @click="getTeam(1)">搜索</Button>
            <Button type="ghost" icon="refresh" @click="clear">清空</Button>
            <Button type="primary" icon="plus" style="float: right"  @click="modal = true">新增团队</Button>
        </div>
        <div class="table">
            <Table :columns="columns" :data="tableData" :loading="loading"></Table>
        </div>
        <Page class="page" :total="page.total" @on-change="toPage" :page-size="15" show-total></Page>
        <Modal
                v-model="modal"
                title="新增部门"
                @on-ok="j_ok"
                @on-cancel="j_cancel">
            <label>团队名称:</label> <Input v-model="team_name" placeholder="请输入部门名称" style="width: 300px" />
        </Modal>
        <Modal
                v-model="modal_delete"
                title="确认删除"
                @on-ok="j_delete"
                @on-cancel="j_delete_cancel">
            <p>确认删除此团队?</p>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
    export default{
        data(){
            return {
                title:"",
                loading:false,
                modal:false,
                modal_delete:false,
                delete_id:"",
                searchData:'',
                team_name:'',
                team_id:'',
                department_id:"",
                columns: [
                    {
                        title: 'ID',
                        key: 'team_id'
                    },
                    {
                        title: '团队名称',
                        key: 'team_name'
                    },
                    {
                        title: '操作',
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on:{
                                        click: ()=> {
                                            this.edit(params.row.team_id,params.row.team_name);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.modal_delete = true;
                                            this.delete_id = params.row.team_id
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData:[],
                page:{
                    total:0
                }
            }
        },
        mounted(){
            this.title = this.$route.params.name
            this.department_id = this.$route.params.id
            this.getTeam()
        },
        component:{

        },
        methods: {
            newDepart:function () {

            },
            getTeam:function (pageNo) {
                var _this = this;
                this.loading = true
                axios.get('/admin/Team/Get',{params:{
                            team_keyword:_this.searchData,
                            department_id:_this.$route.params.id,
                            page:pageNo
                        }})
                        .then(response => {
                            _this.tableData = response.data.data.List
                            _this.page.total = response.data.data.TotalCount
                            _this.loading = false
                        })
                        .catch(err => {
                            return err
                        });
            },
            clear:function () {
                this.searchData = "";
                this.getTeam()
            },
            edit:function (id,name) {
                console.log("id:"+id)
                this.modal = true;
                this.team_id = id;
                this.team_name = name;
            },
            j_ok:function () {
                var _this = this;
                var url = ""
                if(_this.team_id){
                    url = "/admin/Team/Edit"
                }else{
                    url = "/admin/Team/Add"
                }
                axios.get(url,{params:{
                            team_name:_this.team_name,
                            team_id:_this.team_id,
                            department_id:_this.department_id
                        }})
                        .then(response => {
                            _this.team_name = "";
                            this.team_id = "";
                            if(response.data.code == 0){
                                _this.modal = false;
                                _this.getTeam();
                            }else{

                            }
                        })
                        .catch(err => {
                            return err
                        });
            },
            j_cancel:function () {
                this.team_name = "";
                this.team_id = "";
            },
            j_delete:function () {
                var _this = this;
                axios.get("/admin/Team/Delete",{params:{
                            team_id: _this.delete_id
                        }})
                        .then(response => {
                            console.log("code:"+response.data.code)
                            if(response.data.code == 0){
                                _this.getTeam();
                                _this.delete_id = 0;
                            }else{

                            }
                        })
                        .catch(err => {
                            return err
                        });
            },
            j_delete_cancel:function () {
                this.modal_delete= false;
                this.delete_id = ""
            },
            toPage:function (e) {
                this.getTeam(e)
            }
        }
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