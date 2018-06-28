/**
* Created by sindlly on 2018-06-04.
*/
<template>
    <div class="main-container">
        <h2>权限管理</h2>
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
                    <label>部门:</label>
                <Select style="width:150px" v-model="department_keyword">
                    <Option v-for="item in department" :value="item.label" :key="item.value">{{ item.label }}</Option>
                </Select>
                </span>
                <Button type="info" icon="ios-search" @click="" style="float: right;width: 120px" @click="getUserList(1)">搜索</Button>
                <Button type="ghost" icon="refresh" @click="clear" style="float: right;width: 120px;margin-right: 10px">清空</Button>
            </div>

            <div class="search-2">
                <span class="search-item">
                    <label>姓名:</label> <Input v-model="name" placeholder="请输入姓名" style="width: 100px" />
                </span>
                <span class="search-item">
                    <label>团队名称:</label> <Input v-model="team_keyword" placeholder="请输入团队名称" style="width: 100px" />
                </span>
                <Button type="primary" icon="plus" style="float: right" @click="modal_new_right=true" >新增权限人员</Button>
            </div>
        </div>
        <div class="table">
            <Table :columns="columns" :data="tableData" :loading="loading"></Table>
        </div>
        <Page class="page" :total="page.total" @on-change="toPage" :page-size="15" show-elevator show-total></Page>
        <Modal
                v-model="modal_new_right"
                title="新增权限人员"
                @on-ok="j_newRight"
                @on-cancel="j_newRight_cancel">
            <Form class="form"  :model="right_items" :label-width="80">
                <FormItem label="部门:" prop="department_id" >
                    <Select  v-model="right_items.department_id" @on-change="getTeamList">
                        <Option v-for="item in department" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="团队:" prop="team_id">
                    <Select  v-model="right_items.team_id" :disabled="hasDepartment" placeholder="请先选择部门"  @on-change="getStaffs">
                        <Option v-for="item in team" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="人员:" prop="staffs">
                    <Select  :disabled="hasTeamList" placeholder="请先选择团队"  @on-change="getNewRightUserId" >
                        <Option v-for="item in staffs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
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
//    const ROOTPATH='/jixiao' //线上、开发
//    //const ROOTPATH='' //测试
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
                        key: 'name'
                    },
                    {
                        title: '电话',
                        key: 'phone',
                        minWidth:'110'
                    },
                    {
                        title: '工号',
                        key: 'company_card_no'
                    },
                    {
                        title: '所属部门',
                        key: 'department_name'
                    },{
                        title: '所属团队',
                        key: 'team_name'
                    },
                    {
                        title: '操作',
                        key: 'address',
                        minWidth:'180',
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
                                                path: "/editRight?user_id=" + params.row.user_id+"&user_name="+params.row.name
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
                modal_new_right:false,
                modal_delete:false,
                delete_id:'',
                hasDepartment:true,
                right_items:{
                    department_id:'',
                    team_id:'',
                },
                hasTeamList:true,
                department_id:'',
                team:[],
                staffs:[],
                newRightUserId:'',
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
                axios.get(ROOTPATH+'/admin/Department/GetDepartments')
                        .then(response => {
                            var data = response.data.data
                            var temp = []
                            for(var i in data){
                                console.log("id"+data[i].Department_id)
                                temp[i] = {
                                    value: data[i].Department_id,
                                    label:data[i].Department_name
                                }
                            }
                            _this.department = temp
                        })
                        .catch(err => {
                            return err
                        });
            },
            getTeamList:function (id) {
                var _this = this;
                this.department_id = id
                axios.get(ROOTPATH+'/admin/Team/GetTeamByDepartment',{
                    params:{
                        department_id:id
                    }
                }).then(response => {
                            var data = response.data.data
                            var temp = []
                            for(var i in data){
                                temp[i] = {
                                    value: data[i].Team_id,
                                    label:data[i].Team_name
                                }
                            }
                            _this.team = temp
                            _this.hasDepartment = false
                        })
                        .catch(err => {
                            return err
                        });
            },
            getStaffs:function (id) {
                var _this = this;
                axios.get(ROOTPATH+'/admin/Staff/GetStaffs',{
                    params:{
                        department_id:_this.department_id,
                        team_id:id
                    }
                }).then(response => {
                            var data = response.data.data
                            var temp = []
                            for(var i in data){
                                temp[i] = {
                                    value: data[i].user_id,
                                    label:data[i].name
                                }
                            }
                            _this.staffs = temp
                            _this.hasTeamList = false
                        })
                        .catch(err => {
                            return err
                        });
            },
            getNewRightUserId:function (id) {
                this.newRightUserId = id
            },
            getUserList:function (pageNo) {
                var _this = this;
                this.loading = true
                axios.get(ROOTPATH+'/admin/Rights/Get',{
                    params:{
                        page:pageNo,
                        company_card_no:_this.company_card_no,
                        department_keyword:_this.department_keyword,
                        team_keyword:_this.team_keyword,
                        phone:_this.phone,
                        name:_this.name,

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
                axios.get(ROOTPATH+'/admin/Rights/Del',{
                    params:{
                        user_id:_this.delete_id
                    }
                }).then(response => {
                            if(response.data.code == 0){
                                _this.clear()
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
                this.delete_id = "";
            },
            j_newRight_cancel:function () {
                this.hasDepartment = true;
                this.hasTeamList = true;
                this.right_items.department_id="";
                this.team = [];
                this.staffs = []
            },
            j_newRight:function () {
                var _this = this;
                axios.get(ROOTPATH+'/admin/Rights/Add',{
                    params:{
                        user_id:_this.newRightUserId
                    }
                }).then(response => {
                            if(response.data.code == 0){
                                _this.$Message.success("添加成功");
                            }else{
                                _this.$Message.success(response.data.msg);
                            }
                        })
                        .catch(err => {
                            return err
                        });
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