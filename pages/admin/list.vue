<template>
	<view>
		<view class="tab">
			<view class="tab-item" :class="{'active': tabIndx == index}" v-for="(item, index) in tabList" :key="index" @click="tabSelect(index)">
				<text class="tab-name">{{item.name}}</text>
				<text class="tab-line"></text>
			</view>
		</view>
		<view class="list">
			<view class="list-item" v-for="(item, index) in applyList" :key="index">
				<view class="list-info">
					<image :src="item.aAvatar"></image>
					<text>{{item.aName}}</text>
				</view>
				<view class="list-button" v-if="item.state == 0">
					<view class="list-refuse" @click="changeState(item._id, 2)">拒绝</view>
					<view class="list-pass" @click="changeState(item._id, 1)">通过</view>
				</view>
			</view>
		</view>
		<view class="null" v-show="!applyList.length">
			<image src="../../static/images/common/null.png"></image>
			<text>暂无数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{
					name: '未处理',
					key: 0
				}, {
					name: '已通过',
					key: 1
				}, {
					name: '未通过',
					key: 2
				}],
				tabIndx: 0,
				applyList: []
			};
		},
		onLoad() {
			this.getApplyList(0);
		},
		methods: {
			getApplyList(index) {
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'getApply',
						state: index
					}
				}).then(res => {
					this.applyList = res.result;
				}).catch(console.error)
			},
			tabSelect(index) {
				this.tabIndx = index;
				this.getApplyList(index);
			},
			changeState(id, state) {
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'editApply',
						id: id,
						state: state
					}
				}).then(res => {
					uni.hideLoading();
					if (res.result) {
						this.getApplyList(0);
						uni.showToast({
							title: '修改成功',
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
	
	.tab {
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: #FFFFFF;

		.tab-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.tab-name {
				font-size: 30rpx;
				color: #333333;
			}

			.tab-line {
				margin-top: 10rpx;
				display: inline-block;
				width: 100%;
				height: 8rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
			}

			&.active {
				.tab-name {
					color: #05C697;
				}

				.tab-line {
					background: #05C697;
				}
			}
		}
	}
	
	.list {
		padding: 0 20rpx;
		background: #FFFFFF;
	
		.list-item {
			width: 100%;
			height: 160rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F8F8F8;
	
			.list-info {
				display: flex;
				align-items: center;
				
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 100%;
				}
				
				text {
					padding-left: 20rpx;
					font-size: 32rpx;
					color: #333333;
				}
			}
			
			.list-button {
				display: flex;
				align-items: center;
				
				.list-refuse, .list-pass {
					margin-left: 20rpx;
					width: 150rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 26rpx;
					color: #FFFFFF;
					background: #05C697;
					border-radius: 50rpx;
				}
				
				.list-refuse {
					width: 146rpx;
					height: 56rpx;
					color: #FE5366;
					background: none;
					border: 1px solid #FE5366;
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
