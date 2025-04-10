// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import request from "@/utils/request.js";

/**
 * 逛逛分类列表
 * 
*/
export function communityCategoryListApi(){
  return request.get('community/category/list',{},{ noAuth : true});
}

/**
 * 逛逛推荐作者列表
 * 
*/
export function recommendAuthorListApi(params){
  return request.get('community/recommend/author/list',params);
}

/**
 * 逛逛话题统计数据
 * 
*/
export function topicCountApi(tid){
  return request.get(`community/topic/count/${tid}`);
}

/**
 * 逛逛用户主页
 * 
*/
export function userHomeApi(id){
  return request.get(`community/user/home/page/${id}`,{},{ noAuth : true});
}

/**
 * 逛逛内容作者列表
 * 
*/
export function noteAuthorListApi(authorId){
  return request.get(`community/note/author/list/${authorId}`);
}

/**
 * 逛逛内容发现列表
 * 
*/
export function discoverListApi(params){
  return request.get(`community/note/discover/list`,params,{ noAuth : true});
}

/**
 * 逛逛内容关注列表
 * 
*/
export function followListApi(params){
  return request.get(`community/note/follow/list`,params);
}

/**
 * 逛逛内容评论列表
 * 
*/
export function replyListApi(item){
  return request.get(`community/note/reply/list/${item.noteId}?limit=${item.limit}&page=${item.page}`,{},{ noAuth : true});
}

/**
 * 逛逛内容列表
 * 
*/
export function topicListApi(params){
  return request.get(`community/topic/list?keywords=${params.keywords}&limit=${params.limit}&page=${params.page}`);
}

/**
 * 逛逛推荐话题列表
 * 
*/
export function topicRecommendListApi(){
  return request.get(`community/topic/recommend/list`);
}

/**
 * 逛逛用户内容详情
 * 
*/
export function noteDetailApi(noteId){
  return request.get(`community/note/user/detail/${noteId}`,{},{ noAuth : true});
}

/**
 * 逛逛内容发现推荐列表
 * 
*/
export function noteRecommendApi(item){
  return request.get(`community/note/discover/list/recommend/${item.noteId}?limit=${item.limit}&page=${item.page}`,{},{ noAuth : true});
}

/**
 * 创建逛逛内容
 * 
*/
export function noteAddApi(data){
  return request.post(`community/note/add`, data);
}

/**
 * 编辑逛逛内容
 * 
*/
export function noteUpdateApi(data){
  return request.post(`community/note/update`, data);
}

/**
 * 逛逛关注/取关作者
 * 
*/
export function followAuthorApi(authorId){
  return request.post(`community/concerned/author/${authorId}`);
}

/**
 * 逛逛内容点赞/取消
 * 
*/
export function noteLikeApi(noteId){
  return request.post(`community/note/like/${noteId}`);
}

/**
 * 逛逛内容评论点赞/取消
 * 
*/
export function noteReplyLikeApi(replyId){
  return request.post(`community/note/reply/like/${replyId}`);
}

/**
 * 我的主页
 * 
*/
export function myHomeApi(){
  return request.get(`community/user/my/home/page`);
}

/**
 * 我的逛逛列表
 * 
*/
export function myNoteApi(data){
  return request.get(`community/note/my/list`,data);
}

/**
 * 逛逛内容作者列表
 * 
*/
export function authorNoteApi(authorId, data){
  return request.get(`community/note/author/list/${authorId}`,data,{ noAuth : true});
}

/**
 * 我的点赞列表
 * 
*/
export function myLikeListApi(params){
  return request.get(`community/note/my/like/list`, params);
}

/**
 * 我的关注列表
 * 
*/
export function myConcernedListApi(params){
  return request.get(`community/user/my/concerned/list`, params);
}

/**
 * 逛逛话题内容列表
 * 
*/
export function noteTopicListApi(params){
  return request.get(`community/note/topic/list`, params);
}

/**
 * 逛逛内容添加评论
 * 
*/
export function myFansListApi(data){
  return request.get(`community/user/my/fans/list`, data);
}

/**
 * 逛逛内容添加评论
 * 
*/
export function noteReplyAddApi(data){
  return request.post(`community/note/reply/add`, data);
}

/**
 * 逛逛内容删除
 * 
*/
export function noteDelApi(noteId){
  return request.post(`community/note/delete/${noteId}`);
}

/**
 * 逛逛内容评论删除
 * 
*/
export function noteReplyDelApi(noteId){
  return request.post(`community/note/reply/delete/${noteId}`);
}

/**
 * 逛逛内容评论开关
 * 
*/
export function noteReplySwitchApi(noteId){
  return request.post(`community/note/reply/switch/${noteId}`);
}

/**
 * 逛逛内容编辑个性签名
 * 
*/
export function editSignatureApi(data){
  return request.post(`community/user/edit/signature`, data);
}

/**
 * 获取逛逛内容评论平台开关设置
 * 
*/
export function replyPlatformSwitchApi(){
  return request.get(`community/note/reply/platform/switch/config`);
}

/**
 * 逛逛内容评论删除
 * 
*/
export function replyDeleteApi(replyId){
  return request.post(`community/note/reply/delete/${replyId}`);
}