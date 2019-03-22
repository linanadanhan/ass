import axios from '../api/http'
var qs = require('qs');

//数据表管理
export const dataTableSave = params => { return axios.post('/cos3-portal-manager/table/tbl_tables/save', params ).then(res => res.data); };
export const queryDataTable = params => { return axios.get('/cos3-portal-manager/table/tbl_tables/queryPage',{params:params}).then(res => res.data); };
export const delDataTable = params => { return axios.get('/cos3-portal-manager/table/tbl_tables/delete',{params:params}).then(res => res.data); };
export const loadDataTable = params => { return axios.get('/cos3-portal-manager/table/tbl_tables/get',{params:params}).then(res => res.data); };
export const queryCatalogs = params => { return axios.get('/cos3-portal-manager/table/queryCatalogs').then(res => res.data); };

//数据表运用demo
export const dataTableSaveDemo = params => { return axios.post('/cos3-portal-manager/table/tbl_tables/save', params ).then(res => res.data); };
export const queryDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/tbl_tables/queryPage',{params:params}).then(res => res.data); };
export const delDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/tbl_tables/delete',{params:params}).then(res => res.data); };
export const loadDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/tbl_tables/get',{params:params}).then(res => res.data); };
export const dataTableGetFiledDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/getfield', {} ).then(res => res.data); };


//
//export const dataTableSaveDemo = params => { return axios.post('/cos3-portal-manager/table/t_test/save', params ).then(res => res.data); };
//export const queryDataTable = params => { return axios.get('/cos3-portal-manager/table/t_test/queryPage',{ map: params }).then(res => res.data); };
//export const delDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/delete',params).then(res => res.data); };
//export const loadDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/get',params).then(res => res.data); };
//export const dataTableGetFiledDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/getfield', {} ).then(res => res.data); };
