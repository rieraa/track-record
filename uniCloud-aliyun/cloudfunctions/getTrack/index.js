'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {


	let res;

	if (event.id) {
		// 如果传递了id，则查询指定记录
		res = await db.collection('track_record').doc(event.id).get();
	} else {
		// 如果没有传递id，则查询整个集合
		res = await db.collection('track_record').get();
	}

	// 返回数据给客户端
	return res;
};