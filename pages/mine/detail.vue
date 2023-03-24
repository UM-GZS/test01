<template>
	<view>
		<view class="list">
			<view class="list-item">
				<text class="list-name">头像</text>
				<view class="list-info" @click="upAvatar">
					<image class="list-avatar" :src="userInfo.avatarUrl"></image>
					<image class="list-more" src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="list-item">
				<text class="list-name">用户名</text>
				<view class="list-info" @click="openPopup(0)">
					<text class="list-val">{{userInfo.nickName}}</text>
					<image class="list-more" src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="list-item">
				<text class="list-name">手机号</text>
				<view class="list-info" @click="openPopup(1)">
					<text class="list-val">{{userInfo.phone}}</text>
					<image class="list-more" src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="list-item">
				<text class="list-name">用户类型</text>
				<view class="list-info">
					<text class="list-val">{{roleList[userInfo.role]}}</text>
				</view>
			</view>
			<view class="list-item">
				<text class="list-name">真实姓名</text>
				<view class="list-info">
					<text class="list-val">{{userInfo.isReal ? userInfo.realName : '未实名认证'}}</text>
				</view>
			</view>
			<view class="list-item">
				<text class="list-name">证件号</text>
				<view class="list-info">
					<text class="list-val">{{userInfo.isReal ? userInfo.idCard : '未实名认证'}}</text>
				</view>
			</view>
		</view>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog :before-close="true" mode="input" :value="inputVal" :title="type ? '修改手机号' : '修改用户名'" placeholder="请输入修改内容" @confirm="dialogInputConfirm" @close="dialogInputClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
				roleList: ['普通用户', '社区管理员'],
				type: null,
				inputVal: ''
			};
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
			openPopup(type) {
				this.type = type;
				this.$refs.inputDialog.open();
			},
			dialogInputConfirm(val) {
				if (!val) return uni.showToast({
					title: '内容不能为空',
					icon: 'none'
				})
				this.inputVal = val;
				if (this.type) this.upUserInfo({ phone: val });
				else this.upUserInfo({ nickName: val });
			},
			dialogInputClose() {
				this.type = null;
				this.inputVal = '';
				this.$refs.inputDialog.close();
			},
			upAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: e => {
						let file = e.tempFilePaths[0];
						wx.cloud.uploadFile({
							cloudPath: `avatar/${this.userInfo._openid}.png`,
							filePath: file,
							success: res => {
								this.upUserInfo({ avatarUrl: res.fileID });
							},
							fail: console.error
						})
					}
				});
			},
			upUserInfo(value) {
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'user',
					data: {
						funName: 'upUserInfo',
						reqData: value
					}
				}).then(res => {
					uni.hideLoading();
					this.userInfo = res.result;
					uni.setStorageSync('userInfo', res.result);
					this.dialogInputClose();
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					})
				}).catch(console.error)
			}
		}
	}
</script>

<style lang="scss">
	.list {
		padding: 0 20rpx;

		.list-item {
			width: 100%;
			height: 120rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F8F8F8;

			.list-name {
				font-size: 30rpx;
				color: #C1BEC1;
			}

			.list-info {
				display: flex;
				align-items: center;

				.list-avatar {
					width: 90rpx;
					height: 90rpx;
					border-radius: 100%;
				}

				.list-val {
					font-size: 30rpx;
					color: #333333;
				}

				.list-more {
					margin-left: 10rpx;
					width: 35rpx;
					height: 35rpx;
				}
			}
		}
	}
</style>
