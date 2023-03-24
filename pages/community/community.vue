<template>
	<view>
		<view class="head">
			<view class="head-area">{{cObj.area}}</view>
			<image :src="cObj.image" mode="aspectFill"></image>
			<view class="head-info">
				<text class="head-name">{{cObj.name}}</text>
				<view class="head-button" @click="toChat">
					<text>社区管理员：{{cObj.nickName}}</text>
					<image src="../../static/images/common/chatw.png"></image>
				</view>
			</view>
		</view>
		<view class="list" v-show="orderList.length">
			<view class="list-item" v-for="(item, index) in orderList" :key="index" @click="toDetail(item)">
				<view class="list-icon">
					<image src="../../static/images/common/task.png"></image>
				</view>
				<view class="list-info">
					<view class="list-name">{{item.title}}</view>
					<view class="list-address">
						<text>{{item.area}}</text>
						<text>{{item.community}}</text>
					</view>
					<view class="list-text">
						<text>{{item.time}}</text>
						<text>接单</text>
					</view>
				</view>
			</view>
		</view>
		<view class="null" v-show="!orderList.length">
			<image src="../../static/images/common/null.png"></image>
			<text>暂无数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cId: null,
				cObj: {},
				orderList: [],
				userInfo: null
			};
		},
		onLoad(option) {
			let user = uni.getStorageSync('userInfo');
			this.userInfo = user;
			if (option.id) {
				this.cId = option.id;
				this.getDetail();
			}
		},
		onShow() {
			this.getList();
		},
		methods: {
			getDetail() {
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'detail',
						id: this.cId
					}
				}).then(res => {
					this.cObj = res.result;
				}).catch(console.error)
			},
			getList() {
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'getList',
						id: this.cId
					}
				}).then(res => {
					this.orderList = res.result;
				}).catch(console.error)
			},
			toDetail(item) {
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'checkUser',
						cId: item.cId
					}
				}).then(res => {
					let obj = res.result;
					if (obj.aId) {
						if (obj.state == 0) {
							return uni.showToast({
								title: '审核中...',
								icon: 'none'
							})
						}
						if (obj.state == 2) {
							return uni.showToast({
								title: '审核不通过',
								icon: 'none'
							})
						}
						uni.navigateTo({
							url: '/pages/task/detail?id=' + item._id
						})
					} else {
						uni.showModal({
							title: '提示',
							content: '请加入社区',
							success: (res) => {
								if (res.confirm) {
									this.joinCommunity();
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
				}).catch(console.error)
			},
			joinCommunity() {
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'joinCommunity',
						cId: this.cObj._id,
						uId: this.cObj._openid,
						aName: this.userInfo.nickName,
						aAvatar: this.userInfo.avatarUrl
					}
				}).then(res => {
					uni.hideLoading();
					if (res.result) {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						})
					}
				}).catch(console.error)
			},
			toChat() {
				let obj = this.cObj;
				uni.navigateTo({
					url: `/pages/chat/detail?tId=${obj._openid}&tName=${obj.nickName}&tAvatar=${obj.avatar}` 
				})
			}
		}
	}
</script>

<style lang="scss">
	.head {
		position: relative;
		margin-bottom: 10rpx;
		width: 100%;
		height: 370rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.head-area {
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			padding: 10rpx 20rpx;
			font-size: 24rpx;
			color: #FFFFFF;
			border-radius: 50rpx;
			background: rgba(0, 0, 0, 0.2);
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
		}

		.head-info {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 90rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: rgba(0, 0, 0, 0.2);
			border-radius: 0 0 10rpx 10rpx;

			.head-name {
				padding-left: 20rpx;
				font-size: 30rpx;
				color: #FFFFFF;
			}

			.head-button {
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				
				text {
					font-size: 28rpx;
					color: #FFFFFF;
				}
				
				image {
					margin-left: 10rpx;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}
	
	.list {
		padding: 0 20rpx;
		background: #FFFFFF;
	
		.list-item {
			width: 100%;
			height: 180rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F8F8F8;
	
			.list-icon {
				width: 100rpx;
				height: 100rpx;
	
				image {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}
	
			.list-info {
				width: calc(100% - 120rpx);
	
				.list-name {
					width: 100%;
					font-size: 30rpx;
					color: #333333;
				}
	
				.list-address {
					padding: 10rpx 0;
					width: 100%;
					display: flex;
					align-items: center;
	
					text {
						font-size: 26rpx;
						color: #C1BEC1;
	
						&:nth-child(2) {
							padding-left: 20rpx;
						}
					}
				}
	
				.list-text {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
	
					text {
						font-size: 26rpx;
						color: #C1BEC1;
	
						&:nth-child(2) {
							font-size: 28rpx;
							color: #05C697;
						}
					}
				}
			}
		}
	}
	
	.null {
		width: 100%;
		height: 500rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	
		image {
			width: 90rpx;
			height: 90rpx;
		}
	
		text {
			padding-top: 20rpx;
			font-size: 30rpx;
			color: #C1BEC1;
		}
	}
</style>
