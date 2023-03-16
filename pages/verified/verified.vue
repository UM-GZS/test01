<template>
	<view>
		<view class="head">
			<image src="../../static/images/common/verifieds.png"></image>
		</view>
		<view class="input">
			<view class="input-item">
				<view class="input-title">姓名</view>
				<input type="text" v-model="name" placeholder="请输入姓名" :disabled="userInfo.isReal" />
			</view>
			<view class="input-item">
				<view class="input-title">身份证号码</view>
				<input type="idcard" v-model="number" placeholder="请输入身份证号码" :disabled="userInfo.isReal" />
			</view>
		</view>
		<view class="button">
			<view class="button-item" @click="toSubmit">{{userInfo.isReal ? '已认证' : '认证'}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				number: '',
				userInfo: null
			};
		},
		onLoad() {
			let user = uni.getStorageSync('userInfo');
			this.userInfo = user;
			if (user.isReal) {
				this.name = user.realName;
				this.number = user.idCard;
			}
		},
		methods: {
			toSubmit() {
				if (this.userInfo.isReal) return;
				if (!this.name) return uni.showToast({
					title: '姓名不能为空',
					icon: 'none'
				})
				if (!this.number) return uni.showToast({
					title: '身份证号码不能为空',
					icon: 'none'
				})
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'user',
					data: {
						funName: 'verified',
						realName: this.name,
						idCard: this.number
					}
				}).then(res => {
					uni.showToast({
						title: '实名认证成功',
						icon: 'none'
					})
					this.userInfo = res.result;
					uni.setStorageSync('userInfo', res.result);
				}).catch(console.error)
			}
		}
	}
</script>

<style lang="scss">
	.head {
		width: 100%;
		height: 300rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 150rpx;
			height: 150rpx;
		}
	}
	
	.input {
		padding: 0 30rpx;
		
		.input-item {
			margin-top: 40rpx;
			width: 100%;
			
			.input-title, input {
				width: 100%;
				font-size: 30rpx;
				color: #333333;
			}
			
			input {
				padding: 30rpx 0;
				border-bottom: 1px solid #F8F8F8;
			}
		}
	}
	
	.button {
		margin-top: 100rpx;
		padding: 0 30rpx;
		
		.button-item {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 32rpx;
			color: #FFFFFF;
			background: #05C697;
			border-radius: 50rpx;
		}
	}
</style>
