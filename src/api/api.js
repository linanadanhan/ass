import axios from '../api/http'

var qs = require('qs');

//登陆login
export const login = params => { return axios.post('/login',qs.stringify(params)).then(res => res.data); };
//登出
export const logout = params => { return axios.post('/logout').then(res => res.data); };
//修改密码
export const modifyPassword = params => { return axios.post('/cos3-portal-manager/personnel/modifyPassword',params).then(res => res.data); };
//绑定手机号
export const bindPhone = params => { return axios.post('/cos3-portal-manager/personnel/bindPhone',qs.stringify(params)).then(res => res.data); };
//获取前端功能权限
export const getAdminSecurity = params => { return axios.get('/getAdminSecurity').then(res => res.data); };
//短信验证，密码找回
export const sendCode = params => { return axios.post('/cos3-sms-service/sms/sendCode',qs.stringify(params)).then(res => res.data); };
//根据短信验证码重置密码
export const resetPasswordAction = params => { return axios.post('/cos3-portal-manager/personnel/update/resetPassword',qs.stringify(params)).then(res => res.data); };

//获取机构tree数据
export const getTreeData = params => { return axios.get('/cos3-portal-manager/org/select/getTreeByCode',{ params: params }).then(res => res.data); };
//获取行政区划列表
export const getAllAreaTree = params => { return axios.get('/cos3-portal-manager/area/select/getAllAreaTree').then(res => res.data); };
//获取行政区划列表
export const getAreaCascader = params => { return axios.get('/cos3-portal-manager/area/select/getAreaCascader',{ params: params }).then(res => res.data); };
//获取行政区划列表
export const getAreaByCode = params => { return axios.get('/cos3-portal-manager/area/select/getAreaByCode',{ params: params }).then(res => res.data); };

//获取组织机构信息
export const getOrgInfo = params => { return axios.get('/cos3-portal-manager/org/select/getPageByCode',{ params: params }).then(res => res.data); };
//保存组织机构
export const saveOrg = params => {return axios.post('/cos3-portal-manager/org/save',qs.stringify(params)).then(res => res.data); };
//获取组织机构信息
export const getCascadeByParentId = params => { return axios.get('/cos3-portal-manager/org/select/getCascadeByParentId',{ params: params }).then(res => res.data); };
//新增机构后添加对应的权限
export const addGrant = params => {return axios.post('/cos3-portal-manager/org/addGrant',qs.stringify(params)).then(res => res.data); };


//获取某一笔组织机构信息
export const getOrgById = params => { return axios.get('/cos3-portal-manager/org/select/getOneById',{ params: params }).then(res => res.data); };
//删除组织机构
export const delOrgById = params => { return axios.get('/cos3-portal-manager/org/delete/delOrgById',{ params: params }).then(res => res.data); };
//组织机构导入
export const importOrg = params => {return axios.post('/cos3-portal-manager/org/import/importOrg',qs.stringify(params)).then(res => res.data); };
//是否存在机构代码
export const isExitOrgCode = params => { return axios.get('/cos3-portal-manager/org/isExitOrgCode',{ params: params }).then(res => res.data); };
//=========================机构授权=======================
//根据选择维度得到所有授权机构树
export const getOrgTreeByDimension = params => { return axios.get('/cos3-portal-manager/orgGrant/getOrgTreeByDimension',{ params: params }).then(res => res.data); };
//通过code获取身份信息
export const getIdentityInfoListByOrgCode = params => { return axios.get('/cos3-portal-manager/orgGrant/getIdentityInfoListByOrgCode',{ params: params }).then(res => res.data); };
//身份与相同维度机构关联保存
export const saveDataGrant = params => { return axios.post('/cos3-portal-manager/orgGrant/saveDataGrant',qs.stringify(params)).then(res => res.data); };
//根据身份查找关联机构的ids
export const getOrgIdsByIdentity = params => { return axios.get('/cos3-portal-manager/orgGrant/getOrgIdsByIdentity',{ params: params }).then(res => res.data); };
//查询已经授权的人员
export const getHasConnectIdentity = params => { return axios.post('/cos3-portal-manager/positionManage/connectd/getHasConnectIdentity',qs.stringify(params) ).then(res => res.data); };
//查询未授权的人员
export const getHasNoConnectIdentity = params => { return axios.post('/cos3-portal-manager/positionManage/connectd/getHasNoConnectIdentity',qs.stringify(params) ).then(res => res.data); };
//保存--关联人员
export const saveOrgIdentityInfo = params => { return axios.post('/cos3-portal-manager/positionManage/connectd/saveOrgIdentityInfo',params ).then(res => res.data); };

