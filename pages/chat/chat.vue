<template>
	<view>
		<view class="list" v-show="chatList.length">
			<view class="list-item" v-for="(item, index) in chatList" :key="index" @click="toChat(item)">
				<view class="list-avatar">
					<image :src="userInfo._openid == item.sId ? item.tAvatar : item.sAvatar"></image>
				</view>
				<view class="list-info">
					<view class="list-text">
						<text class="list-name">{{userInfo._openid == item.sId ? item.tName : item.sName}}</text>
						<text class="list-time">{{item.msgArr.length && util.parsetime(item.msgArr[0].time)}}</text>
					</view>
					<view class="list-content">{{item.msgArr.length && item.msgArr[0].data}}</view>
				</view>
			</view>
		</view>
		<view class="null" v-show="!chatList.length">
			<image src="../../static/images/common/nomess.png"></image>
			<text>暂无消息</text>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	const db = wx.cloud.database();
	const _ = db.command;
	const watcher = db.collection('message');
	export default {
		data() {
			return {
				chatList: [],
				util: utils,
				userInfo: null
			}
		},
		onLoad() {
			let user = uni.getStorageSync('userInfo');
			this.userInfo = user;
			if (!this.userInfo) {
				uni.showToast({
					title: '请先登录账号',
					icon: 'none'
				})
				return;
			}
			this.getChat();
			this.watchMessage();
		},
		methods: {
			getChat() {
				wx.cloud.callFunction({
					name: 'chat',
					data: {
						funName: 'getChats'
					}
				}).then(res => {
					this.chatList = res.result;
				}).catch(console.error)
			},
			watchMessage() {
				watcher.where(
					_.or([
						{ tId: this.userInfo._openid },
						{ sId: this.userInfo._openid }
					])
				).watch({
					onChange: (res) => {
						if (res.type == 'init') return;
						this.getChat();
					},
					onError: (err) => {
						console.error('the watch closed because of error', err)
					}
				})
			},
			toChat(item) {
				let tId = this.userInfo._openid == item.sId ? item.tId : item.sId;
				uni.navigateTo({
					url: `/pages/chat/detail?cId=${item._id}&tId=${tId}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
	}

	.list {
		padding: 0 20rpx;
		background: #FFFFFF;

		.list-item {
			width: 100%;
			height: 150rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F8F8F8;

			&:last-child {
				border: none;
			}

			.list-avatar {
				width: 100rpx;
				height: 100rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 100%;
				}
			}

			.list-info {
				width: calc(100% - 130rpx);

				.list-text {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.list-name {
						font-size: 32rpx;
						color: #333333;
					}

					.list-time {
						font-size: 26rpx;
						color: #C1BEC1;
					}
				}

				.list-content {
					padding-top: 10rpx;
					width: 100%;
					font-size: 26rpx;
					color: #C1BEC1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	.null {
		width: 100%;
		height: 600rpx;
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
