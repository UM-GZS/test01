<template>
	<view>
		<view class="head">
			<view class="head-avatar">
				<image :src="userInfo.avatarUrl"></image>
			</view>
			<view class="head-info">
				<view class="head-name">{{userInfo.nickName}}</view>
				<view class="head-text">
					<text>{{roleList[userInfo.role]}}</text>
					<text>{{userInfo.phone}}</text>
				</view>
			</view>
		</view>
		<view class="rate">
			<view class="rate-title">用户评价</view>
			<view class="rate-list">
				<view class="rate-item" v-for="(item, index) in rateList" :key="index">
					<view class="rate-info">
						<text>{{item.pName}}</text>
						<uni-rate :readonly="true" :value="item.rate" />
					</view>
					<view class="rate-content">{{item.content}}</view>
				</view>
			</view>
			<view class="null" v-show="!rateList.length">
				<image src="../../static/images/common/null.png"></image>
				<text>暂无数据</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				roleList: ['普通用户', '社区管理员'],
				userInfo: null,
				rateList: []
			};
		},
		onLoad(option) {
			if (option.id) {
				this.id = option.id;
				this.getUserInfo();
				this.getRates();
			}
		},
		methods: {
			getUserInfo() {
				wx.cloud.callFunction({
					name: 'user',
					data: {
						funName: 'getUser',
						id: this.id
					}
				}).then(res => {
					if (res.result) {
						this.userInfo = res.result;
					}
				}).catch(console.error)
			},
			getRates() {
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'getRates',
						id: this.id
					}
				}).then(res => {
					this.rateList = res.result;
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
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #FFFFFF;

		.head-avatar {
			width: 120rpx;
			height: 120rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 100%;
			}
		}

		.head-info {
			width: calc(100% - 150rpx);

			.head-name {
				width: 100%;
				font-size: 34rpx;
				color: #333333;
			}

			.head-text {
				padding-top: 10rpx;
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
		}
	}

	.rate {
		margin-top: 20rpx;
		padding: 0 20rpx;
		background: #FFFFFF;

		.rate-title {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			color: #333333;
			border-bottom: 1px solid #F8F8F8;
		}

		.rate-list {
			width: 100%;

			.rate-item {
				padding-bottom: 40rpx;
				width: 100%;
				border-bottom: 1px solid #F8F8F8;

				.rate-info {
					width: 100%;
					height: 100rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					text {
						font-size: 30rpx;
						color: #333333;
					}
				}

				.rate-content {
					width: 100%;
					font-size: 28rpx;
					color: #333333;
				}
				
				&:last-child {
					border: none;
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
