<template>
	<h1>Welcome to MIS</h1>
	<el-form :model="user">
		<el-form-item><el-radio v-for="role in roles" :key="role" v-model="user.role" :label="role">{{ role }}</el-radio></el-form-item>
		<el-form-item><el-input placeholder="Username" @keyup.enter="loginSubmit" v-model="user.name" /></el-form-item>
		<el-form-item><el-input placeholder="Password" @keyup.enter="loginSubmit" v-model="user.pass" show-password /></el-form-item>
		<el-form-item><el-button @click="loginSubmit">Login</el-button></el-form-item>
	</el-form>
</template>

<script>
export default {
	name: "Login",
	data: () => ({
		user: { role: 'Student', name: '', pass: '' },
		roles: ["Student", "Teacher", "Administrator"]
	}),
	methods: {
		async loginSubmit() {
			const res = await this.$sql(`SELECT 1 FROM \`${this.user.role}\` WHERE \`${this.user.role[0]}ID\` = ? AND \`Password\` = ?`, [this.user.name, this.user.pass]);
			if (res.length)
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
