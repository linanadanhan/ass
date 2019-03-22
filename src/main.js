// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import 'babel-polyfill'

import $ from 'jquery'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		count: 0,
		adminleftnavnum: "1" //管理后台左侧导航
	},
	mutations: {
		increment(state) {
			state.count++
		}
	},
	actions: {

	}
});

//自定义指令cosSecurity，当指令值与用户权限不匹配时，隐藏资源
Vue.directive('cosSecurity', {
	bind: function(el, binding) {
		console.info(sessionStorage.getItem('securityUrl'))
		if(sessionStorage.getItem('securityUrl') == null || sessionStorage.getItem('securityUrl') == '{}') {
			el.style.display = 'none';
		} else {
			var obj = JSON.parse(sessionStorage.getItem('securityUrl'));
			var val = binding.value;
			var url = Object.keys(obj);
			var containKey = '';
			for(var i = 0; i < url.length; i++) {
				if(url[i] == val || url[i] == '/**') {
					containKey = url[i];
					break;
				}
			}

			if(containKey == '') {
				el.style.display = 'none';
			} else {
				if(containKey != '/**' && !obj[containKey]) {
					el.style.display = 'none';
				}
			}
		}

	}
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})