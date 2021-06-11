<template>
	<el-page-header @back="$router.push('/Menu')" :content="$route.params.tableName" />
	<el-table stripe border :data="tableData" :show-summary="tableName === 'Choose'" :summary-method="summaryMethod">
		<el-table-column sortable v-for="column in tableColumns" :key="column" :prop="column" :label="column" :filters="filters[column]" :filter-method="filterMethod">
			<template #default="scope">
				<span v-if="modifier.row == tableData.indexOf(scope.row) && modifier.column == column">
					<el-radio-group size="mini" v-if="column == 'Gender'" v-model="modifier.value" @change="handleModify()" @keyup.esc="cancelModify">
						<el-radio-button :label="1">Male</el-radio-button>
						<el-radio-button :label="0">Female</el-radio-button>
					</el-radio-group>
					<el-input size="mini" :show-password="column === 'Password'" :placeholder="column" v-else v-model="modifier.value" @keyup.enter="handleModify()" @keyup.esc="cancelModify" />
				</span>
				<span v-else @dblclick="handleModify(tableData.indexOf(scope.row), column)">{{ column === 'Password' ? '******' : column === 'Gender' ? scope.row[column] == true ? 'Male' : 'Female' : scope.row[column] === null ? 'Null' : scope.row[column] }}</span>
			</template>
		</el-table-column>
		<el-table-column align="center">
			<template #header><el-button type="primary" size="mini" @click="handleInsert">Insert</el-button></template>
			<template #default="scope"><el-button type="danger" size="mini" @click="handleDelete(tableData.indexOf(scope.row))">Remove</el-button></template>
		</el-table-column>
	</el-table>
	<InsertDialog ref="insertDialog" v-model="insertValue" />
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
import { ref } from 'vue'
import InsertDialog from '@/components/InsertDialog.vue'
import { constraintCheck, objectify, average } from '@/misc'

export default {
	name: 'AdministratorView',
	components: { InsertDialog },
	setup() {
		const insertDialog = ref();
		const showInsertDialog = () => insertDialog.value.show();
		return { insertDialog, showInsertDialog };
	},
	mounted() { this.$sql.query(`SELECT * FROM \`${this.tableName}\``).then(res => this.tableData = res).catch(this.handleError); },
	data: () => ({
		tableData: [],
		modifier: {
			row: -1,
			column: '',
			value: null
		},
		insertValue: {}
	}),
	computed: {
		tableName() { return this.$route.params.tableName; },
		tableColumns() { return this.tableData.length ? Object.keys(this.tableData[0]) : []; },
		filters() { return this.tableColumns.filter(column => column !== 'Score').reduce((acc, cur) => Object.assign(acc, objectify(cur, [...new Set(this.tableData.map(row => row[cur]))].map(value => ({ text: value === null ? 'Null' : value, value })))), {}) }
	},
	methods: {
		filterMethod: (value, row, column) => row[column['property']] === value,
		summaryMethod: param => param.columns.map((column, index) => index === 0 ? 'Average Score' : column.property === 'Score' ? average(param.data.map(row => row[column.property])).toFixed(2) : ''),
		handleError(err) { console.error(err); this.$message.error('An error occurs!'); },
		cancelModify() { this.modifier = { row: -1, column: '', value: null }; },
		handleInsert() {
			this.insertValue = {};
			for (const column of this.tableColumns) if (column !== 'Score') this.insertValue[column] = '';
			this.showInsertDialog().then(() => {
				for (const key in this.insertValue) if (this.insertValue[key] === '') this.insertValue[key] = null;
				this.$sql.insert(this.tableName, this.insertValue)
					.then(() => this.tableData.push(Object.assign(this.insertValue, this.tableColumns.includes('Score') ? { 'Score': null } : {})))
					.catch(this.handleError);
			}).catch(err => { if (err !== 'Action cancelled!') this.handleError(err); });
		},
		handleModify(row = -1, column = '') {
			if (column === 'Score') return;
			if (this.modifier.row !== -1) {
				if (this.modifier.value === '') this.modifier.value = null;
				constraintCheck(objectify(this.modifier.column, this.modifier.value)).then(() => {
					this.$sql.update(this.tableName, this.tableData[this.modifier.row], this.modifier.column, this.modifier.value).then(() => {
						this.tableData[this.modifier.row][this.modifier.column] = this.modifier.value;
						this.modifier = { row, column, value: column ? this.tableData[row][column] : null };
					}).catch(this.handleError);
				}).catch(this.$message.error);
			} else
				this.modifier = { row, column, value: column ? this.tableData[row][column] : null };
		},
		handleDelete(index) {
			this.$confirm('Are you sure to remove this row?').then(() => {
				if (index === this.modifier.row) this.cancelModify();
				this.$sql.remove(this.tableName, this.tableData[index])
					.then(() => this.tableData.splice(index, 1))
					.catch(this.handleError);
			}).catch(() => {});
		}
	}
}
</script>
