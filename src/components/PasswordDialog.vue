<template>
	<el-dialog v-model="isVisible" title="Change Password">
		<el-form :model="password">
			<el-form-item><el-input placeholder="Old Password" v-model="password.old" show-password /></el-form-item>
			<el-form-item><el-input placeholder="New Password" v-model="password.new" show-password /></el-form-item>
			<el-form-item><el-input placeholder="New Password Again" v-model="password.repeat" show-password /></el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="changePassword">OK</el-button>
				<el-button @click="isVisible = false">Cancel</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
	name: 'PasswordDialog',
	setup() {
		let isVisible = ref(false);
		let password = reactive({
			old: '',
			new: '',
			repeat: ''
		});
		const show = () => {
			isVisible.value = true;
			password.old = password.new = password.repeat = '';
		};
		return { isVisible, password, show };
	},
	computed: {
		username: () => sessionStorage.getItem('userName'),
		userrole: () => sessionStorage.getItem('userRole')
	},
	methods: {
		async changePassword() {
			if (!await this.$sql.exists(this.userrole, { 'ID': this.username, 'Password': this.password.old }))
				this.$message.error('Old password is incorrect!');
			else if (!this.password.new)
				this.$message.error('Password cannot be empty!');
			else if (this.password.new != this.password.repeat)
				this.$message.error('The new passwords do not match!');
			else {
				this.$sql.update(this.userrole, { 'ID': this.username, 'Password': this.password.old }, 'Password', this.password.new)
					.then(() => this.$message.success('Password has been changed!'))
					.catch(err => { console.error(err); this.$message.error('An error occurs!'); });
				this.isVisible = false;
			}
			this.password = { old: '', new: '', repeat: ''};
		}
	}
}
</script>
