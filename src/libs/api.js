/**
 * Created by sindlly on 2018-04-08.
 */
import axios from 'axios';
import qs from 'qs';
import store from '../store';

// export const BASE_ROOT = "http://www.wechat.com/admin"
//
// axios.defaults.timeout = 20000;
// axios.defaults.baseURL = BASE_ROOT;
// axios.defaults.headers = "Access-Control-Allow-Origin:www.wechat.com/admin"

// axios.interceptors.request.use(
//     config =>{
//         config.data = JSON.stringify(config.data)
//         config.headers = {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//         return config
//     },
//     err =>{
//         return Promise.reject(err);
//     }
// )
// const ROOTPATH='/jixiao' //线上、开发
//const ROOTPATH='' //测试
export default {
    /**
     * 请求例子
     */
    
    login: function (params) {
        return axios.get(ROOTPATH+'/admin/Login/Post', {
            params:params
        }).then(response => {
                return response
            })
            .catch(err => {
                return err
            });
    },
    getDashboard:function () {
        return axios.get(ROOTPATH+"/admin/Home/Get")
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            });
    }
}