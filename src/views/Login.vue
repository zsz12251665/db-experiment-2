<template>
	<h1>Log In</h1>
	<el-form :model="user">
		<el-form-item><el-radio v-for="role in roles" :key="role" v-model="user.role" :label="role">{{ role }}</el-radio></el-form-item>
		<el-form-item><el-input placeholder="Username" @keyup.enter="loginSubmit" v-model="user.name" /></el-form-item>
		<el-form-item><el-input placeholder="Password" @keyup.enter="loginSubmit" v-model="user.pass" show-password /></el-form-item>
		<el-form-item><el-button @click="loginSubmit">Login</el-button></el-form-item>
	</el-form>
</template>

<style scoped>
.el-form {
	margin: auto;
	width: max-content;
}
</style>

<script>
export default {
	name: "Login",
	data: () => ({
		roles: ['Student', 'Teacher', 'Administrator'],
		user: { role: 'Student', name: '', pass: '' }
	}),
	methods: {
		async loginSubmit() {
			if (await this.$sql.exists(this.user.role, {'ID': this.user.name, 'Password': this.user.pass}))
			{
				sessionStorage.setItem('userRole', this.user.role);
				sessionStorage.setItem('userName', this.user.name);
				this.$router.push({ name: 'Menu' });
			} else {
				this.user.pass = '';
				this.$message.warning('Login failed!');
			}
		}
	}
}
</script>
