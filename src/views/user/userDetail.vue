/**
* Created by sindlly on 2018-06-07.
*/
<template>
    <div>
        <div class="main-container">
            <h2><router-link to="/user/user">人员管理</router-link>/人员信息详情</h2>
        </div>
        <div class="info-container">
            <div class="info-title">
                <h2><Icon type="person"></Icon>员工个人信息</h2>
                <router-link :to="editUser" class="toEdit"><Icon type="edit"></Icon>编辑信息</router-link>
            </div>
            <div class="info-detail">
                <div class="item">
                    姓名：{{info.Name}}
                </div>
                <div class="item">
                    电话：{{info.Phone}}
                </div>
                <div class="item">
                    工号：{{info.Company_card_no}}
                </div>
            </div>
            <div class="info-detail">
                <div class="item">
                    邮箱：{{info.Email}}
                </div>
                <div class="item">
                    部门：{{info.Department_name}}
                </div>
                <div class="item">
                    团队：{{info.Team_name}}
                </div>
            </div>
            <div class="info-detail">

                <div class="item">
                    入职时间：{{info.Entry_date}}
                </div>
                <div class="item">
                    入职状态：<span v-if="info.Working_status == 2">在职</span><span v-else>离职</span>
                </div>
            </div>
        </div>
        <div class="right-container">
            <div class="info-title">
                <h2><Icon type="person"></Icon>员工权限信息</h2>
                <router-link :to="editUserRight" class="toEdit" :disabled="hasRight"><Icon type="edit"></Icon>修改个人权限</router-link>
            </div>
            <div class="right-area">
                <div class="right-item">
                    <div class="right-title">该员工可以被下列人员考核:</div>
                    <div class="user-area">
                        <div class="user" v-for="item in be_write_users">
                            <span class="department-name">
                                {{item.Department_name}}
                            </span>-
                            <span class="team-name">
                                {{item.Team_name}}
                            </span>-
                            <span class="user-name">
                                {{item.Name}}
                            </span>
                        </div>
                    </div>

                </div>
                <div class="right-item">
                    <div class="right-title">该员工可以被下列人员查看:</div>
                    <div class="user-area">
                        <div class="user" v-for="item in be_read_users">
                            <span class="department-name">
                                {{item.Department_name}}
                            </span>-
                            <span class="team-name">
                                {{item.Team_name}}
                            </span>-
                            <span class="user-name">
                                {{item.Name}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-area">
                <div class="right-item">
                    <div class="right-title">该员工可以考核的人(共{{write_rights_num}}人):</div>
                    <div class="user-area">
                        <div class="user" v-for="item in write_rights">
                            <span class="department-name">
                                {{item.department_name}}
                            </span>-
                            <span class="team-name">
                                {{item.team_name}}
                            </span>-
                            <span class="user-name">
                                {{item.name}}
                            </span>
                        </div>
                    </div>

                </div>
                <div class="right-item">
                    <div class="right-title">该员工可以查看的人(共{{read_rights_num}}人):</div>
                    <div class="user-area">
                        <div class="user" v-for="item in read_rights">
                            <span class="department-name">
                                {{item.department_name}}
                            </span>-
                            <span class="team-name">
                                {{item.team_name}}
                            </span>-
                            <span class="user-name">
                                {{item.name}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
//    const ROOTPATH='/jixiao' //线上、开发
//    //const ROOTPATH='' //测试
    export default{
        data(){
            return {
                info:{},
                editUser:'',
                editUserRight:'',
                hasRight: true,
                be_write_users:[],
                be_read_users:[],
                write_rights:[],
                write_rights_num:0,
                read_rights:[],
                read_rights_num:0,
            }
        },
        mounted(){
            this.editUser="/newUser?user_id="+this.$route.query.user_id;
            this.getUserInfo(this.$route.query.user_id);
        },
        methods: {
            getUserInfo:function (user_id) {
                var _this = this;
                axios.get(ROOTPATH+'/admin/Staff/Detail?user_id='+user_id)
                        .then(response => {
                            _this.info = response.data.data.user_info;
                            _this.be_write_users = response.data.data.be_write_users||[]
                            _this.be_read_users = response.data.data.be_read_users||[]
                            _this.write_rights = response.data.data.write_rights.write_users||[]
                            _this.read_rights = response.data.data.read_rights.read_users||[]
                            _this.write_rights_num = _this.write_rights.length
                            _this.read_rights_num = _this.read_rights.length
//                            _this.editUserRight= "/123"
                            if(response.data.data.write_rights.write_users.length==0){
                                //无权限
                            }else{
                                //有权限，可跳转
                                _this.hasRight = false;
                                _this.editUserRight="/editRight?user_id="+_this.$route.query.user_id+"&user_name="+response.data.data.user_info.Name;
                            }


                })
                .catch(err => {
                    return err
                });
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
    .info-container{
        width: 100%;
        height: 200px;
        padding: 15px;
        background: #fff;
        margin-top: 20px;
    }
    .right-container{
        width: 100%;
        height: 600px;
        padding: 15px;
        background: #fff;
        margin-top: 20px;
    }
    .info-detail{
        width: 300px;
        float: left;
        font-size: 14px;
        margin-top: 10px;
    }
    .item{
        line-height: 40px;
    }
    .toEdit{
        float: right;
        font-size: 14px;
        margin-top: -23px;
    }
    .right-area{
        display: flex;
        flex-direction: row;
        /*justify-content: space-around;*/
        margin-top: 20px;
    }
    .right-item{
        width: 40%;
        margin-right: 100px;
    }
    .user-area{
        min-height: 100px;
        max-height: 300px;
        background: #f7f7f7;
        overflow-y:auto;
        padding: 5px 0;
    }
    .right-title{
        font-size: 16px;
        margin-bottom: 5px;
    }
    .user{
        line-height: 25px;
        font-size: 14px;
    }
    .user-name{
        color: #57a3f3;
    }
    .team-name{
        color: #24bc9a;
    }
    .department-name{
        color: #f5a623;
    }
</style>