//=========================职位管理=======================
//根据当前人员得到授权管理的机构树
export const getOrgTreeByPerson = params => { return axios.get('/cos3-portal-manager/positionManage/getOrgTreeByPerson').then(res => res.data); };
//根据机构id得到职位
export const getPositionPageByOrgId = params => { return axios.get('/cos3-portal-manager/positionManage/getPositionPageByOrgId',{ params: params }).then(res => res.data); };
//根据机构id得到职位
export const getPositionListByOrgId = params => { return axios.get('/cos3-portal-manager/positionManage/getPositionListByOrgId',{ params: params }).then(res => res.data); };
//机构关联岗位生成职位
export const orgConnectPost = params => { return axios.post('/cos3-portal-manager/positionManage/orgConnectPost',qs.stringify(params)).then(res => res.data); };
//得到机构关联的岗位信息
export const getPostByOrg = params => { return axios.get('/cos3-portal-manager/positionManage/getPostByOrg',{ params: params }).then(res => res.data); };
//修改职位排序
export const modifyPositionSort = params => { return axios.post('/cos3-portal-manager/positionManage/modifyPositionSort', params).then(res => res.data); };
//删除职位与人员的关联，身份信息
export const deleteIdentityInfo = params => { return axios.post('/cos3-portal-manager/positionManage/deleteIdentityInfo', qs.stringify(params)).then(res => res.data); };
//根据职位得到关联的身份信息
export const getIdentityInfoByPosition = params => { return axios.get('/cos3-portal-manager/positionManage/getIdentityInfoByPosition',{ params: params }).then(res => res.data); };
//根据用户和机构得到关联的身份信息
export const getIdentityInfoByPersonAndOrg = params => { return axios.get('/cos3-portal-manager/positionManage/getIdentityInfoByPersonAndOrg',{ params: params }).then(res => res.data); };
//根据选择维度得到机构集合
export const getOrgListByDimension = params => { return axios.get('/cos3-portal-manager/positionManage/getOrgListByDimension',{ params: params }).then(res => res.data); };
//根据机构得到身份集合
export const getIdentityListByOrg = params => { return axios.get('/cos3-portal-manager/positionManage/getIdentityListByOrg',{ params: params }).then(res => res.data); };
//根据机构得到职位集合
export const getPositionListByOrg = params => { return axios.get('/cos3-portal-manager/positionManage/getPositionListByOrg',{ params: params }).then(res => res.data); };
//根据职位得到职位管理关系
export const getPositionManage = params => { return axios.get('/cos3-portal-manager/positionManage/getPositionManage',{ params: params }).then(res => res.data); };
//保存职位管理关系
export const savePositionManage = params => { return axios.post('/cos3-portal-manager/positionManage/savePositionManage',params).then(res => res.data); };
//模糊查询用户
export const vagueQueryPerson = params => { return axios.get('/cos3-portal-manager/positionManage/vagueQueryPerson',{ params: params }).then(res => res.data); };
//关联职位与人员
export const positionConnectPerson = params => { return axios.post('/cos3-portal-manager/positionManage/positionConnectPerson',qs.stringify(params)).then(res => res.data); };
//关联人员与职位
export const personConnectPosition = params => { return axios.post('/cos3-portal-manager/positionManage/personConnectPosition',qs.stringify(params)).then(res => res.data); };



