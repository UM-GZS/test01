<template>
	<view>
		<view class="banner">
			<swiper class="swiper" circular :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item>
					<image src="../../static/images/common/banner.png"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="head">
			<view class="add-button" @click="toPublish">发布需求</view>
			<view class="select-area">
				<view class="select-text">选择地区</view>
				<picker @change="areaPicker" mode="region">
					<view class="select-text">{{area}}</view>
				</picker>
			</view>
		</view>
		<view class="list">
			<view class="list-item" v-for="(item, index) in dataList" :key="index" @click="toCommunity(item._id)">
				<view class="list-area">{{item.area}}</view>
				<image :src="item.image" mode="aspectFill"></image>
				<view class="list-info">
					<text class="list-name">{{item.name}}</text>
					<view class="list-button">详情</view>
				</view>
			</view>
		</view>
		<view class="null" v-show="!dataList.length">
			<image src="../../static/images/common/null.png"></image>
			<text>暂无数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoplay: true,
				interval: 2000,
				duration: 500,
				area: '北京市-北京市-东城区',
				userInfo: null,
				dataList: []
			}
		},
		onLoad() {
			this.getUserInfo();
			this.getCommunity();
		},
		methods: {
			getUserInfo() {
				wx.cloud.callFunction({
					name: 'user',
					data: { funName: 'userInfo' }
				}).then(res => {
					if (res.result) {
						this.userInfo = res.result;
						uni.setStorageSync('userInfo', res.result);
					}
				}).catch(console.error)
			},
			getCommunity() {
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'getList',
						area: this.area
					}
				}).then(res => {
					this.dataList = res.result;
				}).catch(console.error)
			},
			areaPicker(e) {
				this.area = e.detail.value.toString().replaceAll(',', '-');
				this.getCommunity();
			},
			toPublish() {
				if (!this.userInfo) return uni.showToast({
					title: '请先登录账号',
					icon: 'none'
				})
				uni.navigateTo({
					url: '/pages/task/publish'
				})
			},
			toCommunity(id) {
				if (!this.userInfo) return uni.showToast({
					title: '请先登录账号',
					icon: 'none'
				})
				uni.navigateTo({
					url: '/pages/community/community?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
	}

	.banner {
		width: 100%;

		.swiper {
			width: 100%;
			height: 400rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.head {
		position: relative;
		top: -50rpx;
		width: 100%;
		padding: 40rpx 0;
		background: #FFFFFF;
		border-radius: 50rpx 50rpx 0 0;

		.add-button {
			margin: 0 auto;
			width: 85%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
			background: #05C697;
			border-radius: 50rpx;
			font-size: 32rpx;
			color: #FFFFFF;
		}
		
		.select-area {
			padding: 40rpx 30rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.select-text{
				font-size: 30rpx;
				color: #333333;
			}
		}
	}
	
	.list {
		position: relative;
		top: -20rpx;
		padding: 0 20rpx 10rpx;
		
		.list-item {
			position: relative;
			margin-bottom: 30rpx;
			width: 100%;
			height: 370rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			
			.list-area {
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
			
			.list-info {
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
				
				.list-name {
					padding-left: 20rpx;
					font-size: 30rpx;
					color: #FFFFFF;
				}
				
				.list-button {
					margin-right: 20rpx;
					width: 160rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 26rpx;
					color: #FFFFFF;
					background: rgba(5,198,151, 0.8);
					border-radius: 10rpx;
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
