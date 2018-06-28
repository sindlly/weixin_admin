/**
* Created by sindlly on 2018-06-06.
*/
<template>
    <div class="main-container">
        <h2><router-link to="/user/user">人员管理</router-link>/{{title}}</h2>
        <hr>
        <Form class="form" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="姓名" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入姓名"/>
            </FormItem>
            <FormItem label="电话" prop="phone">
                <Input v-model="formValidate.phone" placeholder="请输入电话"/>
            </FormItem>
            <FormItem label="工号" prop="company_card_no">
                <Input v-model="formValidate.company_card_no" placeholder="请输入工号"/>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <Input v-model="formValidate.email" type="email" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem label="部门" prop="department_id">
                <Select  v-model="formValidate.department_id" @on-change="getTeamList">
                    <Option v-for="item in department" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="团队" prop="team_id">
                <Select  v-model="formValidate.team_id" :disabled="hasDepartment" placeholder="请先选择部门">
                    <Option v-for="item in team" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="入职日期" prop="entry_date">
                <DatePicker type="date"  placeholder="请选择日期" v-model="time" @on-change="getTime"></DatePicker>
            </FormItem>
            <FormItem label="入职状态" prop="working_status">
                <Select v-model="formValidate.working_status">
                    <Option v-for="item in working_status_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="离职日期" prop="out_date" v-if="formValidate.working_status == 3">
                <DatePicker type="date"  placeholder="请选择日期" v-model="out_date" @on-change="getOutTime"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit('formValidate')">提交</Button>
                <!--<Button type="ghost" style="margin-left: 8px">取消</Button>-->
            </FormItem>
        </Form>
    </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
//    const ROOTPATH='/jixiao' //线上、开发
//    //const ROOTPATH='' //测试
    export default{
        data(){
            return {
                formValidate: {
                    name: '',
                    phone:'',
                    company_card_no:'',
                    email:'',
                    department_id:"",
                    team_id:"",
                    entry_date:'',
                    out_date:'',
                    working_status:''
                },
                time:'',//展示用
                out_date:'',
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '电话不能为空', trigger: 'blur' },
                    ],
                    company_card_no: [
                        { required: true, message: '工号不能为空', trigger: 'blur' },
                        {validator(rule, value, callback, source, options) {
                            var errors = [];
                            if (!/039\d{5,5}$/.test(value)) {
                                callback('工号格式不对.');
                            }
                            callback(errors);
                        }}
                    ],
                    department_id: [
                        { required: true, message: '部门不能为空', }
                    ],
                    team_id: [
                        { required: true, message: '团队不能为空', }
                    ],
                    working_status: [
                        { required: true, message: '入职状态不能为空', trigger: 'change' }
                    ],

                },
                department:[],
                team:[],
                hasDepartment:true,
                working_status_list:[
                    {
                        value:'2',
                        label:'在职'
                    },
                    {
                        value:'3',
                        label:'离职'
                    }
                ],
                title:'',
            }
        },
        mounted(){
            this.getDepartmentList()
            if(this.$route.query.user_id){
                //获取基本信息
                this.title= "编辑人员信息"
                this.getUserInfo(this.$route.query.user_id);
            }else{
                this.title = "新增人员"
            }

        },
        methods: {
            getDepartmentList:function () {
                var _this = this;
                axios.get(ROOTPATH+'/admin/Department/GetDepartments')
                        .then(response => {
                            var data = response.data.data
                            var temp = []
                            for(var i in data){
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
            getTime:function (e) {
              this.formValidate.entry_date= e
            },
            getOutTime:function (e) {
                this.formValidate.out_date= e
            },
            getUserInfo:function (user_id) {
                var _this = this;
                axios.get(ROOTPATH+'/admin/Staff/Detail?user_id='+user_id)
                        .then(response => {
                            var info = response.data.data.user_info
                            this.formValidate.name = info.Name
                            this.formValidate.phone = info.Phone
                            this.formValidate.company_card_no = info.Company_card_no
                            this.formValidate.department_id = parseInt(info.Department_id)
                            this.getTeamList(info.Department_id)
                            this.formValidate.team_id = parseInt(info.Team_id)
                            this.time = info.Entry_date
                            this.out_date = info.Out_date
                            this.formValidate.working_status = info.Working_status
                        })
                        .catch(err => {
                            return err
                        });
            },
            submit (name) {
                var _this= this
                var url = "";
                if(this.$route.query.user_id){
                    //编辑
                    url = '/admin/Staff/Edit?user_id='+this.$route.query.user_id
                }else{
                    //新增
                    url ='/admin/Staff/Add'
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var _this = this;
                        axios.get(ROOTPATH+url,{
                            params:_this.formValidate
                        }).then(response => {
                                    this.$Message.success(response.data.msg);
                                    if(response.data.code == 0){
                                        this.$router.push({
                                            path: "/user/user"
                                        })
                                    }

                                })
                                .catch(err => {
                                    return err
                                });

                    } else {

                    }
                })
            },
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
    .form{
        width: 500px;
        margin: 50px auto;
    }
</style>