//查询机构下的用户信息
export const personnelPageList= params => { return axios.get('/cos3-portal-manager/personnel/select/getPageList',{ params: params }).then(res => res.data); };
export const personnelList = params => { return axios.get('/cos3-portal-manager/personnel/select/getList',{ params: params }).then(res => res.data); };
//校验登录名是否唯一
export const validateLoginName = params => {return axios.get('/cos3-portal-manager/personnel/add/validateLoginName',{ params: params }).then(res => res.data); };
//校验手机号是否唯一
export const validatePhone = params => { return axios.get('/cos3-portal-manager/personnel/add/validatePhone',{ params: params }).then(res => res.data); };
//保存用户信息
export const savePersonnel = params => {return axios.post('/cos3-portal-manager/personnel/add/save',qs.stringify(params)).then(res => res.data); };
//删除人员
export const delPersonnelById = params => { return axios.get('/cos3-portal-manager/personnel/delete/delById',{ params: params }).then(res => res.data); };
//修改人员状态
export const updatePersonnelStatus = params => {return axios.get('/cos3-portal-manager/personnel/update/updateStatus',{ params: params }).then(res => res.data); };
//得到单个对象
export const getPersonnelById = params => { return axios.get('/cos3-portal-manager/personnel/select/getOneById',{ params: params }).then(res => res.data); };
//导入人员信息
export const importPersonnel = params => {return axios.post('/cos3-portal-manager/personnel/import/importPersonnel',qs.stringify(params)).then(res => res.data); };
//移动至
export const movePersonnel = params => { return axios.get('/cos3-portal-manager/personnel/move/movePersonnel',{ params: params }).then(res => res.data); };

//--------------------------------------人员关联角色
//得到未授权的角色分类--得到登录人创建的角色或登录人可转授的角色
export const getHasNoConnectRoleTypes = params => {return axios.get('/cos3-portal-manager/personnel/connect/getHasNoConnectRoleTypes',{}).then(res => res.data); };
//得到未授权的角色--得到登录人创建的角色或登录人可转授的角色
export const getHasNoConnectRole = params => {return axios.get('/cos3-portal-manager/personnel/connect/getHasNoConnectRole',{ params: params }).then(res => res.data); };
//得到已经授权的角色
export const getHasConnectRole = params => {return axios.get('/cos3-portal-manager/personnel/connect/getHasConnectRole',{ params: params }).then(res => res.data); };
//保存关联
export const saveRolePersonnel = params => {return axios.post('/cos3-portal-manager/personnel/connect/addRolePersonnel',params).then(res => res.data); };
//清空关联角色
export const deleteConnectRole = params => {return axios.post('/cos3-portal-manager/personnel/connect/deleteConnectRole',qs.stringify(params)).then(res => res.data); };
//保存--关联人员
export const personnelConnectRoles = params => { return axios.post('/cos3-portal-manager/personnel/personnelConnectRoles',qs.stringify(params) ).then(res => res.data); };

//===============================角色管理
//查询左侧角色分类
export const getRoleTypes = params => { return axios.get('/cos3-portal-manager/role/select/getTypes',{}).then(res => res.data); };
//根据角色分类查询角色列表
export const getPageByAreaCode = params => { return axios.get('/cos3-portal-manager/role/select/getPage',{ params: params}).then(res => res.data); };
//角色管理-新增角色
export const saveRole = params => { return axios.post('/cos3-portal-manager/role/add/save', params ).then(res => res.data); };
//角色管理-删除角色
export const deleteRoleById = params => { return axios.post('/cos3-portal-manager/role/delete/deleteById',qs.stringify(params) ).then(res => res.data); };
export const batchDeleteByIds = params => { return axios.post('/cos3-portal-manager/role/delete/batchDeleteByIds',qs.stringify(params) ).then(res => res.data); };
//角色管理-更新状态
export const updateRoleStatus = params => { return axios.post('/cos3-portal-manager/role/update/updateStatus',qs.stringify(params) ).then(res => res.data); };
//新增时验证代码唯一
export const validateRoleCode = params => { return axios.get('/cos3-portal-manager/role/add/validateCode',{ params: params}).then(res => res.data); };
//查询所有角色
export const getAllRoles = params => { return axios.get('/cos3-portal-manager/role/select/getAllRoles').then(res => res.data); };

