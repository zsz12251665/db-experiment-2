<template>
	<el-page-header @back="$router.push('/Menu')" content="Modify Scores" />
	<el-table stripe border :data="tableData" show-summary :summary-method="summaryMethod">
		<el-table-column sortable v-for="column in tableColumns" :key="column" :prop="column" :label="column" :filters="filters[column]" :filter-method="filterMethod">
			<template #default="scope">
				<el-input size="mini" v-if="column == 'Score'" v-model="scores[tableData.indexOf(scope.row)]" @change="handleModify(scope.$index)" placeholder="Null"/>
				<span v-else>{{ scope.row[column] }}</span>
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
import { objectify, average } from '@/misc'

export default {
	name: 'Teacher',
	mounted() {
		this.$sql.query(`SELECT \`SID\`, \`Student\`.\`Name\` AS \`SName\`, \`CID\`, \`Course\`.\`Name\` AS \`CName\`, \`ChosenYear\`, \`Score\` FROM \`Choose\`, \`Course\`, \`Student\` WHERE \`Course\`.\`ID\` = \`CID\` AND \`Student\`.\`ID\` = \`SID\` AND \`TID\` = ?`, [this.username])
			.then(res => Object.assign(this, { tableData: res, scores: res.map(row => row['Score']) }))
			.catch(err => { console.error(err); this.$message.error('An error occurs!'); });
	},
	data: () => ({
		tableData: [],
		scores: []
	}),
	computed: {
		username: () => sessionStorage.getItem('userName'),
		tableColumns() { return this.tableData.length ? Object.keys(this.tableData[0]) : []; },
		filters() { return this.tableColumns.filter(column => column !== 'Score').reduce((acc, cur) => Object.assign(acc, objectify(cur, [...new Set(this.tableData.map(row => row[cur]))].map(value => ({ text: value === null ? 'Null' : value, value })))), {}) }
	},
	methods: {
		filterMethod: (value, row, column) => row[column['property']] === value,
		summaryMethod: param => param.columns.map((column, index) => index === 0 ? 'Average Score' : column.property === 'Score' ? average(param.data.map(row => row[column.property])).toFixed(2) : ''),
		handleModify(row) {
			const newValue = this.scores[row] === '' ? null : this.scores[row];
			if (this.tableData[row]['Score'] === newValue) return;
			if (newValue !== null && 0 <= newValue && newValue <= 100) {
				this.$sql.update('Choose', this.tableData[row], 'Score', newValue)
					.then(() => this.tableData[row]['Score'] = newValue)
					.catch(err => { console.error(err); this.$message.error('An error occurs!'); });
			} else {
				this.$message.error('Score must be a number between 0 and 100!');
				this.scores[row] = this.tableData[row]['Score'];
			}
		}
	}
}
</script>
