<template>
	<view>
		<view class="input">
			<view class="input-item">
				<view class="input-text">选择地区</view>
				<picker @change="areaPicker" mode="region">
					<view class="input-text">{{area || '点击选择'}}</view>
				</picker>
			</view>
			<view class="input-item">
				<view class="input-text">社区名称</view>
				<input type="text" v-model="name" placeholder="请输入社区名称" />
			</view>
		</view>
		<view class="content sec">
			<view class="content-title">社区图片</view>
			<uni-file-picker limit="1" title="最多选择1张图片" @select="selectImage"></uni-file-picker>
		</view>
		<view class="button">
			<view class="button-item" @click="toSubmit">申请</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				area: '',
				name: '',
				image: '',
				userInfo: null
			};
		},
		onLoad() {
			let user = uni.getStorageSync('userInfo');
			if (user) this.userInfo = user;
		},
		methods: {
			areaPicker(e) {
				this.area = e.detail.value.toString().replaceAll(',', '-');
			},
			selectImage(e) {
				uni.showLoading({
					title: '上传中...'
				})
				let file = e.tempFilePaths[0];
				let num = Math.round(Math.random() * 10);
				let date = new Date().getTime();
				wx.cloud.uploadFile({
					cloudPath: `community/${num}${date}.png`,
					filePath: file,
					success: res => {
						uni.hideLoading();
						this.image = res.fileID;
					},
					fail: console.error
				})
			},
			toSubmit() {
				if (!this.area) return uni.showToast({
					title: '请选择地区',
					icon: 'none'
				})
				if (!this.name) return uni.showToast({
					title: '社区名称不能为空',
					icon: 'none'
				})
				if (!this.image) return uni.showToast({
					title: '请上传社区图片',
					icon: 'none'
				})
				uni.showLoading({
					title: '请求中...'
				})
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'create',
						area: this.area,
						name: this.name,
						image: this.image,
						nickName: this.userInfo.nickName
					}
				}).then(res => {
					uni.hideLoading();
					if (res.result) {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack();
						}, 2000)
					}
				}).catch(console.error)
			}
		}
	}
</script>

<style lang="scss">
	.input {
		padding: 0 20rpx;

		.input-item {
			width: 100%;
			padding: 40rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F8F8F8;

			.input-text,
			input {
				font-size: 30rpx;
				color: #333333;
			}

			input {
				text-align: right;
				width: 75%;
			}
		}
	}

	.content {
		margin-top: 10rpx;
		padding: 20rpx 20rpx 0;
		border-bottom: 1px solid #F8F8F8;

		.content-title {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 30rpx;
			color: #333333;
		}

		&.sec {
			padding-bottom: 40rpx;
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