//--------------------------------------角色关联人员
//得到左侧的组织机构树
export const getTreeDataByConnect = params => { return axios.get('/cos3-portal-manager/role/connect/getTreeByCode').then(res => res.data); };
//查询已经授权的人员
export const getHasConnectPerson = params => { return axios.post('/cos3-portal-manager/role/connectd/getHasConnectPerson',qs.stringify(params) ).then(res => res.data); };
//查询未授权的人员
export const getHasNoConnectPerson = params => { return axios.post('/cos3-portal-manager/role/connectd/getHasNoConnectPerson',qs.stringify(params) ).then(res => res.data); };
//保存--关联人员
export const saveConnectRolePersonnel = params => { return axios.post('/cos3-portal-manager/role/connectd/saveRolePersonnel',params ).then(res => res.data); };

//--------------------------------------角色关联权限
//查询左侧权限分类
export const getPerssionTypesByConnect = params => { return axios.get('/cos3-portal-manager/role/connectd/getPermissionTypes',{params:params}).then(res => res.data); };
//根据分类查询未授权的权限
export const getHasNoConnectPermission = params => { return axios.get('/cos3-portal-manager/role/connectd/getHasNoConnectPermission',{params:params}).then(res => res.data); };
//根据分类查询已授权的权限
export const getHasConnectPermission = params => { return axios.get('/cos3-portal-manager/role/connectd/getHasConnectPermission',{params:params}).then(res => res.data); };
//保存角色关联权限集合
//export const saveRolePermissions = params => { return axios.post('/cos3-portal-manager/role/connectd/saveRolePermission',qs.stringify(params)).then(res => res.data); };
export const saveRolePermissions = params => { return axios.post('/cos3-portal-manager/role/connectd/saveRolePermission',params).then(res => res.data); };
export const saveRolePermissionByIds = params => { return axios.post('/cos3-portal-manager/role/connectd/saveRolePermissionByIds',qs.stringify(params) ).then(res => res.data); };

//===============================权限管理
//权限管理-查找全部权限
export const getAllPermission = params => { return axios.get('/cos3-portal-manager/permission/select/getAllPermission').then(res => res.data); };
//权限管理-列表左边的权限分类
export const getPermissionTypes = params => { return axios.get('/cos3-portal-manager/permission/select/getTypes',{ params: params }).then(res => res.data); };
//根据分类查询未授权的角色
export const getHasNoConnectRole1 = params => { return axios.get('/cos3-portal-manager/permission/connectd/getHasNoConnectRole',{params:params}).then(res => res.data); };
//根据分类查询已授权的角色
export const getHasConnectRole1 = params => { return axios.get('/cos3-portal-manager/permission/connectd/getHasConnectRole',{params:params}).then(res => res.data); };
//保存角色关联权限集合
export const saveRolePermissions1 = params => { return axios.post('/cos3-portal-manager/permission/connectd/saveRolePermission',params).then(res => res.data); };

//权限管理-列表
export const getPermissionPageByType = params => { return axios.get('/cos3-portal-manager/permission/select/getPageByType',{ params: params}).then(res => res.data); };
//权限管理-保存
export const savePermission = params => { return axios.post('/cos3-portal-manager/permission/save', params ).then(res => res.data); };
//权限管理-删除
export const deletePermissionById = params => { return axios.post('/cos3-portal-manager/permission/delete/deleteById', qs.stringify(params) ).then(res => res.data); };
//验证code唯一--还没联调
export const validatePermissionCode = params => { return axios.get('/cos3-portal-manager/permission/add/validateCode', { params: params} ).then(res => res.data); };

