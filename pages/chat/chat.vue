<template>
	<view>
		<view class="list" v-show="chatList.length">
			<view class="list-item" v-for="(item, index) in chatList" :key="index" @click="toChat">
				<view class="list-avatar">
					<image src="../../static/logo.png"></image>
				</view>
				<view class="list-info">
					<view class="list-text">
						<text class="list-name">{{item.name}}</text>
						<text class="list-time">{{item.time}}</text>
					</view>
					<view class="list-content">{{item.text}}</view>
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
	export default {
		data() {
			return {
				chatList: []
			}
		},
		methods: {
			toChat() {
				uni.navigateTo({
					url: '/pages/chat/detail'
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
