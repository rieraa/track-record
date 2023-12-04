//  地理信息息位置获取工具类

/**
 * 获取用户当前所在的位置
 */
export const getLocation = () => {
	return new Promise((resolve, reject) => {
		let _locationChangeFn = (res) => {
			resolve(res) // 回传地里位置信息
			uni.offLocationChange(_locationChangeFn) // 关闭实时定位
			uni.stopLocationUpdate(_locationChangeFn); // 关闭监听 不关闭监听的话，有时获取位置时会非常慢
		}
		uni.startLocationUpdate({
			type: 'gcj02',
			success: (res) => {
				uni.onLocationChange(_locationChangeFn)
			},
			fail: (err) => {
				// 重新获取位置权限
				uni.openSetting({
					success(res) {
						res.authSetting = {
							"scope.userLocation": true
						}
					}
				})
				reject(err)
			}
		})
	})
}