//参数管理-得到分类列表
export const getParameterTypes = params => { return axios.get('/cos3-portal-manager/parameter/select/getTypes').then(res => res.data); };
//参数管理-新增和修改
export const saveAndUpdateParameter = params => { return axios.post('/cos3-portal-manager/parameter/saveParm',params).then(res => res.data); };
//参数管理-根据分类名询此参数
export const getParameterPageByType = params => { return axios.get('/cos3-portal-manager/parameter/select/getPageByType',{ params: params }).then(res => res.data); };
//参数管理-更新状态
export const updateParameterStatus = params => { return axios.post('/cos3-portal-manager/parameter/update/updateStatus', qs.stringify(params) ).then(res => res.data); };
//参数管理-删除
export const deleteParameterById = params => { return axios.post('/cos3-portal-manager/parameter/removeParm/'+params).then(res => res.data); };
//参数管理-验证参数键是否重复
export const validateParameterKey = params => { return axios.get('/cos3-portal-manager/parameter/validparmkey',{ params: params }).then(res => res.data); };

//根据参数key获取参数值
export const getParmByKey = params => { return axios.get('/cos3-portal-manager/parameter/getParmByKey',{ params: params }).then(res => res.data); };

//============================
//数据字典管理-得到分类列表
export const getDictionaryTypes = params => { return axios.get('/cos3-portal-manager/dictionary/select/getTypes').then(res => res.data); };
//数据字典管理-根据分类名询此参数
export const getDictionaryListByType = params => { return axios.get('/cos3-portal-manager/dictionary/select/getListByType',{ params: params }).then(res => res.data); };
//数据字典管理-新增和修改
export const saveDictionary = params => { return axios.post('/cos3-portal-manager/dictionary/saveDicData',params).then(res => res.data); };
//数据字典管理-新增和修改
export const saveDictionaryItem = params => { return axios.post('/cos3-portal-manager/dictionary/saveDicItem',params).then(res => res.data); };
//数据字典管理-删除字典，同时删除该字典下的数据项
export const destroyDictionary = params => { return axios.post('/cos3-portal-manager/dictionary/removeDictionary/'+params).then(res => res.data); };
//数据字典管理-删除数据字典项
export const destoryDictionaryItem = params => { return axios.post('/cos3-portal-manager/dictionary/destoryDicItem/'+params).then(res => res.data); };
//数据字典管理-根据name模糊查询数据字典
export const getDictionaryListByName = params => { return axios.get('/cos3-portal-manager/dictionary/select/getListByName',{ params: params }).then(res => res.data); };
//数据字典管理-根据value模糊查询数据字典项
export const getDicItemByValue = params => { return axios.get('/cos3-portal-manager/dictionary/getDicItemByValue',{ params: params }).then(res => res.data); };
//数据字典管理-根据key查询指定字典下字典项列表
export const getDicItemListByDicKey = params => { return axios.get('/cos3-portal-manager/dictionary/getDicItemListByDicKey',  { params: params }).then(res => res.data); };
//参数管理-验证参数键是否重复
export const validateDictionaryKey = params => { return axios.get('/cos3-portal-manager/dictionary/validparmkey',{ params: params }).then(res => res.data); };
//参数管理-验证数据字典项参数键是否重复
export const validaDictionaryItemValue = params => { return axios.get('/cos3-portal-manager/dictionary/validaDictionaryItemValue',{ params: params }).then(res => res.data); };

