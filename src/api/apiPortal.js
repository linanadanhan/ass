import axios from '../api/http'
var qs = require('qs');

//分页查询主题信息
export const queryThemeDataTable = params => { return axios.get('/cos3-portal-manager/theme/queryThemeDataTable',{ params: params }).then(res => res.data); };
//根据主键获取主题信息
export const getThemeInfoById = params => { return axios.get('/cos3-portal-manager/theme/getThemeInfoById',{ params: params }).then(res => res.data); };
//校验主题代码是否已存在
export const isExitThemeCode = params => { return axios.get('/cos3-portal-manager/theme/isExitThemeCode',{ params: params }).then(res => res.data); };
//保存主题代码
export const saveTheme = params => {return axios.post('/cos3-portal-manager/theme/saveTheme',qs.stringify(params)).then(res => res.data); };
//删除主题
export const delTheme = params => { return axios.get('/cos3-portal-manager/theme/delTheme',{ params: params }).then(res => res.data); };
//导入主题包
export const importTheme = params => {return axios.post('/cos3-portal-manager/theme/importTheme',qs.stringify(params)).then(res => res.data); };
//查询所有主题信息
export const getThemeList = params => { return axios.get('/cos3-portal-manager/theme/getThemeList').then(res => res.data); };
//导出主题包
export const exportTheme = params => {return axios.post('/cos3-portal-manager/theme/exportTheme',qs.stringify(params)).then(res => res.data); };

//分页查询布局信息
export const queryLayoutDataTable = params => { return axios.get('/cos3-portal-manager/layout/queryLayoutDataTable',{ params: params }).then(res => res.data); };
//根据主键获取布局信息
export const getLayoutInfoById = params => { return axios.get('/cos3-portal-manager/layout/getLayoutInfoById',{ params: params }).then(res => res.data); };
//校验布局代码是否已存在
export const isExitLayoutCode = params => { return axios.get('/cos3-portal-manager/layout/isExitLayoutCode',{ params: params }).then(res => res.data); };
//保存布局代码
export const saveLayout = params => {return axios.post('/cos3-portal-manager/layout/saveLayout',qs.stringify(params)).then(res => res.data); };
//删除布局
export const delLayout = params => { return axios.get('/cos3-portal-manager/layout/delLayout',{ params: params }).then(res => res.data); };
//导入布局包
export const importLayout = params => {return axios.post('/cos3-portal-manager/layout/importLayout',qs.stringify(params)).then(res => res.data); };
//查询所有布局集合信息
export const getLayoutList = params => { return axios.get('/cos3-portal-manager/layout/getLayoutList').then(res => res.data); };
//导出布局包
export const exportLayout = params => {return axios.post('/cos3-portal-manager/layout/exportLayout',qs.stringify(params)).then(res => res.data); };

//分页查询widget信息
export const queryWidgetDataTable = params => { return axios.get('/cos3-portal-manager/widget/queryWidgetDataTable',{ params: params }).then(res => res.data); };
//根据主键获取widget信息
export const getWidgetInfoById = params => { return axios.get('/cos3-portal-manager/widget/getWidgetInfoById',{ params: params }).then(res => res.data); };
//校验widget代码是否已存在
export const isExitWidgetCode = params => { return axios.get('/cos3-portal-manager/widget/isExitWidgetCode',{ params: params }).then(res => res.data); };
//保存widget代码
export const saveWidget = params => {return axios.post('/cos3-portal-manager/widget/saveWidget',qs.stringify(params)).then(res => res.data); };
//删除widget
export const delWidget = params => { return axios.get('/cos3-portal-manager/widget/delWidget',{ params: params }).then(res => res.data); };
//导入widget包
export const importWidget = params => {return axios.post('/cos3-portal-manager/widget/importWidget',qs.stringify(params)).then(res => res.data); };
//查询所有widget集合信息
export const getWidgetList = params => { return axios.get('/cos3-portal-manager/widget/getWidgetList').then(res => res.data); };
//导出widget包
export const exportWidget = params => {return axios.post('/cos3-portal-manager/widget/exportWidget',qs.stringify(params)).then(res => res.data); };
//更新widget
export const udpWidgetCode = params => { return axios.get('/cos3-portal-manager/widget/udpWidgetCode',{ params: params }).then(res => res.data); };

//分页查询修饰器信息
export const queryDecorateDataTable = params => { return axios.get('/cos3-portal-manager/decorate/queryDecorateDataTable',{ params: params }).then(res => res.data); };
//根据主键获取修饰器信息
export const getDecorateInfoById = params => { return axios.get('/cos3-portal-manager/decorate/getDecorateInfoById',{ params: params }).then(res => res.data); };
//校验修饰器代码是否已存在
export const isExitDecorateCode = params => { return axios.get('/cos3-portal-manager/decorate/isExitDecorateCode',{ params: params }).then(res => res.data); };
//保存修饰器代码
export const saveDecorate = params => {return axios.post('/cos3-portal-manager/decorate/saveDecorate',qs.stringify(params)).then(res => res.data); };
//删除修饰器
export const delDecorate = params => { return axios.get('/cos3-portal-manager/decorate/delDecorate',{ params: params }).then(res => res.data); };
//导入修饰器包
export const importDecorate = params => {return axios.post('/cos3-portal-manager/decorate/importDecorate',qs.stringify(params)).then(res => res.data); };
//查询所有修饰器集合信息
export const getDecorateList = params => { return axios.get('/cos3-portal-manager/decorate/getDecorateList').then(res => res.data); };
//导出修饰器包
export const exportDecorate = params => {return axios.post('/cos3-portal-manager/decorate/exportDecorate',qs.stringify(params)).then(res => res.data); };

