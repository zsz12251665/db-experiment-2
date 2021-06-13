<template>
	<el-page-header @back="$router.push('/Menu')" content="Query Scores" />
	<el-table stripe border :data="tableData" show-summary :summary-method="summaryMethod">
		<el-table-column sortable v-for="column in tableColumns" :key="column" :prop="column" :label="column" :filters="filters[column]" :filter-method="filterMethod" />
	</el-table>
</template>

<style>
.el-page-header {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	padding: 10px;
}
</style>

<script>
import { objectify, average } from '@/misc'

export default {
	name: 'Student',
	mounted() {
		this.$sql.query(`SELECT \`CID\`, \`Name\` AS \`CName\`, \`Credit\`, \`ChosenYear\`, \`Score\` FROM \`Choose\`, \`Course\` WHERE \`ID\` = \`CID\` AND \`SID\` = ?`, [this.username])
			.then(res => this.tableData = res)
			.catch(err => { console.error(err); this.$message.error('An error occurs!'); });
	},
	data: () => ({
		tableData: []
	}),
	computed: {
		username: () => sessionStorage.getItem('userName'),
		tableColumns() { return this.tableData.length ? Object.keys(this.tableData[0]) : []; },
		filters() { return this.tableColumns.filter(column => column !== 'Score').reduce((acc, cur) => Object.assign(acc, objectify(cur, [...new Set(this.tableData.map(row => row[cur]))].map(value => ({ text: value === null ? 'Null' : value, value })))), {}) }
	},
	methods: {
		filterMethod: (value, row, column) => row[column['property']] === value,
		summaryMethod: param => param.columns.map((column, index) => index === 0 ? 'Average Score' : column.property === 'Score' ? average(param.data.map(row => row[column.property])).toFixed(2) : '')
	}
}
</script>