//查询分类科目信息
export const queryCatalogDataTable = params => { return axios.get('/cos3-portal-manager/catalog/queryCatalogDataTable',{ params: params }).then(res => res.data); };
//根据主键获取分类科目信息
export const getCatalogInfoById = params => { return axios.get('/cos3-portal-manager/catalog/getCatalogInfoById',{ params: params }).then(res => res.data); };
//校验科目标识是否唯一
export const isExitRootKey = params => { return axios.get('/cos3-portal-manager/catalog/isExitRootKey',{ params: params }).then(res => res.data); };
//保存分类科目信息
export const saveCatalog = params => {return axios.post('/cos3-portal-manager/catalog/saveCatalog',qs.stringify(params)).then(res => res.data); };
//删除分类科目信息
export const delCatalog = params => { return axios.get('/cos3-portal-manager/catalog/delCatalog',{ params: params }).then(res => res.data); };

//获取人员所属机构信息
export const getOrgInfoByUserId = params => { return axios.get('/cos3-portal-manager/org/getOrgInfoByUserId',{ params: params }).then(res => res.data); };

//批量删除人员
export const batchDelPersonnel = params => { return axios.get('/cos3-portal-manager/personnel/batchDelPersonnel',{ params: params }).then(res => res.data); };

//=======================外部接入管理

//查询所有外部接入系统
export const ssofindAll = params => { return axios.get('/cos3-portal-manager/sso/findAll',{ params: params }).then(res => res.data); };
//保存外部接入系统
export const ssoSave = params => {return axios.post('/cos3-portal-manager/sso/save',qs.stringify(params)).then(res => res.data); };
//删除外部接入系统
export const ssoDeleteById = params => { return axios.get('/cos3-portal-manager/sso/deleteById',{ params: params }).then(res => res.data); };
//是否需要导入映射关系
export const isNeedImport = params => { return axios.get('/' + params.ssoAdapter + '/isNeedImport').then(res => res.data); };
//对照用户导出
export const exportUser = params => {return axios.post('/' + params + '/exportUser').then(res => res.data); };
//对照用户导入
export const importUser = params => {return axios.post('/' + params.ssoAdapter + '/importUser',qs.stringify(params)).then(res => res.data); };
//关联系统与对应API权限
export const relationServerAndApi = params => { return axios.get('/cos3-portal-manager/sso/relationServerAndApi',{ params: params }).then(res => res.data); };
//根据系统得到相应jwtToken
export const getJwtFromServerCode = params => { return axios.get('/cos3-portal-manager/sso/getJwtFromServerCode',{ params: params }).then(res => res.data); };
//从系统取对应API权限
export const getApiFromServerCode = params => { return axios.get('/cos3-portal-manager/sso/getApiFromServerCode',{ params: params }).then(res => res.data); };

//查询数据源列表数据
export const queryDataSourceTable = params => { return axios.get('/cos3-portal-manager/dataSource/queryDataSourceTable',{ params: params }).then(res => res.data); };
//保存数据源
export const saveDataSource = params => {return axios.post('/cos3-portal-manager/dataSource/saveDataSource',qs.stringify(params)).then(res => res.data); };
//删除数据源
export const delDataSource = params => { return axios.get('/cos3-portal-manager/table/tbl_datasources/delete',{ params: params }).then(res => res.data); };
//根据主键获取单笔数据源信息
export const getDataSourceById = params => { return axios.get('/cos3-portal-manager/table/tbl_datasources/get',{ params: params }).then(res => res.data); };
//判断数据源编码是否已存在
export const isExitDataSourceName = params => { return axios.get('/cos3-portal-manager/table/tbl_datasources/unique',{ params: params }).then(res => res.data); };
//获取所有数据源数据
export const getAllDataSource = params => { return axios.get('/cos3-portal-manager/table/tbl_datasources/queryAll',{ params: params }).then(res => res.data); };

