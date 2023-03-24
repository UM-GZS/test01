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
			<template v-if="detail.pId == userInfo._openid && (detail.state == 1 || detail.state == 2)">
				<view class="content-title">评价</view>
				<uni-rate :readonly="detail.state == 2" :touchable="false" :value="rate" @change="onChange" />
				<textarea v-model="content" placeholder="请输入内容" maxlength="-1" :disabled="detail.state == 2" auto-height />
			</template>
			<view class="content-chat">
				<image src="../../static/images/common/chat.png"></image>
				<text @click="toChat">{{detail.pId == userInfo._openid && detail.uId ? '联系接单者' : '联系发布者'}}</text>
			</view>
		</view>
		<view class="null"></view>
		<view class="bottom" v-show="detail.state == 1 && (detail.uId == userInfo._openid || detail.pId == userInfo._openid)">
			<view class="bottom-button cancel" @click="fishOrder(0)">取消</view>
			<view class="bottom-button finish" @click="fishOrder(1)">完成</view>
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
					title: '进行中',
					desc: ''
				}, {
					title: '已完成',
					desc: ''
				}],
				stepActive: 0,
				rate: 0,
				content: '',
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
					this.stepList[1].desc = obj.jTime;
					this.stepList[2].desc = obj.fTime;
					this.getRate();
				}).catch(console.error)
			},
			onChange(e) {
				this.rate = e.value;
			},
			getOrder() {
				if (this.userInfo._openid == this.detail.pId) {
					uni.showToast({
						title: '不能接自己发布的订单',
						icon: 'none'
					})
					return;
				}
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'getOrder',
						id: this.detail._id,
						uName: this.userInfo.nickName,
						uAvatar: this.userInfo.avatarUrl
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
			fishOrder(val) {
				if (val) {
					if (!this.rate || !this.content) {
						uni.showToast({
							title: '请做出评价',
							icon: 'none'
						})
						return;
					}
					wx.cloud.callFunction({
						name: 'order',
						data: {
							funName: 'addRate',
							oId: this.detail._id,
							cId: this.detail.cId,
							uId: this.detail.uId,
							uName: this.detail.uName,
							pName: this.detail.pName,
							rate: this.rate,
							content: this.content
						}
					}).then(res => {
						if (res.result) {
							this.submit();
						}
					}).catch(console.error)
				} else this.submit();
			},
			getRate() {
				if (this.detail.state != 2) return;
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'getRate',
						oId: this.detail._id
					}
				}).then(res => {
					let obj = res.result;
					this.rate = obj.rate || 0;
					this.content = obj.content || '';
				}).catch(console.error)
			},
			submit() {
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
			},
			toChat() {
				let obj = this.detail;
				let url = null;
				if (this.detail.pId == this.userInfo._openid && this.detail.uId) url = `/pages/chat/detail?tId=${obj.uId}&tName=${obj.uName}&tAvatar=${obj.uAvatar}`
				else url = `/pages/chat/detail?tId=${obj.pId}&tName=${obj.pName}&tAvatar=${obj.pAvatar}`
				uni.navigateTo({ url })
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
			margin: 40rpx 0 20rpx;
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
