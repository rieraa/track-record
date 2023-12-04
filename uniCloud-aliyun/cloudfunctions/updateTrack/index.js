'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	let res;
	res = await db.collection("track_record").doc(event.id).update({
		title: event.title
	})
	// 返回数据给客户端
	return res;
};