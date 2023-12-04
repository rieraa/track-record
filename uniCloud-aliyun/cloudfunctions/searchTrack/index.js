const db = uniCloud.database()
exports.main = async (event, context) => {
	let res;
	console.log(event.title)
	if (event.title) {
		// 如果传递了title，则查询指定记录
		res = await db.collection('track_record')
			.where({
				title: new RegExp(event.title, 'i') // 使用 JavaScript 的正则表达式
			})
			.get();
	} else {
		// 如果没有传递title，则查询整个集合
		res = await db.collection('track_record').get();
	}

	// 返回数据给客户端
	return res;
};