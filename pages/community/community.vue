<template>
	<view>
		<view class="head">
			<view class="head-area">{{cObj.area}}</view>
			<image :src="cObj.image"></image>
			<view class="head-info">
				<text class="head-name">{{cObj.name}}</text>
				<view class="head-button">
					<text>社区管理员：{{cObj.nickName}}</text>
					<image src="../../static/images/common/chatw.png"></image>
				</view>
			</view>
		</view>
		<view class="list" v-show="orderList.length">
			<view class="list-item" v-for="(item, index) in orderList" :key="index" @click="toDetail(item._id)">
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
				orderList: []
			};
		},
		onLoad(option) {
			if (option.id) this.cId = option.id;
			this.getDetail();
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
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/task/detail?id=' + id
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