//分页查询站点信息
export const querySiteDataTable = params => { return axios.get('/cos3-portal-manager/site/querySiteDataTable',{ params: params }).then(res => res.data); };
//根据主键获取站点信息
export const getSiteInfoById = params => { return axios.get('/cos3-portal-manager/site/getSiteInfoById',{ params: params }).then(res => res.data); };
//校验站点代码是否已存在
export const isExitSiteCode = params => { return axios.get('/cos3-portal-manager/site/isExitSiteCode',{ params: params }).then(res => res.data); };
//保存站点代码
export const saveSite = params => {return axios.post('/cos3-portal-manager/site/saveSite',qs.stringify(params)).then(res => res.data); };
//删除站点
export const delSite = params => { return axios.get('/cos3-portal-manager/site/delSite',{ params: params }).then(res => res.data); };
//导入站点包
export const importSite = params => {return axios.post('/cos3-portal-manager/site/importSite',qs.stringify(params)).then(res => res.data); };
//查询所有站点信息
export const getAllSiteList = params => { return axios.get('/cos3-portal-manager/site/getAllSiteList').then(res => res.data); };
//导出站点包
export const exportSite = params => {return axios.post('/cos3-portal-manager/site/exportSite',qs.stringify(params)).then(res => res.data); };
// 复制站点
export const copySite = params => { return axios.get('/cos3-portal-manager/site/copySite',{ params: params }).then(res => res.data); }; 

//获取站点页面tree
export const getSitePageTree = params => { return axios.get('/cos3-portal-manager/page/getSitePageTree',{ params: params }).then(res => res.data); };
//根据主键ID获取页面信息
export const getSitePageInfoById = params => { return axios.get('/cos3-portal-manager/page/getSitePageInfoById',{ params: params }).then(res => res.data); };
//保存站点页面信息
export const saveSitePage = params => {return axios.post('/cos3-portal-manager/page/saveSitePage',qs.stringify(params)).then(res => res.data); };
//删除站点页面
export const delSitePage = params => { return axios.get('/cos3-portal-manager/page/delSitePage',{ params: params }).then(res => res.data); };
//校验页面path唯一性
export const isExitPagePath = params => { return axios.get('/cos3-portal-manager/page/isExitPagePath',{ params: params }).then(res => res.data); };
// 复制页面
export const copyPage = params => { return axios.get('/cos3-portal-manager/page/copyPage',{ params: params }).then(res => res.data); };

//查询页面widget配置信息
export const queryWidgetConfig = params => { return axios.get('/cos3-portal-manager/widgetConf/queryWidgetConfig',{ params: params }).then(res => res.data); };
//页面布局中widget是否已存在
//export const isExitWidgetCode = params => { return axios.get('/cos3-portal-manager/widgetConf/isExitWidgetCode',{ params: params }).then(res => res.data); };
//根据主键ID获取widget配置信息
export const getWidgetConfInfoById = params => { return axios.get('/cos3-portal-manager/widgetConf/getWidgetConfInfoById',{ params: params }).then(res => res.data); };
//保存widget 配置信息
export const saveWidgetConf = params => {return axios.post('/cos3-portal-manager/widgetConf/saveWidgetConf',qs.stringify(params)).then(res => res.data); };
//删除widget 配置信息
export const delWidgetConf = params => { return axios.get('/cos3-portal-manager/widgetConf/delWidgetConf',{ params: params }).then(res => res.data); };

//查询门户未授权的用户信息
export const getPortalHasNoAuthPerson = params => { return axios.post('/cos3-portal-manager/portalAuth/getHasNoAuthPerson',qs.stringify(params) ).then(res => res.data); };
//查询门户已授权的用户信息
export const getPortalHasAuthPerson = params => { return axios.post('/cos3-portal-manager/portalAuth/getHasAuthPerson',qs.stringify(params) ).then(res => res.data); };
//保存门户已授权用户信息
export const savePortalAuthUser = params => { return axios.post('/cos3-portal-manager/portalAuth/savePortalAuthUser',params ).then(res => res.data); };

//查询门户未授权的角色信息
export const getPortalHasNoAuthRole = params => { return axios.post('/cos3-portal-manager/portalAuth/getPortalHasNoAuthRole',qs.stringify(params) ).then(res => res.data); };
//查询门户已授权的角色信息
export const getPortalHasAuthRole = params => { return axios.post('/cos3-portal-manager/portalAuth/getPortalHasAuthRole',qs.stringify(params) ).then(res => res.data); };
//保存门户已授权角色信息
export const savePortalAuthRole = params => { return axios.post('/cos3-portal-manager/portalAuth/savePortalAuthRole',params ).then(res => res.data); };

