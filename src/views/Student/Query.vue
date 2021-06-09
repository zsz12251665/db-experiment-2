<template>
	<el-page-header @back="$router.push('/Menu')" content="Query Scores" />
	<el-table stripe border :data="tableData" show-summary :summary-method="summaryMethod">
		<el-table-column sortable v-for="column in tableColumns" :key="column" :prop="column" :label="column" :filters="filters[column]" :filter-method="filterMethod"></el-table-column>
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
export default {
	name: 'StudentQuery',
	mounted() {
		this.$sql.query(`SELECT * FROM \`Choose\` WHERE \`SID\` = ?`, [this.username])
			.then(res => this.tableData = res);
	},
	data: () => ({
		tableData: []
	}),
	computed: {
		username: () => sessionStorage.getItem('userName'),
		tableColumns() { return this.tableData.length ? Object.keys(this.tableData[0]) : []; },
		filters() {
			const res = {};
			for (const column of this.tableColumns)
				res[column] = [...new Set(this.tableData.map(row => row[column]))].map(value => ({ text: value, value }));
			return res;
		}
	},
	methods: {
		filterMethod: (value, row, column) => row[column['property']] === value,
		summaryMethod(param) {
			const { data } = param;
			const res = [];
			this.tableColumns.forEach(column => {
				if (column === 'Score')
					res.push((data.reduce((acc, cur) => acc + Number(cur[column]), 0) / data.length).toFixed(2));
				else
					res.push('');
			})
			res[0] = 'Average Score';
			return res;
		}
	}
}
</script>
