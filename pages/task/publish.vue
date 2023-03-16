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
				<view class="input-text">选择社区</view>
				<picker @change="communityPicker" :value="communityIndx" :range="communityArr">
					<view class="input-text">{{communityArr[communityIndx] || '点击选择'}}</view>
				</picker>
			</view>
			<view class="input-item">
				<view class="input-text">选择日期</view>
				<picker @change="datePicker" mode="date" :value="date" :start="startDate" :end="endDate">
					<view class="input-text">{{date}}</view>
				</picker>
			</view>
			<view class="input-item">
				<view class="input-text">选择时间</view>
				<picker @change="timePicker" mode="time" :value="time" start="00:00" end="24:00">
					<view class="input-text">{{time}}</view>
				</picker>
			</view>
			<view class="input-item">
				<view class="input-text">标题</view>
				<input type="text" v-model="title" placeholder="请输入标题" maxlength="18" />
			</view>
			<view class="input-item sec">
				<view class="input-text">内容</view>
				<textarea v-model="content" placeholder="请输入内容" maxlength="-1" auto-height />
			</view>
		</view>
		<view class="button" @click="toSubmit">发布</view>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				area: '',
				communityArr: [],
				communityList: [],
				communityIndx: null,
				date: currentDate,
				time: '09:00',
				title: '',
				content: '',
				userInfo: null
			};
		},
		onLoad() {
			let user = uni.getStorageSync('userInfo');
			if (user) this.userInfo = user;
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			areaPicker(e) {
				this.area = e.detail.value.toString().replaceAll(',', '-');
				this.communityIndx = null;
				this.getCommunity();
			},
			getCommunity() {
				wx.cloud.callFunction({
					name: 'community',
					data: {
						funName: 'getList',
						area: this.area
					}
				}).then(res => {
					let resData = res.result;
					if (resData.length > 0) {
						let arr = resData.map(item => item.name);
						this.communityArr = arr;
						this.communityList = resData;
					}
				}).catch(console.error)
			},
			communityPicker(e) {
				this.communityIndx = e.detail.value;
			},
			datePicker(e) {
				this.date = e.detail.value;
			},
			timePicker(e) {
				this.time = e.detail.value;
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			toSubmit() {
				if (!this.area) return uni.showToast({
					title: '请选择地区',
					icon: 'none'
				})
				if (!this.communityIndx) return uni.showToast({
					title: '请选择社区',
					icon: 'none'
				})
				if (!this.title) return uni.showToast({
					title: '标题不能为空',
					icon: 'none'
				})
				if (!this.content) return uni.showToast({
					title: '内容不能为空',
					icon: 'none'
				})
				uni.showLoading({
					title: '请求中...'
				})
				let cId = this.communityList[this.communityIndx]._id;
				wx.cloud.callFunction({
					name: 'order',
					data: {
						funName: 'publish',
						area: this.area,
						community: this.communityArr[this.communityIndx],
						title: this.title,
						content: this.content,
						time: this.date + ' ' + this.time,
						pNmae: this.userInfo.nickName,
						cId: cId
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
			textarea,
			input {
				font-size: 30rpx;
				color: #333333;
			}

			textarea,
			input {
				width: 85%;
			}

			&.sec {
				align-items: flex-start;
			}
		}
	}

	.button {
		margin: 100rpx auto 0;
		width: 90%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background: #05C697;
		border-radius: 50rpx;
		font-size: 32rpx;
		color: #FFFFFF;
	}
</style>
