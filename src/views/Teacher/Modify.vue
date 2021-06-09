<template>
	<el-page-header @back="$router.push('/Menu')" content="Modify Scores" />
	<el-table stripe border :data="tableData" show-summary :summary-method="summaryMethod">
		<el-table-column sortable v-for="column in tableColumns" :key="column" :prop="column" :label="column" :filters="filters[column]" :filter-method="filterMethod">
			<template #default="scope">
				<span v-if="column != 'Score'">{{ scope.row[column] }}</span>
				<el-input size="mini" v-if="column == 'Score'" v-model="modifyValues[tableData.indexOf(scope.row)]" @change="handleModify(scope.$index)" placeholder="Null"/>
			</template>
		</el-table-column>
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
	name: 'TeacherModify',
	mounted() {
		this.$sql.query(`SELECT \`Choose\`.* FROM \`Choose\`, \`Course\` WHERE \`ID\` = \`CID\` AND \`TID\` = ?`, [this.username])
			.then(res => {
				this.modifyValues = res.map(row => row['Score']);
				this.tableData = res;
			});
	},
	data: () => ({
		tableData: [],
		modifyValues: []
	}),
	computed: {
		username: () => sessionStorage.getItem('userName'),
		tableColumns() { return this.tableData.length ? Object.keys(this.tableData[0]) : []; },
		filters() {
			const res = {};
			for (const column of this.tableColumns)
				if (column !== 'Score')
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
		},
		handleModify(row) {
			const newValue = this.modifyValues[row] === '' ? null : this.modifyValues[row];
			if (this.tableData[row]['Score'] === newValue)
				return;
			if (newValue !== null && 0 <= newValue && newValue <= 100) {
				this.$sql.update('Choose', this.tableData[row], 'Score', newValue)
					.then(() => this.tableData[row]['Score'] = newValue);
			} else {
				this.$message.error('Score must be a number between 0 and 100!');
				this.modifyValues[row] = this.tableData[row]['Score'];
			}
		}
	}
}
</script>
