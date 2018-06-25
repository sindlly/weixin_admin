/**
* Created by sindlly on 2018-06-08.
*/
<template>
    <div class="main-container">
        <h2><router-link to="/right/right">权限管理</router-link>/{{name}}权限编辑</h2>
        <hr>
        <div class="content">
            <div class="part-1">
                <div class="part-title">该员工可以考核的人:</div>
                <div class="part-item">
                    <label>部门:</label>
                    <div class="select">
                    <Select  v-model="w_department_id" @on-change="getTeamsList" :label-in-value="true"	>
                        <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </div>
                    <Button type="info" title="添加一个部门" style="margin-left: 10px" @click="w_addDepartment"><Icon type="plus-round" style="margin-right:10px "></Icon>加入</Button>
                </div>
                <div class="part-item">
                    <label>团队:</label>
                    <div class="select">
                    <Select  v-model="w_team_id" filterable placeholder="请先选择部门" :disabled="hasDepartment_write" @on-change="getStaffList" :label-in-value="true">
                        <Option v-for="item in w_teamList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </div>
                    <Button type="info" title="添加一个团队" style="margin-left: 10px" @click="w_addTeam"><Icon type="plus-round" style="margin-right:10px "></Icon>加入</Button>
                </div>
                <div class="part-item">
                    <label>个人:</label>
                    <div class="select">
                    <Select  v-model="w_user_id" filterable placeholder="请先选择团队" :disabled="hasTeam_write" :label-in-value="true" @on-change="getUserName">
                        <Option v-for="item in w_staffList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </div>
                    <Button type="info" title="添加个人" style="margin-left: 10px" @click="w_addUser"><Icon type="plus-round" style="margin-right:10px "></Icon>加入</Button>
                </div>
                <div class="display-area">
                    <div v-for="(department,index) in write_departments">
                        <div class="user-item">
                            <span class="department-name" >{{department.department_name}}</span>
                            <a  @click='w_delete(1,index)'><Icon type="close-circled" class="delete"></Icon></a>
                        </div>
                    </div>
                    <div v-for="(team,index) in write_teams">
                        <div class="user-item">
                            <span class="department-name">{{team.department_name}}</span>-<span class="team-name">{{team.team_name}}</span>
                            <a  @click='w_delete(2,index)'><Icon type="close-circled" class="delete"></Icon></a>
                        </div>
                    </div>
                    <div v-for="(user,index) in write_users">
                        <div class="user-item">
                            <span class="department-name">{{user.department_name}}</span>-<span class="team-name">{{user.team_name}}</span>-<span class="user-name">{{user.name}}</span>
                            <a  @click='w_delete(3,index)'><Icon type="close-circled" class="delete"></Icon></a>
                        </div>

                    </div>
                </div>
                <!--<Button type="primary" long class="submit" @click="w_submit">提交</Button>-->
            </div>
            <div class="part-2">
                <div class="part-title">该员工可以查看的人:</div>
                <div class="part-item">
                    <label>部门:</label>
                    <div class="select">
                        <Select  v-model="r_department_id" @on-change="r_getTeamsList" :label-in-value="true"	>
                            <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <Button type="info" title="添加一个部门" style="margin-left: 10px" @click="r_addDepartment"><Icon type="plus-round" style="margin-right:10px "></Icon>加入</Button>
                </div>
                <div class="part-item">
                    <label>团队:</label>
                    <div class="select">
                        <Select  v-model="r_team_id" filterable placeholder="请先选择部门" :disabled="hasDepartment_read" @on-change="r_getStaffList" :label-in-value="true">
                            <Option v-for="item in r_teamList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <Button type="info" title="添加一个团队" style="margin-left: 10px" @click="r_addTeam"><Icon type="plus-round" style="margin-right:10px "></Icon>加入</Button>
                </div>
                <div class="part-item">
                    <label>个人:</label>
                    <div class="select">
                        <Select  v-model="r_user_id" filterable placeholder="请先选择团队" :disabled="hasTeam_read" :label-in-value="true" @on-change="r_getUserName">
                            <Option v-for="item in r_staffList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <Button type="info" title="添加个人" style="margin-left: 10px" @click="r_addUser"><Icon type="plus-round" style="margin-right:10px "></Icon>加入</Button>
                </div>
                <div class="display-area">
                    <div v-for="(department,index) in read_departments">
                        <div class="user-item">
                            <span class="department-name" >{{department.department_name}}</span>
                            <a  @click='r_delete(1,index)'><Icon type="close-circled" class="delete"></Icon></a>
                        </div>
                    </div>
                    <div v-for="(team,index) in read_teams">
                        <div class="user-item">
                            <span class="department-name">{{team.department_name}}</span>-<span class="team-name">{{team.team_name}}</span>
                            <a  @click='r_delete(2,index)'><Icon type="close-circled" class="delete"></Icon></a>
                        </div>
                    </div>
                    <div v-for="(user,index) in read_users">
                        <div class="user-item">
                            <span class="department-name">{{user.department_name}}</span>-<span class="team-name">{{user.team_name}}</span>-<span class="user-name">{{user.name}}</span>
                            <a  @click='r_delete(3,index)'><Icon type="close-circled" class="delete"></Icon></a>
                        </div>

                    </div>
                </div>
                <!--<Button type="primary" long class="submit" @click="r_submit">提交</Button>-->
            </div>
        </div>
        <hr>
        <div style="text-align: center">
            <Button type="primary"  class="submit" @click="submit">提交</Button>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
    export default{
        data(){
            return {
                name:'',
                departmentList:[],
                w_department_id:'',
                w_department_name:'',
                w_team_id:'',
                w_team_name:'',
                w_user_id:'',
                w_user_name:'',
                w_teamList:[],
                w_staffList:[],
                r_department_id:'',
                r_department_name:'',
                r_team_id:'',
                r_team_name:'',
                r_user_id:'',
                r_user_name:'',
                r_teamList:[],
                r_staffList:[],
//                hasDepartment_read:true,
                write_departments:[],
                write_users:[],
                write_teams:[],
                read_departments:[],
                read_users:[],
                read_teams:[],
            }
        },
        computed:{
            hasDepartment_write:function () {
                if(this.w_teamList.length == 0){
                    return true
                }else return false
            },
            hasTeam_write:function () {
                if(this.w_staffList.length == 0){
                    return true
                }else return false
            },
            hasDepartment_read:function () {
                if(this.r_teamList.length == 0){
                    return true
                }else return false
            },
            hasTeam_read:function () {
                if(this.r_staffList.length == 0){
                    return true
                }else return false
            },
        },
        mounted(){
            this.getRights();
            this.name = this.$route.query.user_name;
            this.getDepartmentList()
        },
        methods: {
            getRights:function () {
                var _this = this;
                axios.get('/admin/Rights/GetRights',{
                    params:{
                        user_id: _this.$route.query.user_id
                    }
                }).then(response => {
                    _this.write_users = response.data.data.write_rights.write_users||[]
                    _this.write_departments = response.data.data.write_rights.write_departments||[]
                    _this.write_teams = response.data.data.write_rights.write_teams||[]
                    _this.read_users = response.data.data.read_rights.read_users||[]
                    _this.read_departments = response.data.data.read_rights.read_departments||[]
                    _this.read_teams = response.data.data.read_rights.read_teams||[]
            })
                .catch(err => {
                    return err
                });
            },
            getDepartmentList:function () {
                var _this = this;
                axios.get('/admin/Department/GetDepartments')
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
                            _this.departmentList = temp
                        })
                        .catch(err => {
                            return err
                        });
            },
            getTeamsList:function (e) {
                this.w_department_name = e.label
                this.getTeamById(e.value,"write")

            },
            r_getTeamsList:function (e) {
                this.r_department_name = e.label
                this.getTeamById(e.value,"read")
            },
            getStaffList:function (e) {
                if(e.value){
                    this.w_team_name = e.label
                    this.getStaffById(this.w_department_id,this.w_team_id,"write");
                }

            },
            r_getStaffList:function (e) {
                if(e.value){
                    this.r_team_name = e.label
                    this.getStaffById(this.r_department_id,this.r_team_id,"read");
                }
            },
            getUserName:function (e) {
                this.w_user_name = e.label.split("-")[0]
            },
            getTeamById:function (id,writeOrread) {
                var _this = this;
                axios.get('/admin/Team/GetTeamByDepartment?department_id='+id)
                        .then(response => {
                            var data = response.data.data
                            var temp = []
                            if(data.length != 0){
                                console.log("len"+data.length)
                                for(var i in data){
                                    temp[i] = {
                                        value: data[i].Team_id,
                                        label:data[i].Team_name
                                    }
                                }
                                if(writeOrread == "write"){
                                    _this.w_teamList = temp
                                }else{
                                    _this.r_teamList = temp
                                }
                            }else {
                                if(writeOrread == "write"){
                                    _this.w_teamList = [{
                                        value:'',
                                        label:'暂无团队'
                                    }]
                                    _this.w_staffList=[{
                                        value:'',
                                        label:'暂无个人'
                                    }]
                                }else{
                                    _this.r_teamList = [{
                                        value:'',
                                        label:'暂无团队'
                                    }]
                                    _this.r_staffList=[{
                                        value:'',
                                        label:'暂无个人'
                                    }]
                                }
                            }
                        })
                        .catch(err => {
                            return err
                        });
            },
            getStaffById:function (department_id,team_id,writeOrread) {
                var _this = this;
                axios.get('/admin/Staff/GetStaffs',{
                    params:{
                        department_id:department_id,
                        team_id:team_id
                    }
                })
                        .then(response => {
                            var data = response.data.data
                            var temp = []
                            for(var i in data){
                                temp[i] = {
                                    value: data[i].user_id,
                                    label:data[i].name+"-"+data[i].team_name+"-"+data[i].department_name
                                }
                            }
                            if(writeOrread == "write"){
                                _this.w_staffList = temp||[]
                            }else{
                                _this.r_staffList = temp||[]
                            }

                        })
                        .catch(err => {
                            return err
                        });
            },
            w_addDepartment:function () {
                if(!this.w_department_id){
                    this.$Message.warning('请选择部门');
                }else{
                    var temp = this.write_departments
                    var tempData = {
                        department_id : this.w_department_id,
                        department_name : this.w_department_name,
                    }
                    //检验是否有重复的部门
                    var hasSame = true
                    for(var i in temp){
                        if(temp[i].department_id ==tempData.department_id){
                            this.$Message.warning('请勿添加相同的部门');
                            hasSame = false
                        }
                    }
                    if(hasSame){
                        temp.push(tempData)
                        this.write_departments = temp
                    }
                }
            },
            w_addTeam:function () {
                if(!this.w_team_id){
                    this.$Message.warning('请选择团队');
                }else {
                    var temp = this.write_teams
                    var tempData = {
                        department_name : this.w_department_name,
                        team_id : this.w_team_id,
                        team_name : this.w_team_name,
                    }
                    //检验是否有重复的部门
                    var hasSame = true
                    for(var i in temp){
                        if(temp[i].team_id ==tempData.team_id){
                            this.$Message.warning('请勿添加相同的团队');
                            hasSame = false
                        }
                    }
                    if(hasSame){
                        temp.push(tempData)
                        this.write_teams = temp
                    }
                }

            },
            w_addUser:function () {
                if(!this.w_user_id){
                    this.$Message.warning('请选择人员');
                }else{
                    var temp = this.write_users
                    var tempData = {
                        department_name : this.w_department_name,
                        team_name : this.w_team_name,
                        user_id : this.w_user_id,
                        name : this.w_user_name,
                    }
                    //检验是否有重复的部门
                    var hasSame = true
                    for(var i in temp){
                        if(temp[i].user_id ==tempData.user_id){
                            this.$Message.warning('请勿添加相同的人员');
                            hasSame = false
                        }
                    }
                    if(hasSame){
                        temp.push(tempData)
                        this.write_users = temp
                    }
                }

            },
            w_delete:function (type,index) {
                //type 1:部门，2：团队，3：个人
                console.log("ind:"+index)
                if(type==1){
                    var temp = this.write_departments;
                    temp.splice(index,1);
                    this.write_departments = temp
                }
                if(type==2){
                    var temp = this.write_teams;
                    temp.splice(index,1);
                    this.write_teams = temp
                }
                if(type==3){
                    var temp = this.write_users;
                    temp.splice(index,1);
                    this.write_users = temp
                }
            },
            w_submit:function () {
                var _this = this;
                var write_department_ids = [];
                for(var i in this.write_departments){
                    write_department_ids[i] = this.write_departments[i].department_id
                }
                var write_team_ids = [];
                for(var i in this.write_teams){
                    write_team_ids[i] = this.write_teams[i].team_id
                }
                var write_ids = [];
                for(var i in this.write_users){
                    write_ids[i] = this.write_users[i].user_id
                }
                axios.get('/admin/Rights/SetRights',{
                    params:{
                        user_id: _this.$route.query.user_id,
                        write_department_ids:write_department_ids.join(","),
                        write_team_ids:write_team_ids.join(",") ,
                        write_ids:write_ids.join(","),
                    }
                }).then(response => {
                    if(response.data.code == 0){
                        location.reload()
                    }else{
                        this.$Message.error(response.data.msg);
                    }
                }).catch(err => {
                    return err
                });
            },

            r_addDepartment:function () {
                if(!this.r_department_id){
                    this.$Message.warning('请选择部门');
                }else{
                    var temp = this.read_departments
                    var tempData = {
                        department_id : this.r_department_id,
                        department_name : this.r_department_name,
                    }
                    //检验是否有重复的部门
                    var hasSame = true
                    for(var i in temp){
                        if(temp[i].department_id ==tempData.department_id){
                            this.$Message.warning('请勿添加相同的部门');
                            hasSame = false
                        }
                    }
                    if(hasSame){
                        temp.push(tempData)
                        this.read_departments = temp
                    }
                }
            },
            r_addTeam:function () {
                if(!this.r_team_id){
                    this.$Message.warning('请选择团队');
                }else {
                    var temp = this.read_teams
                    var tempData = {
                        department_name : this.r_department_name,
                        team_id : this.r_team_id,
                        team_name : this.r_team_name,
                    }
                    //检验是否有重复的部门
                    var hasSame = true
                    for(var i in temp){
                        if(temp[i].team_id ==tempData.team_id){
                            this.$Message.warning('请勿添加相同的团队');
                            hasSame = false
                        }
                    }
                    if(hasSame){
                        temp.push(tempData)
                        this.read_teams = temp
                    }
                }

            },
            r_addUser:function () {
                if(!this.r_user_id){
                    this.$Message.warning('请选择人员');
                }else{
                    var temp = this.read_users
                    var tempData = {
                        department_name : this.r_department_name,
                        team_name : this.r_team_name,
                        user_id : this.r_user_id,
                        name : this.r_user_name,
                    }
                    //检验是否有重复的部门
                    var hasSame = true
                    for(var i in temp){
                        if(temp[i].user_id ==tempData.user_id){
                            this.$Message.warning('请勿添加相同的人员');
                            hasSame = false
                        }
                    }
                    if(hasSame){
                        temp.push(tempData)
                        this.read_users = temp
                    }
                }

            },
            r_getUserName:function (e) {
                this.r_user_name = e.label.split("-")[0]
            },
            r_delete:function (type,index) {
                //type 1:部门，2：团队，3：个人
                console.log("ind:"+index)
                if(type==1){
                    var temp = this.read_departments;
                    temp.splice(index,1);
                    this.read_departments = temp
                }
                if(type==2){
                    var temp = this.read_teams;
                    temp.splice(index,1);
                    this.read_teams = temp
                }
                if(type==3){
                    var temp = this.read_users;
                    temp.splice(index,1);
                    this.read_users = temp
                }
            },
            submit:function () {
                var _this = this;
                var write_department_ids = [];
                for(var i in this.write_departments){
                    write_department_ids[i] = this.write_departments[i].department_id
                }
                var write_team_ids = [];
                for(var i in this.write_teams){
                    write_team_ids[i] = this.write_teams[i].team_id
                }
                var write_ids = [];
                for(var i in this.write_users){
                    write_ids[i] = this.write_users[i].user_id
                }
                var read_department_ids = [];
                for(var i in this.read_departments){
                    read_department_ids[i] = this.read_departments[i].department_id
                }
                var read_team_ids = [];
                for(var i in this.read_teams){
                    read_team_ids[i] = this.read_teams[i].team_id
                }
                var read_ids = [];
                for(var i in this.read_users){
                    read_ids[i] = this.read_users[i].user_id
                }
                axios.get('/admin/Rights/SetRights',{
                    params:{
                        user_id: _this.$route.query.user_id,
                        write_department_ids:write_department_ids.join(","),
                        write_team_ids:write_team_ids.join(",") ,
                        write_ids:write_ids.join(","),
                        read_department_ids:read_department_ids.join(","),
                        read_team_ids:read_team_ids.join(",") ,
                        read_ids:read_ids.join(","),
                    }
                }).then(response => {
                        if(response.data.code == 0){
                            location.reload()
                        }else{
                            this.$Message.error(response.data.msg);
                        }
                }).catch(err => {
                    return err
                });
            },
        }
    }
</script>
<style scoped style="less">
    .main-container{
        width: 100%;
        min-width: 980px;
        height: 100%;
        padding: 15px;
        background: #fff;
    }
    .content{
        width: 100%;
        height: 100%;
        margin:20px auto;
        padding-bottom: 70px;
        display: flex;
        justify-content: space-around;
    }
    .part-1,.part-2{
        /*width: 40%;*/
        height: 500px;
        font-size: 16px;


    }
    .part-title{
        margin-bottom: 15px;
    }
    .part-item{
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 420px;
        margin: 15px 0;
    }
    label{
        width: 50px;
    }
    .select{
        width: 300px;
    }
    .display-area{
        width: 420px;
        height: 400px;
        padding: 5px;
        overflow-y: auto;
        /*max-height: 500px;*/
        background: #eee;
        font-size: 14px;
        line-height: 30px;
    }
    .delete{
        float: right;
        margin-right: 10px;
        line-height: 30px;
        color: #ed3f14;
    }
    .delete:hover{
        color: #ed7051;
        cursor: pointer;
    }
    .user-item:hover{
        background: #ddd;
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
    .submit{
        width: 120px;
        margin: 20px 0;
        line-height: 30px;
    }

</style>