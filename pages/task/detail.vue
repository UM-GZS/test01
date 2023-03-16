<template>
	<view>
		<view class="head">
			<view class="head-icon">
				<image src="../../static/images/common/task.png"></image>
			</view>
			<view class="head-info">
				<view class="head-name">{{detail.title}}</view>
				<view class="head-address">
					<text>{{detail.area}}</text>
					<text>{{detail.community}}</text>
				</view>
				<view class="head-text">{{detail.time}}</view>
			</view>
		</view>
		<view class="content">
			<view class="content-title">需求内容</view>
			<uni-steps :options="stepList" active-color="#05C697" :active="stepActive" direction="column" />
			<view class="content-text">{{detail.content}}</view>
			<view class="content-chat">
				<image src="../../static/images/common/chat.png"></image>
				<text>联系发布者</text>
			</view>
		</view>
		<view class="null"></view>
		<view class="bottom" v-show="(detail.state == 1 && detail.uId == userInfo._openid) || (detail.state == 2 && detail.uId == userInfo._openid)">
			<view class="bottom-button cancel" @click="fishOrder">取消</view>
			<view class="bottom-button finish" @click="fishOrder">完成</view>
		</view>
		<view class="bottom sec" v-show="detail.state == 0">
			<view class="bottom-button" @click="getOrder">接单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				oId: null,
				stepList: [{
					title: '已发布',
					desc: ''
				}, {
					title: '已接单',
					desc: ''
				}, {
					title: '进行中',
					desc: ''
				}, {
					title: '已完成',
					desc: ''
				}],
				stepActive: 0,
				userInfo: null
			};
		},
		onLoad(option) {
			let user = uni.getStorageSync('userInfo');
			this.userInfo = user;
			if (option.id) {
				this.oId = option.id;
				this.getDetail();
			}
		},
		methods: {
			getDetail() {
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'getDetail',
						id: this.oId
					}
				}).then(res => {
					let obj = res.result;
					this.detail = obj;
					this.stepActive = obj.state;
					this.stepList[0].desc = obj.pTime;
					this.stepList[1].desc = obj.oTime;
					this.stepList[2].desc = obj.jTime;
					this.stepList[3].desc = obj.fTime;
				}).catch(console.error)
			},
			getOrder() {
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'getOrder',
						id: this.detail._id
					}
				}).then(res => {
					uni.hideLoading();
					if (res.result) {
						this.getDetail();
						uni.showToast({
							title: '接单成功',
							icon: 'none'
						})
					}
				}).catch(console.error)
			},
			fishOrder() {
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'fishOrder',
						id: this.detail._id
					}
				}).then(res => {
					uni.hideLoading();
					if (res.result) {
						this.getDetail();
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						})
					}
				}).catch(console.error)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
	}

	.head {
		padding: 0 20rpx;
		height: 180rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #FFFFFF;

		.head-icon {
			width: 100rpx;
			height: 100rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}

		.head-info {
			width: calc(100% - 120rpx);

			.head-name {
				width: 100%;
				font-size: 30rpx;
				color: #333333;
			}

			.head-address {
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

			.head-text {
				width: 100%;
				font-size: 26rpx;
				color: #C1BEC1;
			}
		}
	}

	.content {
		margin-top: 20rpx;
		padding: 20rpx 20rpx 0;
		background: #FFFFFF;

		.content-title {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 30rpx;
			color: #333333;
		}

		.content-text {
			margin: 40rpx 0;
			padding: 20rpx;
			background: #F8F8F8;
			font-size: 30rpx;
			color: #333333;
		}

		.content-chat {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1px solid #F8F8F8;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			text {
				padding-left: 10rpx;
				font-size: 30rpx;
				color: #333333;
			}
		}

		textarea {
			padding: 30rpx 0;
			width: 100%;
			font-size: 30rpx;
			color: #333333;
			border-bottom: 1px solid #F8F8F8;
		}
	}

	.null {
		width: 100%;
		height: 140rpx;
	}

	.bottom {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		height: 140rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: #FFFFFF;

		.bottom-button {
			width: 90%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			font-size: 30rpx;
			color: #FFFFFF;
			background: #05C697;
			border-radius: 50rpx;

			&.cancel {
				width: 336rpx;
				height: 86rpx;
				color: #05C697;
				background: none;
				border: 1px solid #05C697;
			}

			&.finish {
				width: 340rpx;
			}
		}

		&.sec {
			justify-content: center;
		}
	}
</style>