//查询手动数据表数据
export const queryManualTables = params => { return axios.get('/cos3-portal-manager/manualTable/queryManualTables',{ params: params }).then(res => res.data); };
//保存手动数据表
export const saveManualTable = params => {return axios.post('/cos3-portal-manager/manualTable/saveManualTable',qs.stringify(params)).then(res => res.data); };
//删除手动数据表
export const delManualTables = params => { return axios.get('/cos3-portal-manager/manualTable/delManualTables',{ params: params }).then(res => res.data); };
//根据主键获取单笔手动数据表数据
export const getManualTableById = params => { return axios.get('/cos3-portal-manager/manualTable/getManualTableById',{ params: params }).then(res => res.data); };
//判断手动数据表是否已存在
export const isExitManualTableName = params => { return axios.get('/cos3-portal-manager/table/tbl_manual_tables/unique',{ params: params }).then(res => res.data); };

//查询动态视图信息
export const queryDynamicView = params => { return axios.get('/cos3-portal-manager/dynamicView/queryDynamicView',{ params: params }).then(res => res.data); };
//校验视图名称是否已存在
export const isExitDynamicViewName = params => { return axios.get('/cos3-portal-manager/table/tbl_views/unique',{ params: params }).then(res => res.data); };
// 根据主键获取动态视图信息
export const getDynamicViewById = params => { return axios.get('/cos3-portal-manager/table/tbl_views/get',{ params: params }).then(res => res.data); };
// 保存动态视图信息
export const saveDynamicView = params => {return axios.post('/cos3-portal-manager/table/tbl_views/save',params).then(res => res.data); };
// 删除动态视图信息
export const delDynamicView = params => { return axios.get('/cos3-portal-manager/table/tbl_views/delete',{ params: params }).then(res => res.data); };

//分页查询权限组信息
export const queryPerssionGroup = params => { return axios.get('/cos3-portal-manager/perssionGroup/queryPerssionGroup',{ params: params }).then(res => res.data); };
//删除权限组信息
export const delPerssionGroup = params => { return axios.get('/cos3-portal-manager/perssionGroup/delPerssionGroup',{ params: params }).then(res => res.data); };
//查询分组下待选权限项
export const getHasNoAuthPermissionItem = params => { return axios.get('/cos3-portal-manager/perssionGroup/getHasNoAuthPermissionItem',{ params: params }).then(res => res.data); };
//查询分组下已选权限项
export const getHasAuthPermissionItem = params => { return axios.get('/cos3-portal-manager/perssionGroup/getHasAuthPermissionItem',{ params: params }).then(res => res.data); };
//根据主键获取权限组信息
export const getPermissionGroupById = params => { return axios.get('/cos3-portal-manager/table/COS_POWER_GROUP/get',{ params: params }).then(res => res.data); };
//保存权限项组
export const savePermissionGroup = params => {return axios.post('/cos3-portal-manager/perssionGroup/savePermissionGroup',qs.stringify(params)).then(res => res.data); };
//校验权限组名称是否已存在
export const isExitPermissionGroupName = params => { return axios.get('/cos3-portal-manager/table/COS_POWER_GROUP/unique',{ params: params }).then(res => res.data); };
//查询所有权限组
export const getAllPermissionGroups = params => { return axios.get('/cos3-portal-manager/table/COS_POWER_GROUP/queryAll',{ params: params }).then(res => res.data); };


//分页查询权限项信息
export const queryPerssionItem = params => { return axios.get('/cos3-portal-manager/perssionItem/queryPerssionItem',{ params: params }).then(res => res.data); };
//删除权限项信息
export const delPerssionItem = params => { return axios.get('/cos3-portal-manager/table/COS_POWER_ITEM/delete',{ params: params }).then(res => res.data); };
//根据主键获取权限项信息
export const getPermissionItemById = params => { return axios.get('/cos3-portal-manager/perssionItem/getPermissionItemById',{ params: params }).then(res => res.data); };
//校验权限code是否已存在
export const isExitPermissionItemCode = params => { return axios.get('/cos3-portal-manager/table/COS_POWER_ITEM/unique',{ params: params }).then(res => res.data); };
//保存权限项信息
export const savePermissionItem = params => {return axios.post('/cos3-portal-manager/perssionItem/savePermissionItem',qs.stringify(params)).then(res => res.data); };

