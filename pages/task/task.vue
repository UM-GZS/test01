<template>
	<view>
		<view class="tab">
			<view class="tab-item" :class="{'active': tabIndx == index}" v-for="(item, index) in tabList" :key="index" @click="tabSelect(index)">
				<text class="tab-name">{{item.name}}</text>
				<text class="tab-line"></text>
			</view>
		</view>
		<view class="list" v-show="dataList.length">
			<view class="list-item" v-for="(item, index) in dataList" :key="index" @click="toDetail(item._id)" v-show="tabIndx == 1 && (item.uId == userInfo._openid)">
				<view class="list-icon">
					<image src="../../static/images/common/task.png"></image>
				</view>
				<view class="list-info">
					<view class="list-name">{{item.title}}</view>
					<view class="list-address">
						<text>{{item.area}}</text>
						<text>{{item.community}}</text>
					</view>
					<view class="list-text">{{item.time}}</view>
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
				tabList: [{
					name: '已发布',
					key: 0
				}, {
					name: '已接单',
					key: 2
				}, {
					name: '进行中',
					key: 2
				}, {
					name: '已完成',
					key: 3
				}],
				tabIndx: 0,
				dataList: [],
				userInfo: null
			}
		},
		onLoad(option) {
			let user = uni.getStorageSync('userInfo');
			this.userInfo = user;
			if (option.key) {
				this.tabIndx = option.key;
				this.getList();
			}
		},
		methods: {
			getList() {
				let state = this.tabList[this.tabIndx].key;
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'getData',
						state: state
					}
				}).then(res => {
					this.dataList = res.result;
				}).catch(console.error)
			},
			tabSelect(index) {
				this.tabIndx = index;
				this.getList();
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
					font-size: 26rpx;
					color: #C1BEC1;
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