//查询页面个性化widget配置信息
export const queryCustomWidgetConfig = params => { return axios.get('/cos3-portal-manager/customWidgetConf/queryCustomWidgetConfig',{ params: params }).then(res => res.data); };
//根据主键ID获取个性化widget配置信息
export const getCustomWidgetConfInfoById = params => { return axios.get('/cos3-portal-manager/customWidgetConf/getCustomWidgetConfInfoById',{ params: params }).then(res => res.data); };
//保存个性化widget 配置信息
export const saveCustomWidgetConf = params => {return axios.post('/cos3-portal-manager/customWidgetConf/saveCustomWidgetConf',qs.stringify(params)).then(res => res.data); };
//删除个性化widget 配置信息
export const delCustomWidgetConf = params => { return axios.get('/cos3-portal-manager/customWidgetConf/delCustomWidgetConf',{ params: params }).then(res => res.data); };

//获取布局json数据
export const getLayoutDatas = params => { return axios.get('/cos3-portal-manager/layout/getLayoutDatas',{ params: params }).then(res => res.data); };

//分页查询导入记录信息
export const queryImportData = params => { return axios.get('/cos3-portal-manager/import/queryImportData',{ params: params }).then(res => res.data); };
//导入包
export const importData = params => {return axios.post('/cos3-portal-manager/import/importData',qs.stringify(params)).then(res => res.data); };

//分页查询页面配置信息
export const querySitePageConf = params => { return axios.get('/cos3-portal-manager/pageConf/querySitePageConf',{ params: params }).then(res => res.data); };
//根据主键获取页面配置信息
export const getPageConfInfoById = params => { return axios.get('/cos3-portal-manager/pageConf/getPageConfInfoById',{ params: params }).then(res => res.data); };
//保存页面配置信息
export const saveSitePageConf = params => {return axios.post('/cos3-portal-manager/pageConf/saveSitePageConf',qs.stringify(params)).then(res => res.data); };
//删除页面配置信息
export const delSitePageConf = params => { return axios.get('/cos3-portal-manager/pageConf/delSitePageConf',{ params: params }).then(res => res.data); };

//查询已授权的站点信息
export const getAuthSiteInfo = params => { return axios.get('/cos3-portal-manager/portalAuth/getAuthSiteInfo',{ params: params }).then(res => res.data); };
//保存站点授权信息
export const saveSiteAuth = params => { return axios.get('/cos3-portal-manager/portalAuth/saveSiteAuth',{ params: params }).then(res => res.data); };
//查询已授权的页面信息
export const getAuthSitePageInfo = params => { return axios.get('/cos3-portal-manager/portalAuth/getAuthSitePageInfo',{ params: params }).then(res => res.data); };
//保存站点页面授权信息
export const saveSitePageAuth = params => { return axios.get('/cos3-portal-manager/portalAuth/saveSitePageAuth',{ params: params }).then(res => res.data); };

//拖动站点页面操作
export const saveSitePageTree = params => { return axios.post('/cos3-portal-manager/page/saveSitePageTree',qs.stringify(params)).then(res => res.data); };

//获取分类widget集合信息
export const getCatlogWidgetList = params => { return axios.get('/cos3-portal-manager/widget/getCatlogWidgetList').then(res => res.data); };

// 分页获取部件信息
export const queryComponentDataTable = params => { return axios.get('/cos3-portal-manager/component/queryComponentDataTable',{ params: params }).then(res => res.data); };
// 查询部件清单明细信息
export const queryComponentDetailList = params => { return axios.get('/cos3-portal-manager/component/queryComponentDetailList',{ params: params }).then(res => res.data); };
// 启用、停用部件
export const updateComponentStatus = params => { return axios.get('/cos3-portal-manager/component/updateStatus',{ params: params }).then(res => res.data); };
// 卸载组件
export const uninstallComponent = params => { return axios.get('/cos3-portal-manager/component/uninstall',{ params: params }).then(res => res.data); };

//分页查询帮助信息
export const querySitePageHelp = params => { return axios.get('/cos3-portal-manager/pageHelp/querySitePageHelp',{ params: params }).then(res => res.data); };
//根据主键获取帮助信息
export const getPageHelpInfoById = params => { return axios.get('/cos3-portal-manager/pageHelp/getPageHelpInfoById',{ params: params }).then(res => res.data); };
//保存帮助信息
export const saveSitePageHelp = params => {return axios.post('/cos3-portal-manager/pageHelp/saveSitePageHelp',qs.stringify(params)).then(res => res.data); };
//删除帮助信息
export const delSitePageHelp = params => { return axios.get('/cos3-portal-manager/pageHelp/delSitePageHelp',{ params: params }).then(res => res.data); };
//根据参数获取帮助信息
export const getPageHelpByParams = params => { return axios.get('/cos3-portal-manager/pageHelp/getPageHelpByParams',{ params: params }).then(res => res.data); };
//获取文件信息
export const getFileNodesById = params => { return axios.get('/cos3-file-manager/file/getFileNodesById',{ params: params }).then(res => res.data); };











