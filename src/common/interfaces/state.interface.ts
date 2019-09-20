// 发布状态
export enum EStatePublish {
	Draft = 0, // 草稿
	Published = 1, // 已发布
	Recycle = -1, // 发布过已撤回
}

// 公开状态
export enum EStatePublic {
	Password = 0, // 密码访问
	Public = 1, // 公开
	Secret = -1, // 隐藏
}

// 装载状态
export enum EStateOrigin {
	Original = 0, // 原创
	Reprint = 1, // 装载
	Hybrid = 2, // 混合
}

// 评论状态
export enum EStateComment {
	Auditing = 0, // 待审核
	Published = 1, // 通过正常
	Deleted = -1, // 已删除
	Spam = -2, // 垃圾评论
}

// 评论宿主页面的 POST_ID 类型
export enum EStateCommentPostType {
	Guestbook = 0, // 留言板
}

// 评论本身的类型
export enum EStateCommentSelfType {
	Self = 0, // 自身一级评论
}

// 排序状态
export enum EStateSortType {
	Asc = 1, // 升序
	Desc = -1, // 降序
	Hot = 2, // 最热
}
