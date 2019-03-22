import axios from '../api/http'
var qs = require('qs');

//数据表运用demo
export const dataTableSaveDemo = params => { return axios.post('/cos3-portal-manager/table/t_test/save', params ).then(res => res.data); };
export const queryDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/queryPage',{params:params}).then(res => res.data); };
export const delDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/delete',{params:params}).then(res => res.data); };
export const loadDataTableDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/get',{params:params}).then(res => res.data); };
export const dataTableGetFiledDemo = params => { return axios.get('/cos3-portal-manager/table/t_test/getfield', {} ).then(res => res.data); };

export const saveOrUpdate = params => { return axios.post('/cos3-portal-manager/table/dev_demo/save', params ).then(res => res.data); };
export const getAll = params => { return axios.get('/cos3-portal-manager/table/dev_demo/queryAll',{params:params}).then(res => res.data); };
export const del = params => { return axios.get('/cos3-portal-manager/table/dev_demo/delete',{params:params}).then(res => res.data); };
export const getData = params => { return axios.get('/cos3-portal-manager/table/dev_demo/get',{params:params}).then(res => res.data); };

export const getDicItemsByKey = params => { return axios.get('/cos3-portal-manager/dictionary/getDicItemListByDicKey',{params:params}).then(res => res.data); };