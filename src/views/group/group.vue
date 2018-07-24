/**
* Created by sindlly on 2018-06-04.
*/
<template>
<div class="main-container">
    <h2>部门管理</h2>
    <hr>
    <div class="search">
        <label>部门:</label> <Input v-model="searchData" placeholder="请输入部门名称" style="width: 300px" />
        <Button type="info" icon="ios-search" @click="getDepart">搜索</Button>
        <Button type="ghost" icon="refresh" @click="clear">清空</Button>
        <Button type="primary" icon="plus" style="float: right"  @click="newDepart">新增部门</Button>
    </div>
    <div class="table">
        <Table :columns="columns" :data="tableData" :loading="loading"></Table>
    </div>
    <Modal
            v-model="modal"
            :title="modal_title"
            :mask-closable = 'false'
            @on-ok="j_ok"
            @on-cancel="j_cancel">
        <label>部门名称:</label> <Input v-model="department_name" placeholder="请输入部门名称" style="width: 300px" />
        <Upload
                ref="upload"
                name="excel_tpl"
                action="/jixiao/admin/Department/Edit"
                :show-upload-list = 'false'
                :data='uploadData'
                :before-upload="handleUpload"
                :format="['xlsx']"
                :on-success="handleUploadSuccess"
                :on-format-error="handleFormatError"
        >
            <div style="margin-top: 10px;" v-if="fileName">excel模板:<span style="color: #0b97c4;">{{fileName}}</span></div>
            <Button v-if="department_id" type="ghost" icon="ios-cloud-upload-outline" style="margin-top: 10px;margin-left: 53px">上传execl模板</Button>
        </Upload>
    </Modal>
    <Modal
            v-model="modal_delete"
            title="确认删除"
            @on-ok="j_delete"
            @on-cancel="j_delete_cancel">
            <p>确认删除此部门?</p>
    </Modal>
    <Modal
            v-model="modal_check"
            title="上传校验"
            @on-ok="j_check_ok">
        <h3>系统信息与模板未匹配项:</h3>
        <h3 style="margin: 10px 0">新增人员:</h3>
        <div class="checkItem">
            <div  v-for="item in new_person_list">
                <span>{{item.company_card_no}}</span>--<span>{{item.name}}</span>--<span>{{item.team_name}}</span>
            </div>
        </div>
        <br><hr>
        <h3 style="margin: 10px 0">离岗人员:</h3>
        <div class="checkItem">
            <div class="checkItem" v-for="item in out_person_list">
                <span>{{item.company_card_no}}</span>--<span>{{item.name}}</span>--<span>{{item.team_name}}</span>
            </div>
        </div>
        <br><hr>
        <h3 style="margin: 10px 0">信息不合:</h3>
        <div class="checkItem">
            <div v-for="item in error_person_list">
                <span>{{item.company_card_no}}</span>--<span>{{item.name}}</span>--<span>{{item.team_name}}</span>
            </div>
        </div>

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
                modal:false,
                loading:false,
                modal_title:"新增部门",
                modal_delete:false,
                modal_check:false,
                delete_id:"",
                searchData:'',
                department_name:'',
                department_id:"",
                columns: [
                    {
                        title: 'ID',
                        key: 'department_id'
                    },
                    {
                        title: '部门名称',
                        key: 'department_name'
                    },
                    {
                        title: '团队数量',
                        key: 'team_total'
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
                                        this.edit(params.row.department_id,params.row.department_name,params.row.excel_tpl_name);
                                        /*this.$router.push({
                                            path: "/groupEdit?" + params.row.department_id+"/"+params.row.department_name
                                        })*/
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: ()=> {
                                        this.$router.push({
                                            path: "/team/index/" + params.row.department_id+"/"+params.row.department_name
                                        })
                                    }
                                }
                            }, '团队管理'),
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on:{
                                    click:()=>{
                                        this.modal_delete = true;
                                        this.delete_id = params.row.department_id
                                    }
                                }
                            }, '删除')
                        ]);
                        }
                    }
                ],
                tableData:[
                    {
                        Department_id:1,
                        Department_name:'开放平台部',
                        Department_num:6

                    }
                ],
                uploadData:{},
                file:null,
                fileName:'',
                new_person_num:0,
                new_person_list:[],
                out_person_num:0,
                out_person_list:[],
                error_person_num:0,
                error_person_list:[],
            }
        },
        mounted(){
            this.getDepart()
        },
        component:{

        },
        methods: {
            newDepart:function () {
                this.modal = true;
                this.modal_title ="新增部门"
            },
            getDepart:function () {
                var _this = this;
                this.loading = true
                axios.get(ROOTPATH+'/admin/Department/Get',{params:{
                    keyword:_this.searchData,
                }})
                .then(response => {
                    _this.tableData = response.data.data.List
                    _this.loading = false
                })
                .catch(err => {
                    return err
                });
            },
            clear:function () {
                this.searchData = "";
                this.getDepart()
            },
            edit:function (id,name,fileName) {
                this.modal_title = "编辑部门"
                this.modal = true;
                this.department_id = id;
                this.department_name = name;
                this.fileName = fileName
            },
            handleUpload (file) {
                this.file = file;
                this.fileName = file.name
                return false;
            },
            handleFormatError:function () {
                this.$Message.warning("仅支持.xlsx文件");
            },
            handleUploadSuccess:function (res) {
                this.modal_check = true;
                this.new_person_list = res.data.new_users||[]
                this.out_person_list = res.data.outset_users||[]
                this.error_person_list = res.data.err_info_users||[]
//                this.$Message.info("编辑成功");
//                this.getDepart()
            },
            j_ok:function () {
                var _this = this;
                var url = ""
                if(_this.department_id){
                    if(_this.file){
                        var temp = {
                            department_id :this.department_id,
                            department_name : this.department_name,
                        }
                        this.uploadData = temp
                        setTimeout(function () {
                            _this.$refs.upload.post(_this.file)
                        },20)
                    }else{
                        url = "/admin/Department/Edit"
                        axios.get(ROOTPATH+url,{params:{
                                    department_name:_this.department_name,
                                    department_id:_this.department_id
                                }})
                                .then(response => {
                                    _this.department_name = "";
                                    _this.department_id = "";
                                    if(response.data.code == 0){
                                        _this.modal = false;
//                                        _this.getDepart()
//                                        this.$Message.info("修改成功");
                                    }else{
                                        this.$Message.error(response.data.msg);
                                    }
                                })
                                .catch(err => {
                                    return err
                                });
                    }
                }else{
                    url = "/admin/Department/Add"
                    axios.get(ROOTPATH+url,{params:{
                                department_name:_this.department_name,
                                department_id:_this.department_id
                            }})
                            .then(response => {
                                _this.department_name = "";
                                _this.department_id = "";
                                if(response.data.code == 0){
                                    _this.modal = false;
                                    _this.getDepart();
                                    this.$Message.info("新建成功");
                                }else{
                                    this.$Message.error(response.data.msg);
                                }
                            })
                            .catch(err => {
                                return err
                            });
                }

            },
            j_check_ok:function () {
                this.modal_check = false;
                this.getDepart();
                this.$Message.info("修改成功");
            },
            j_cancel:function () {
                this.department_name = "";
                this.department_id = "";
                this.file=null;
                this.fileName = ""
            },
            j_delete:function () {
                var _this = this;
                axios.get(ROOTPATH+"/admin/Department/Delete",{params:{
                            department_id: _this.delete_id
                        }})
                        .then(response => {
                            console.log("code:"+response.data.code)
                            if(response.data.code == 0){
                                _this.getDepart();
                                _this.delete_id = 0;
                                _this.$Message.success("删除成功");
                            }else{
                                _this.$Message.error(response.data.msg);
                            }
                        })
                        .catch(err => {
                            return err
                        });
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
    .checkItem{
        max-height: 300px;
        overflow-y: auto;
    }
</style>