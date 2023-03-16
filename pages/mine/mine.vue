<template>
	<view>
		<view class="head">
			<view class="head-avatar">
				<image :src="userInfo.avatarUrl || '../../static/logo.png'"></image>
			</view>
			<view class="head-info">
				<view class="head-name" @click="toLogin">{{userInfo.nickName || '点击登录' }}</view>
				<view class="head-text" v-show="userInfo">
					<text>{{roleList[userInfo.role]}}</text>
					<text>{{userInfo.phone}}</text>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="list-item" v-for="(item, index) in dataList" :key="index" @click="toTask(item.index)">
				<text class="list-val">{{userInfo[item.key] || '-'}}</text>
				<text class="list-name">{{item.name}}</text>
			</view>
		</view>
		<view class="nav">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="toNav(index, item.url)" v-if="index != 2 || userInfo.role == 1">
				<view class="nav-info">
					<image :src="item.icon"></image>
					<text>{{item.name}}</text>
				</view>
				<image class="nav-more" src="../../static/images/common/more.png"></image>
			</view>
		</view>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog :before-close="true" mode="input" title="绑定手机号" placeholder="请输入手机号码" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
				roleList: ['普通用户', '社区管理员'],
				dataList: [{
					name: '已发布',
					index: 0,
					key: 'order0'
				}, {
					name: '已接单',
					index: 1,
					key: 'order1'
				}, {
					name: '进行中',
					index: 2,
					key: 'order2'
				}, {
					name: '已完成',
					index: 3,
					key: 'order3'
				}],
				navList: [{
					icon: '../../static/images/common/verified.png',
					name: '实名认证',
					url: '/pages/verified/verified'
				}, {
					icon: '../../static/images/common/admin.png',
					name: '申请社区管理员',
					url: '/pages/admin/admin'
				}, {
					icon: '../../static/images/common/record.png',
					name: '申请列表',
					url: '/pages/admin/list'
				}]
			}
		},
		onLoad() {
			this.getUserInfo();
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
			toTask(key) {
				if (!this.userInfo) return uni.showToast({
					title: '请先登录账号',
					icon: 'none'
				})
				uni.navigateTo({
					url: '/pages/task/task?key=' + key
				})
			},
			toNav(index, url) {
				if (!this.userInfo) return uni.showToast({
					title: '请先登录账号',
					icon: 'none'
				})
				if (index == 1 && this.userInfo.role == 1 ) return uni.showToast({
					title: '你已是社区管理员',
					icon: 'none'
				})
				uni.navigateTo({ url })
			},
			toLogin() {
				if (this.userInfo) return;
				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: (res) => {
						uni.showLoading({
							title: '登录中...'
						})
						let info = res.userInfo;
						wx.cloud.callFunction({
							name: 'user',
							data: {
								funName: 'login',
								avatarUrl: info.avatarUrl,
								nickName: info.nickName
							}
						}).then(res => {
							uni.hideLoading();
							this.userInfo = res.result;
							uni.setStorageSync('userInfo', res.result);
							if (!this.userInfo.phone) this.$refs.inputDialog.open();
						}).catch(console.error)
					}
				});
			},
			dialogInputConfirm(val) {
				if (!val) return uni.showToast({
					title: '手机号码不能为空',
					icon: 'none'
				})
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'user',
					data: {
						funName: 'phone',
						phone: val
					}
				}).then(res => {
					uni.hideLoading();
					this.userInfo = res.result;
					uni.setStorageSync('userInfo', res.result);
					this.$refs.inputDialog.close();
				}).catch(console.error)
			}
		}
	}
</script>

<style lang="scss">
	.head {
		padding: 0 20rpx;
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

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

	.list {
		margin: 0 20rpx;
		height: 180rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: linear-gradient(to right, #05C697, #5AC1A7);
		border-radius: 10rpx;
		box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

		.list-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.list-val {
				font-size: 34rpx;
				color: #FFFFFF;
				font-weight: 550;
			}

			.list-name {
				padding-top: 10rpx;
				font-size: 26rpx;
				color: #FFFFFF;
			}
		}
	}

	.nav {
		margin-top: 20rpx;
		padding: 0 20rpx;

		.nav-item {
			width: 100%;
			height: 120rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F8F8F8;

			.nav-info {
				display: flex;
				align-items: center;

				image {
					width: 45rpx;
					height: 45rpx;
				}

				text {
					padding-left: 20rpx;
					font-size: 30rpx;
					color: #333333;
				}
			}

			.nav-more {
				width: 35rpx;
				height: 35rpx;
			}
		}
	}
</style>
