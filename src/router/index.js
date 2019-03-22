import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../assets/font/iconfont.css'
import axios from '../api/http'
var qs = require('qs')

//平台管理维护路由配置
import Login from '@/components/Login'
import forgetPassword from '@/components/forgetPassword'
import manageHome from '@/components/system/managehome'

import systemSet from '@/components/system/systemSet'
import orgManagement from '@/components/system/orgManagement'
import orgAuthorization from '@/components/system/orgAuthorization'
import positionManage from '@/components/system/positionManage'
import personManagement from '@/components/system/personManagement'
import roleManagement from '@/components/system/roleManagement'
import privilegeManagement from '@/components/system/privilegeManagement'
import parameterManagement from '@/components/system/parameterManagement'
import dataDictionary from '@/components/system/dataDictionary'
import dataTableManage from '@/components/system/dataTable'

import catalogManagement from '@/components/system/catalogManagement'
import themeManagement from '@/components/system/themeManagement'
import layoutManagement from '@/components/system/layoutManagement'
import widgetManagement from '@/components/system/widgetManagement'
import decorateManagement from '@/components/system/decorateManagement'
import siteManagement from '@/components/system/siteManagement'

import pageWidgetManage from '@/components/system/widgetConfigManagement'
import pageAuthManage from '@/components/system/pageAuthManagement'
import importManage from '@/components/system/importManagement'
import ssoManagement from '@/components/system/ssoManagement'

import dataSourceManage from '@/components/system/dataSourceManage'
import manualTablesManage from '@/components/system/manualTablesManage'
import dynamicViewManage from '@/components/system/dynamicViewManage'
import permissionItemManage from '@/components/system/permissionItemManage'
import permissionGroupManage from '@/components/system/permissionGroupManage'
import msgRegisteManage from '@/components/system/msgRegisteManage'
import userGroupManage from '@/components/system/userGroupManage'
import componentManage from '@/components/system/componentManage'

//平台示例-------------------------
import devDemo from '@/components/demo/main'
import devDemo1 from '@/components/demo/tabdemo'

import busyHome from '@/components/portal/busyhome'
import doesHome from '@/components/portal/doeshome'

//TODO:
Vue.use(Vuex)
Vue.use(Router)
Vue.use(ElementUI, {
	size: 'small'
})

const router = new Router({
	//mode: 'history',
	routes: [{
			path: '/',
			name: 'Login',
			component: Login
		},
		{
			path: '/forgetPassword',
			name: 'forgetPassword',
			component: forgetPassword,
		},
		//系统维护管理
		{
			path: '/manageHome',
			name: 'manageHome',
			component: manageHome,
			redirect: '/manageHome/systemSet',
			children: [{
				path: 'systemSet',
				component: systemSet,
				name: 'systemSet',
				meta: {
					requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
				},
				children: [{
						path: 'orgManagement',
						component: orgManagement,
						name: 'orgManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'orgAuthorization',
						component: orgAuthorization,
						name: 'orgAuthorization',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'positionManage',
						component: positionManage,
						name: 'positionManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'personManagement',
						component: personManagement,
						name: 'personManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'roleManagement',
						component: roleManagement,
						name: 'roleManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'privilegeManagement',
						component: privilegeManagement,
						name: 'privilegeManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'parameterManagement',
						component: parameterManagement,
						name: 'parameterManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'dataDictionary',
						component: dataDictionary,
						name: 'dataDictionary',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'dataTableManage',
						component: dataTableManage,
						name: 'dataTableManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'catalogManagement',
						component: catalogManagement,
						name: 'catalogManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'themeManagement',
						component: themeManagement,
						name: 'themeManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'layoutManagement',
						component: layoutManagement,
						name: 'layoutManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'widgetManagement',
						component: widgetManagement,
						name: 'widgetManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'decorateManagement',
						component: decorateManagement,
						name: 'decorateManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'siteManagement',
						component: siteManagement,
						name: 'siteManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'pageWidgetManage',
						component: pageWidgetManage,
						name: 'pageWidgetManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'pageAuthManage',
						component: pageAuthManage,
						name: 'pageAuthManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'importManage',
						component: importManage,
						name: 'importManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'ssoManagement',
						component: ssoManagement,
						name: 'ssoManagement',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'dataSourceManage',
						component: dataSourceManage,
						name: 'dataSourceManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'manualTablesManage',
						component: manualTablesManage,
						name: 'manualTablesManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'dynamicViewManage',
						component: dynamicViewManage,
						name: 'dynamicViewManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'permissionItemManage',
						component: permissionItemManage,
						name: 'permissionItemManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'permissionGroupManage',
						component: permissionGroupManage,
						name: 'permissionGroupManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'msgRegisteManage',
						component: msgRegisteManage,
						name: 'msgRegisteManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'componentManage',
						component: componentManage,
						name: 'componentManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'demo',
						component: devDemo,
						name: 'devDemo',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'demo1',
						component: devDemo1,
						name: 'devDemo1',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
					{
						path: 'userGroupManage',
						component: userGroupManage,
						name: 'userGroupManage',
						meta: {
							requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						}
					},
				]
			}]
		},
		//业务首页操作-------------------
		{
			path: '/mhgl',
			name: 'busyHome',
			component: busyHome,
			children: [{
				path: 'does',
				name: 'doesHome',
				component: doesHome
			}]
		}
	]
})
//  路由地址拦截
router.beforeEach((to, from, next) => {
	console.info(from,to)
	if(to.meta.requireAuth && to.query.token) { // 判断请求路径中是否存在token，若存在则再次请求后台实现单点登录
		let params = {jwt_auth: to.query.token}
		axios.post('/login', qs.stringify(params)).then(function(res){
			console.info(res.data.data);
			sessionStorage.setItem('uName', res.data.data.name)
			sessionStorage.setItem('uId', res.data.data.id)
			// 查询菜单权限
			axios.get('/getAdminSecurity').then(function(secRes){
				sessionStorage.setItem('securityUrl', JSON.stringify(secRes.data));
				console.log('securityUrl:', JSON.stringify(secRes.data));
				next({ path: to.path })
			})
		});
	} else {
		next()
	}
})
export default router