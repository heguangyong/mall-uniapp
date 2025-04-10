// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
//移动端商城API 网络接口修改此配置，小程序域名要求https 例如：https://api.front.merchant.java.crmeb.net
let domain = 'http://192.168.1.119:20810'

module.exports = {
	// 请求域名 格式： https://您的域名
	HTTP_REQUEST_URL:domain,
	// #ifdef MP || APP-PLUS
	// H5商城地址
	HTTP_H5_URL: 'http://h5.xxx.com',
	// #endif
	HEADER:{
		'content-type': 'application/json'
	},
	HEADERPARAMS:{
		'content-type': 'application/x-www-form-urlencoded'
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'Authori-zation',
	// 缓存时间 0 永久
	EXPIRE:0,
	//分页最多显示条数
	LIMIT: 10
};
