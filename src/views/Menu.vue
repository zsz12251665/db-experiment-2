<template>
	<h1>Hello, {{ userrole }} {{ username }}. </h1>
	<div class="menu">
		<div v-if="userrole === 'Student'">
			<el-button @click="$router.push('/Student')">Query Scores</el-button>
		</div>
		<div v-if="userrole === 'Teacher'">
			<el-button @click="$router.push('/Teacher')">Modify Student Scores</el-button>
		</div>
		<div v-if="userrole === 'Administrator'">
			<el-button v-for="tableName in tableNames" :key="tableName" @click="$router.push(`/Administrator/${tableName}`)">Modify {{ tableName }} Information</el-button>
		</div>
		<div>
			<el-button @click="showPasswordDialog">Change Password</el-button>
			<el-button @click="logout">Log Out</el-button>
		</div>
	</div>
	<PasswordDialog ref="passwordDialog" />
</template>

<style scoped>
.el-button {
	display: block;
	margin: 0.5em auto;
}
</style>

<script>
import { ref } from 'vue'
import PasswordDialog from '@/components/PasswordDialog.vue'

export default {
	name: 'Menu',
	components: { PasswordDialog },
	setup() {
		const passwordDialog = ref();
		const showPasswordDialog = () => passwordDialog.value.show();
		return { passwordDialog, showPasswordDialog };
	},
	data: () => ({
		tableNames: ['Administrator', 'Student', 'Teacher', 'Course', 'Choose']
	}),
	computed: {
		username: () => sessionStorage.getItem('userName'),
		userrole: () => sessionStorage.getItem('userRole')
	},
	methods: {
		logout() {
			sessionStorage.clear();
			this.$router.push('/Login');
		}
	}
}
</script>
