<script>
	export default {
		onLaunch: function() {
			wx.cloud.init({
				env: 'geson-5g2iv1th1765aeef',
				traceUser: true
			})
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
