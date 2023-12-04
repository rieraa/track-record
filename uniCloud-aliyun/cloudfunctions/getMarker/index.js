'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	console.log(event)
	// 如果没有传递id，则查询整个集合
	let res = await db.collection('marker_record').where({
		trackId: event.id
	}).get()


	console.log("se" + res)


	// 返回数据给客户端
	return res;
};