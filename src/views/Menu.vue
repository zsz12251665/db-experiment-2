<template>
	<h1>Hello, {{userrole}} {{username}}. </h1>
	<div class="menu">
		<el-button v-if="userrole == 'Teacher'">Modify Student Scores</el-button>
		<el-button v-if="userrole == 'Administrator'">Modify Student Information</el-button>
		<el-button v-if="userrole == 'Administrator'">Modify Teacher Information</el-button>
		<el-button v-if="userrole == 'Administrator'">Modify Course Information</el-button>
		<el-button v-if="userrole == 'Administrator'">Modify Course Choosing Information</el-button>
		<el-button v-if="userrole == 'Administrator'">Modify Course Teaching Information</el-button>
		<el-button @click="passwordDialogVisible = true">Change Password</el-button>
		<el-button @click="logout">Log Out</el-button>
	</div>
	<PasswordDialog v-model="passwordDialogVisible" />
</template>

<script>
import PasswordDialog from '../components/PasswordDialog.vue'

export default {
	name: 'Menu',
	components: { PasswordDialog },
	data: () => ({
		passwordDialogVisible: false
	}),
	computed: {
		username: () => sessionStorage.getItem('userName'),
		userrole: () => sessionStorage.getItem('userRole')
	},
	methods: {
		logout() {
			sessionStorage.clear();
			this.$router.push({ name: 'Login' });
		}
	}
}
</script>
