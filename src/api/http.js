import axios from 'axios';

axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

// http response 拦截器
axios.interceptors.response.use(
  response => {
    //session失效后，返回主页面
    try {
		  //data有可能不是合法的JSON字符串，便会产生异常
		  var rtnObj = JSON.parse(response.request.response)
		  if (rtnObj.hasOwnProperty('status') && rtnObj.status == '-1') {
      	location.replace('/');
      }
		} catch (e) {
		}
//    if ("http://localhost:8004/login" == response.request.responseURL) {
//    location.replace('/');
//    }
    return response;
  },
  error => {
    console.info(error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 跳转到登录页面
          location.replace('/');
      }
    }
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  });
export default axios;
