<template>
	<el-dialog v-model="isVisible" title="Insert a row" :before-close="handleClose">
		<el-form :model="formValue" label-width="100px">
			<el-form-item v-for="key in Object.keys(formValue)" :key="key" :label="key">
				<el-input v-if="key != 'Gender'" :placeholder="key" v-model="formValue[key]" :show-password="key === 'Password'" />
				<el-radio-group size="mini" v-if="key == 'Gender'" v-model="formValue[key]">
					<el-radio-button :label="1">Male</el-radio-button>
					<el-radio-button :label="0">Female</el-radio-button>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="handleSubmit">OK</el-button>
				<el-button @click="handleClose(() => isVisible = false)">Cancel</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { reactive, ref, watch } from 'vue'

export default {
	name: 'InsertDialog',
	setup() {
		let isVisible = ref(false);
		let formValue = reactive({});
		const show = form => {
			for (const key in formValue) delete formValue[key];
			for (const key in form) formValue[key] = form[key];
			isVisible.value = true;
			return new Promise((resolve, reject) => watch(isVisible, newValue => {
				if (newValue) return;
				if (Object.keys(formValue).length)
					resolve(formValue);
				else
					reject("Action cancelled!");
			}));
		};
		return { isVisible, formValue, show };
	},
	methods: {
		async constriantCheck() {
			if (this.formValue['EntranceAge'] !== undefined && (10 > this.formValue['EntranceAge'] || this.formValue['EntranceAge'] > 50))
				throw 'Entrance age should be between 10 and 50!';
			if (this.formValue['Credit'] !== undefined && this.formValue['Credit'] <= 0)
				throw 'Credit should be greater than 0!';
			if (this.formValue['ChosenYear'] !== undefined && !(await this.$sql.query(`SELECT 1 FROM \`Course\` WHERE \`ID\` = ? AND \`CancelledYear\` > ?`, [this.formValue['CID'], this.formValue['ChosenYear']])).length)
				throw 'The course has been cancelled before the chosen year!';
			if (this.formValue['CancelledYear'] !== undefined && (await this.$sql.query(`SELECT 1 FROM \`Choose\` WHERE \`CID\` = ? AND \`ChosenYear\` > ?`, [this.formValue['ID'], this.formValue['CancelledYear']])).length)
				throw 'Some students have chosen the course after the cancelled year!';
		},
		handleClose(done) {
			for (const key in this.formValue)
				delete this.formValue[key];
			done();
		},
		async handleSubmit() {
			try {
				await this.constriantCheck();
			} catch (err) {
				this.$message.error(err);
				return;
			}
			this.isVisible = false;
		}
	}
}
</script>
