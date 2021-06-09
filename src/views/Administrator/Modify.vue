<template>
	<el-page-header @back="$router.push('/Menu')" :content="$route.params.tableName" />
	<el-table stripe border :data="tableData" :show-summary="tableName === 'Choose'" :summary-method="summaryMethod">
		<el-table-column sortable v-for="column in tableColumns" :key="column" :prop="column">
			<template #header>
				<el-input size="mini" v-model="filters[column]" :placeholder="column" />
			</template>
			<template #default="scope">
				<span v-if="modifyingRow != rawData.indexOf(scope.row) || modifyingColumn != column" @dblclick="handleModify(rawData.indexOf(scope.row), column)">{{ column === 'Password' ? '******' : column === 'Gender' ? scope.row[column] == true ? 'Male' : 'Female' : scope.row[column] }}</span>
				<el-input size="mini" v-if="column != 'Gender' && modifyingRow == rawData.indexOf(scope.row) && modifyingColumn == column" v-model="modifyingValue" @keyup.enter="handleModify()" @keyup.esc="modifyingRow = -1, modifyingColumn = '', modifyingValue = ''" :show-password="column === 'Password'" :placeholder="column" />
				<el-radio-group size="mini" v-if="column == 'Gender' && modifyingRow == rawData.indexOf(scope.row) && modifyingColumn == column" v-model="modifyingValue">
					<el-radio-button :label="1" @click="{ modifyingValue = 1; handleModify(); }">Male</el-radio-button>
					<el-radio-button :label="0" @click="{ modifyingValue = 0; handleModify(); }">Female</el-radio-button>
				</el-radio-group>
			</template>
		</el-table-column>
		<el-table-column align="center">
			<template #header><el-button type="primary" size="mini" @click="handleInsert">Insert</el-button></template>
			<template #default="scope"><el-button type="danger" size="mini" @click="handleDelete(rawData.indexOf(scope.row))">Remove</el-button></template>
		</el-table-column>
	</el-table>
	<InsertDialog ref="insertDialog" />
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

export default {
	name: 'AdministratorModify',
	components: { InsertDialog },
	setup() {
		const insertDialog = ref();
		const showInsertDialog = form => insertDialog.value.show(form);
		return { insertDialog, showInsertDialog };
	},
	mounted() {
		this.$sql.query(`SELECT * FROM \`${this.tableName}\``).then(res => {
			this.rawData = res;
			this.filters = {};
			for (const column of this.tableColumns) this.filters[column] = '';
		});
	},
	data: () => ({
		rawData: [],
		modifyingRow: -1,
		modifyingColumn: '',
		modifyingValue: '',
		filters: {}
	}),
	computed: {
		tableName() { return this.$route.params.tableName; },
		tableColumns() { return this.rawData.length ? Object.keys(this.rawData[0]) : []; },
		tableData() { return this.tableColumns.reduce((acc, cur) => acc.filter(row => String(row[cur]).includes(this.filters[cur])), this.rawData); },
		modifyingRowData() { return this.rawData[this.modifyingRow]; }
	},
	methods: {
		summaryMethod() {
			const res = [];
			this.tableColumns.forEach(column => {
				if (column === 'Score')
					res.push((this.tableData.reduce((acc, cur) => acc + Number(cur[column]), 0) / this.tableData.length).toFixed(2));
				else
					res.push('');
			})
			res[0] = 'Average Score';
			return res;
		},
		async constraintCheck() {
			if (this.modifyingColumn === 'EntranceAge' && (10 > this.modifyingValue || this.modifyingValue > 50))
				throw 'Entrance age should be between 10 and 50!';
			if (this.modifyingColumn === 'Credit' && this.modifyingValue <= 0)
				throw 'Credit should be greater than 0!';
			if (this.modifyingColumn === 'ChosenYear' && !(await this.$sql.query(`SELECT 1 FROM \`Course\` WHERE \`ID\` = ? AND \`CancelledYear\` > ?`, [this.modifyingRowData['CID'], this.modifyingValue])).length)
				throw 'The course has been cancelled before the chosen year!';
			if (this.modifyingColumn === 'CancelledYear' && (await this.$sql.query(`SELECT 1 FROM \`Choose\` WHERE \`CID\` = ? AND \`ChosenYear\` > ?`, [this.modifyingRowData['ID'], this.modifyingValue])).length)
				throw 'Some students have chosen the course after the cancelled year!';
		},
		handleError(err) {
			this.$message.error('An error occurs!');
			console.error(err);
		},
		handleInsert() {
			const formValue = {};
			for (const column of this.tableColumns) if (column !== 'Score') formValue[column] = '';
			this.showInsertDialog(formValue).then(res => {
				for (const key in res) if (res[key] === '') res[key] = null;
				this.$sql.insert(this.tableName, res)
					.then(() => this.rawData.push(res))
					.catch(this.handleError);
			}).catch (err => { if (err !== 'Action cancelled!') this.handleError(err); });
		},
		async handleModify(row = -1, column = '') {
			if (column === 'Score') return;
			try { await this.constraintCheck(); } catch (err) { this.$message.error(err); return; }
			if (this.modifyingValue === '') this.modifyingValue = null;
			if (this.modifyingRow !== -1)
				try {
					await this.$sql.update(this.tableName, this.modifyingRowData, this.modifyingColumn, this.modifyingValue);
					this.rawData[this.modifyingRow][this.modifyingColumn] = this.modifyingValue;
				} catch (err) {
					this.handleError(err);
				}
			Object.assign(this, { modifyingRow: row, modifyingColumn: column, modifyingValue: column ? this.rawData[row][column] : null });
		},
		handleDelete(index) {
			this.$confirm('Are you sure to remove this row?').then(() => {
				this.$sql.remove(this.tableName, this.rawData[index])
					.then(() => this.rawData.splice(index, 1))
					.catch(this.handleError);
			}).catch(() => {});
		}
	}
}
</script>
