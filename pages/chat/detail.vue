<template>
	<view>
		<scroll-view id="scrollView" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true" :style="{height: style.contentH + 'px'}">
			<block v-for="(item, index) in list" :key="index">
				<view class="chat-body">
					<view class="user-chat-time" v-if="item.getTime">{{item.getTime}}</view>
					<view class="user-chat-list" :class="{'user-chat-me': item.isme}">
						<image v-if="!item.isme" :src="item.userpic" mode="widthFix" lazy-load></image>
						<view class="user-chat-list-body">
							<text v-if="item.type == 'text'">{{item.data}}</text>
							<image v-if="item.type == 'img'" :src="item.userpic" mode="widthFix" lazy-load></image>
						</view>
						<image v-if="item.isme" :src="item.userpic" mode="widthFix" lazy-load></image>
					</view>
				</view>
			</block>
		</scroll-view>
		<view class="chat-bottom">
			<input type="text" placeholder="请输入内容" v-model="text" />
			<view class="chat-bottom-submit" @tap="submit">发送</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
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
				tId: 'olFpX5FC5UoImTj1ZHD4oHRD7DV0',
				userInfo: null
			};
		},
		onLoad(option) {
			let user = uni.getStorageSync('userInfo');
			this.userInfo = user;
			this.getChat();
			this.getData();
			this.initData();
		},
		onReady() {
			this.pageToBottom();
		},
		methods: {
			getChat() {
				wx.cloud.callFunction({
					name: 'chat',
					data: {
						funName: 'getMessage',
						tId: this.tId
					}
				}).then(res => {
					this.list = res.result;
					// for (var i = 0; i < arr.length; i++) {
					// 	arr[i].getTime = utils.parsetime(arr[i].time);
					// }
				}).catch(console.error)
			},
			getData() {
				let arr = [{
						isme: false,
						userpic: "../../static/logo.png",
						type: "img",
						data: "../../static/logo.png",
						time: "1590367384",
						getTime: "",
					},
					{
						isme: true,
						userpic: "../../static/logo.png",
						type: "text",
						data: "哈哈哈",
						time: "1590413613",
						getTime: "",
					},
					{
						isme: false,
						userpic: "../../static/logo.png",
						type: "text",
						data: "哈哈哈",
						time: "1587775384",
						getTime: "",
					},
					{
						isme: true,
						userpic: "../../static/logo.png",
						type: "img",
						data: "../../static/logo.png",
						time: "1590458109",
						getTime: "",
					}
				]
				for (var i = 0; i < arr.length; i++) {
					arr[i].getTime = utils.parsetime(arr[i].time);
				}
				this.list = arr
			},
			initData() {
				try {
					const res = uni.getSystemInfoSync();
					this.style.contentH = res.windowHeight - uni.upx2px(120);
				} catch (e) {
					console.log(e)
				}
			},
			submit() {
				if (!this.text) return;
				let now = new Date().getTime();
				let obj = {
					isme: true,
					userpic: "../../static/logo.png",
					type: "text",
					data: this.text,
					time: now,
					getTime: utils.getChatTime(now, this.list[this.list.length - 1].time)
				}
				wx.cloud.callFunction({
					name: 'chat',
					data: {
						funName: 'addMessage',
						tId: this.tId,
						fName: this.userInfo.nickName,
						userpic: this.userInfo.avatarUrl,
						data: this.text,
						type: 'text',
						time: now,
						getTime: utils.getChatTime(now, this.list[this.list.length - 1].time)
					}
				}).then(res => {
					if (res.result) {
						this.text = '';
						this.pageToBottom();
					}
				}).catch(console.error)
				// this.list.push(obj);
				// this.pageToBottom();
			},
			pageToBottom() {
				let q = uni.createSelectorQuery();
				q.select('#scrollView').boundingClientRect();
				q.selectAll('.chat-body').boundingClientRect();
				q.exec((res) => {
					res[1].forEach((ret) => {
						this.style.itemH += ret.height
					})
					if (this.style.itemH > this.style.contentH) {
						this.scrollTop = this.style.itemH
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
