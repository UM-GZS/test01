<template>
	<view>
		<scroll-view id="scrollView" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true" :style="{height: style.contentH + 'px'}">
			<block v-for="(item, index) in list" :key="index">
				<view class="chat-body">
					<view class="user-chat-time" v-if="item.getTime">{{item.getTime}}</view>
					<view class="user-chat-list" :class="{'user-chat-me': item.isme}">
						<image v-if="!item.isme" :src="item.sAvatar" mode="widthFix" lazy-load @click="toUser(item.sId)"></image>
						<view class="user-chat-list-body">
							<text v-if="item.type == 'text'">{{item.data}}</text>
							<image v-if="item.type == 'img'" :src="item.sAvatar" mode="widthFix" lazy-load></image>
						</view>
						<image v-if="item.isme" :src="item.sAvatar" mode="widthFix" lazy-load @click="toUser(item.sId)"></image>
					</view>
				</view>
			</block>
		</scroll-view>
		<view class="chat-bottom">
			<input type="text" placeholder="请输入内容" v-model="text" always-embed="true" adjust-position="true" cursor-spacing="18" />
			<view class="chat-bottom-submit" @tap="submit">发送</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	const db = wx.cloud.database();
	const watcher = db.collection('message');
	export default {
		data() {
			return {
				list: [],
				scrollTop: 0,
				style: {
					contentH: 0,
					itemH: 0
				},
				text: '',
				cId: null,
				tId: null,
				tName: '',
				tAvatar: '',
				userInfo: null
			};
		},
		onLoad(option) {
			let user = uni.getStorageSync('userInfo');
			this.userInfo = user;
			this.tName = option.tName || '';
			this.tAvatar = option.tAvatar || '';
			this.cId = option.cId || null;
			this.tId = option.tId || null;
			if (this.userInfo._openid == this.tId) {
				uni.showToast({
					title: '不能与自己聊天',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateBack();
				}, 2000)
				return;
			}
			if (option.cId) this.getMessage();
			else this.getChat();
		},
		methods: {
			initData() {
				try {
					const res = uni.getSystemInfoSync();
					this.style.contentH = res.windowHeight - uni.upx2px(140);
				} catch (e) {
					console.log(e);
				}
			},
			getChat() {
				wx.cloud.callFunction({
					name: 'chat',
					data: {
						funName: 'getChat',
						tId: this.tId,
						tName: this.tName,
						tAvatar: this.tAvatar,
						sName: this.userInfo.nickName,
						sAvatar: this.userInfo.avatarUrl
					}
				}).then(res => {
					let resData = res.result;
					if (resData) {
						this.cId = resData._id;
						this.getMessage();
					}
				}).catch(console.error)
			},
			toUser(id) {
				uni.navigateTo({
					url: `/pages/info/info?id=${id}`
				})
			},
			getMessage() {
				wx.cloud.callFunction({
					name: 'chat',
					data: {
						funName: 'getMessage',
						cId: this.cId
					}
				}).then(res => {
					let resData = res.result;
					if (resData.length) {
						resData.forEach((item, index) => {
							item.getTime = index ? utils.getChatTime(item.time, resData[index - 1]['time']) : utils.parsetime(item.time);
							item.isme = this.userInfo._openid == item.sId ? true : false
						})
						this.list = resData;
						this.initData();
						setTimeout(() => {
							this.pageToBottom();
						}, 500)
						this.watchMessage();
					}
				}).catch(console.error)
			},
			watchMessage() {
				watcher.where({
					cId: this.cId,
					sId: this.tId
				}).watch({
					onChange: (res) => {
						if (res.type == 'init') return;
						this.list.push(res.docChanges[0].doc);
						this.initData();
					},
					onError: (err) => {
						console.error('the watch closed because of error', err)
					}
				})
			},
			submit() {
				if (!this.text) return;
				let now = new Date().getTime();
				let index = this.list.length - 1;
				let obj = {
					cId: this.cId,
					tId: this.tId,
					sName: this.userInfo.nickName,
					sAvatar: this.userInfo.avatarUrl,
					data: this.text,
					type: 'text',
					time: now 
				}
				wx.cloud.callFunction({
					name: 'chat',
					data: {
						funName: 'addMessage',
						...obj
					}
				}).then(res => {
					if (res.result) {
						this.text = '';
					}
				}).catch(console.error)
				obj.getTime = this.list.length ? utils.getChatTime(now, this.list[index].time) : utils.parsetime(now);
				obj.isme = true;
				this.list.push(obj);
				this.initData();
				this.pageToBottom();
			},
			pageToBottom() {
				let q = uni.createSelectorQuery();
				q.select('#scrollView').boundingClientRect();
				q.selectAll('.chat-body').boundingClientRect();
				q.exec((res) => {
					res[1].forEach((ret) => {
						this.style.itemH += ret.height;
					})
					if (this.style.itemH > this.style.contentH) {
						this.scrollTop = this.style.itemH;
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.chat-body {
		padding: 0rpx 10rpx;

		.user-chat-time {
			padding: 50rpx 0rpx;
			color: #A2A2A2;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.user-chat-list {
			padding: 10rpx 0rpx;
			display: flex;

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 100%;
				flex-shrink: 0;
			}

			.user-chat-list-body {
				position: relative;
				background: #F4F4F4;
				padding: 25rpx;
				margin-left: 30rpx;
				border-radius: 20rpx;
				margin-right: 100rpx;

				&::after {
					position: absolute;
					left: -28rpx;
					right: 0;
					top: 20rpx;
					content: '';
					width: 0;
					height: 0;
					border: 16rpx solid #F4F4F4;
					border-color: transparent #F4F4F4 transparent transparent;
				}

				image {
					max-width: 250rpx;
					max-height: 300rpx;
				}
				
				text {
					font-size: 30rpx;
					color: #333333;
				}
			}

			&.user-chat-me {
				justify-content: flex-end;

				.user-chat-list-body {
					margin-right: 20rpx;
					margin-left: 100rpx;

					&::after {
						left: auto;
						right: -28rpx;
						border-color: transparent transparent transparent #F4F4F4;
					}
				}
			}
		}
	}

	.chat-bottom {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		padding: 0rpx 20rpx;
		background: #FFFFFF;
		border-top: 1rpx solid #EEEEEE;

		input {
			background: #F7F7F7;
			flex: 1;
			margin-right: 20rpx;
			padding: 15rpx;
			font-size: 30rpx;
			color: #333333;
		}

		.chat-bottom-submit {
			font-size: 30rpx;
			color: #333333;
		}
	}
</style>
