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
export default {
	name: 'PasswordDialog',
	props: ['modelValue'],
	data: () => ({
		password: {
			old: '',
			new: '',
			repeat: ''
		}
	}),
	computed: {
		isVisible: {
			get() { return this.modelValue; },
			set(value) {
				this.password = { old: '', new: '', repeat: '' };
				this.$emit('update:modelValue', value);
			}
		},
		username: () => sessionStorage.getItem('userName'),
		userrole: () => sessionStorage.getItem('userRole')
	},
	methods: {
		async changePassword() {
			const res = await this.$sql(`SELECT 1 FROM \`${this.userrole}\` WHERE \`${this.userrole[0]}ID\` = ? AND \`Password\` = ?`, [this.username, this.password.old]);
			if (!res.length)
				this.$message.error('Old password is incorrect!');
			else if (!this.password.new)
				this.$message.error('Password cannot be empty!');
			else if (this.password.new != this.password.repeat)
				this.$message.error('The repeated new password is not the same!');
			else {
				this.$sql(`UPDATE \`${this.userrole}\` SET \`Password\` = ? WHERE \`${this.userrole[0]}ID\` = ? AND \`Password\` = ?`, [this.password.new, this.username, this.password.old]);
				this.$message.success('Password has been changed!');
				this.isVisible = false;
			}
			this.password = { old: '', new: '', repeat: '' };
		}
	}
}
</script>
