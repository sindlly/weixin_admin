/**
* Created by sindlly on 2018-06-04.
*/
<template>
    <div class="main-container">
        <h2>人员管理</h2>
        <hr>
        <div class="search">
            <div class="search-1">
                <span class="search-item">
                    <label>工号:</label> <Input v-model="company_card_no" placeholder="请输入工号" style="width: 100px" />
                </span>
                <span class="search-item">
                    <label style="display: inline-block;width: 60px">电话:</label> <Input v-model="phone" placeholder="请输入电话" style="width: 100px" />
                </span>
                <span class="search-item">
                    <label>入职日期: </label><DatePicker type="daterange" v-model="time" @on-change="getTime" split-panels placeholder="选择时间" style="width: 180px"></DatePicker>
                </span>
                <span class="search-item">
                    <label>部门:</label>
                <Select style="width:180px" v-model="department_keyword">
                    <Option v-for="item in department" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                </span>
                <Button type="info" icon="ios-search" @click="" style="float: right;width: 96px" @click="getUserList(1)">搜索</Button>
                <Button type="ghost" icon="refresh" @click="clear" style="float: right;width: 96px;margin-right: 10px">清空</Button>
            </div>

            <div class="search-2">
                <span class="search-item">
                    <label>姓名:</label> <Input v-model="name" placeholder="请输入姓名" style="width: 100px" />
                </span>
                <span class="search-item">
                    <label>团队名称:</label> <Input v-model="team_keyword" placeholder="请输入团队名称" style="width: 100px" />
                </span>
                <span class="search-item">
                    <label>入职状态:</label>
                    <Select style="width:180px" v-model="working_status">
                        <Option v-for="item in working_status_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>

                <router-link to="/newUser"><Button type="primary" icon="plus" style="float: right" >新增人员</Button></router-link>

            </div>
        </div>
        <div class="table">
            <Table :columns="columns" :data="tableData" :loading="loading"></Table>
        </div>
        <Page class="page" :total="page.total" @on-change="toPage" :page-size="15" show-elevator show-total></Page>
        <Modal
                v-model="modal_delete"
                title="确认删除"
                @on-ok="j_delete"
                @on-cancel="j_delete_cancel">
            <p>确认删除此人?</p>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
    export default{
        data(){
            return {
                loading:false,
                company_card_no:'',
                department_keyword:'',
                team_keyword:'',
                phone:'',
                working_status:'',
                name:'',
                start_entry_date:'',
                end_entry_date:'',
                search_time:[],
                time:'', //展示用，用于清除
                working_status_list:[
                    {
                        value:'在职',
                        label:'在职'
                    },
                    {
                        value:'离职',
                        label:'离职'
                    }
                ],
                department:[],
                columns: [
                    {
                        title: 'ID',
                        key: 'user_id',
                        minWidth:"80"
                    },
                    {
                        title: '姓名',
                        key: 'name',

                    },
                    {
                        title: '电话',
                        key: 'phone',
                        width:'110'
                    },
                    {
                        title: '工号',
                        key: 'company_card_no',
                        minWidth:'90',
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '所属部门',
                        key: 'department_name'
                    },{
                        title: '所属团队',
                        key: 'team_name'
                    },{
                        title: '入职时间',
                        key: 'entry_date',
                        minWidth:'100',
                    },{
                        title: '入职状态',
                        key: 'working_status'
                    },
                    {
                        title: '操作',
                        key: 'address',
                        width:'180',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on:{
                                        click: ()=> {
                                            this.$router.push({
                                                path: "/userDetail?user_id=" + params.row.user_id
                                            })
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on:{
                                        click: ()=> {
                                            this.$router.push({
                                                path: "/newUser?user_id=" + params.row.user_id
                                            })
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
                                            this.deleleUser(params.row.user_id)
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
                },
                modal_delete:false,
                delete_id:'',
            }
        },
        mounted() {
            //处理加载完毕后的事件
            this.getDepartmentList()
            this.getUserList()
        },
        methods: {
            getDepartmentList:function () {
                var _this = this;
                axios.get('/admin/Department/GetDepartments')
                   .then(response => {
                       var data = response.data.data
                       var temp = []
                        for(var i in data){
                            console.log("id"+data[i].Department_id)
                            temp[i] = {
                                value: data[i].Department_name,
                                label:data[i].Department_name
                            }
                        }
                       _this.department = temp
                    })
                    .catch(err => {
                        return err
                    });
            },
            getUserList:function (pageNo) {
                var _this = this;
                this.loading = true
                axios.get('/admin/Staff/Get',{
                    params:{
                        page:pageNo,
                        company_card_no:_this.company_card_no,
                        department_keyword:_this.department_keyword,
                        team_keyword:_this.team_keyword,
                        phone:_this.phone,
                        working_status:_this.working_status,
                        name:_this.name,
                        start_entry_date:_this.search_time[0],
                        end_entry_date:_this.search_time[1],
                    }
                }).then(response => {
                        _this.tableData = response.data.data.List||[]
                        _this.page.total = response.data.data.TotalCount
                        _this.loading = false
                    })
                    .catch(err => {
                        return err
                    });
            },
            clear:function () {
                this.company_card_no="";
                this.department_keyword="";
                this.team_keyword="";
                this.phone="";
                this.working_status="";
                this.name = "";
                this.search_time = "";
                this.time = ""
                this.getUserList()
            },
            getTime:function (e) {
              this.search_time = e
            },
            toPage:function (e) {
                this.getUserList(e)
            },
            j_delete:function () {
                var _this = this;
                axios.get('/admin/Staff/DelOrOutset',{
                    params:{
                        option:"del",
                        user_id:_this.delete_id
                    }
                }).then(response => {
                    if(response.data.code == 0){
                        _this.getUserList()
                        _this.$Message.success('删除成功!');
                    }else{
                        _this.$Message.warning(response.data.msg);
                    }

                })
                .catch(err => {
                    return err
                });
            },
            deleleUser:function (id) {
                this.modal_delete = true
                this.delete_id = id
            },
            j_delete_cancel:function () {
                this.modal_delete= false;
                this.delete_id = ""
            }
        }
    }
</script>
<style scoped>
    .main-container{
        /*width: 100%;*/
        min-width:1170px ;
        height: 100%;
        padding: 15px;
        background: #fff;
    }
    .search{
        margin-top: 20px;
        font-size: 14px;
    }
    .search-2{
        margin-top: 10px;
    }
    .search-item{
        display: inline-block;
        /*width: 200px;*/
        margin-right: 40px;
    }
    .table{
        margin-top: 20px;
    }
    .page{
        margin-top: 20px;
        text-align: right;
    }
</style>