//得到权限项未授权的角色
export const getPermissionHasNoConnectRole = params => {return axios.get('/cos3-portal-manager/perssionItem/getPermissionHasNoConnectRole',{ params: params }).then(res => res.data); };
//得到权限项已经授权的角色
export const getPermissionHasConnectRole = params => {return axios.get('/cos3-portal-manager/perssionItem/getPermissionHasConnectRole',{ params: params }).then(res => res.data); };
//保存权限项已授权角色信息
export const savePermissionRelRole = params => {return axios.get('/cos3-portal-manager/perssionItem/savePermissionRelRole',{ params: params }).then(res => res.data); };

//得到权限项未授权的人员
export const getPermissionHasNoConnectPerson = params => {return axios.get('/cos3-portal-manager/perssionItem/getPermissionHasNoConnectPerson',{ params: params }).then(res => res.data); };
//得到权限项已经授权的人员
export const getPermissionHasConnectPerson = params => {return axios.get('/cos3-portal-manager/perssionItem/getPermissionHasConnectPerson',{ params: params }).then(res => res.data); };
//保存权限项已授权人员信息
export const savePermissionRelPerson = params => {return axios.get('/cos3-portal-manager/perssionItem/savePermissionRelPerson',{ params: params }).then(res => res.data); };

//分页查询消息注册信息
export const queryMsgRegisterInfo = params => { return axios.get('/cos3-portal-manager/msgRegister/queryMsgRegisterInfo',{ params: params }).then(res => res.data); };
//删除消息注册信息
export const delMsgRegister = params => { return axios.get('/cos3-portal-manager/table/COS_MSG_REGISTER/delete',{ params: params }).then(res => res.data); };
//根据主键获取消息注册信息
export const getMsgRegisterById = params => { return axios.get('/cos3-portal-manager/table/COS_MSG_REGISTER/get',{ params: params }).then(res => res.data); };
//校验消息key是否已存在
export const isExitMsgRegisterKey = params => { return axios.get('/cos3-portal-manager/table/COS_MSG_REGISTER/unique',{ params: params }).then(res => res.data); };
//保存权限项信息
export const saveMsgRegister = params => {return axios.post('/cos3-portal-manager/msgRegister/saveMsgRegister',qs.stringify(params)).then(res => res.data); };

//=======================用户组管理

//分页查询用户组信息
export const queryUserGroup = params => { return axios.get('/cos3-portal-manager/personnelGroup/getSysGroupList',{ params: params }).then(res => res.data); };
//删除用户组信息
export const delUserGroup = params => { return axios.get('/cos3-portal-manager/personnelGroup/delById',{ params: params }).then(res => res.data); };
//根据主键获取用户组信息
export const getUserGroupById = params => { return axios.get('/cos3-portal-manager/personnelGroup/getOneById',{ params: params }).then(res => res.data); };
//保存用户组
export const saveUserGroup = params => {return axios.post('/cos3-portal-manager/personnelGroup/saveSys',qs.stringify(params)).then(res => res.data); };
//校验用户组名称是否已存在
export const isExitUserGroupName = params => { return axios.get('/cos3-portal-manager/table/COS_SYS_PERSONNEL_GROUP/unique',{ params: params }).then(res => res.data); };
//根据机构id获取所有人
export const getPersonsByOrgId = params => { return axios.get('/cos3-portal-manager/personnel/getPersonsByOrgId',{ params: params }).then(res => res.data); };
//获取已关联人员
export const getPerson = params => { return axios.get('/cos3-portal-manager/personnelGroup/getRePerson',{ params: params }).then(res => res.data); };
//获取所有人员
export const getAllPerson = params => { return axios.get('/cos3-portal-manager/personnelGroup/getAllPerson',{ params: params }).then(res => res.data); };
