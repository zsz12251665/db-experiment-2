<template>
	<el-dialog v-model="isVisible" title="Insert a row" :before-close="handleClose">
		<el-form :model="formValue" label-width="100px">
			<el-form-item v-for="key in Object.keys(formValue)" :key="key" :label="key">
				<el-radio-group size="mini" v-if="key == 'Gender'" v-model="formValue[key]">
					<el-radio-button :label="1">Male</el-radio-button>
					<el-radio-button :label="0">Female</el-radio-button>
				</el-radio-group>
				<el-input v-else v-model="formValue[key]" :show-password="key === 'Password'" :placeholder="key" />
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
import { ref, watch } from 'vue'
import { constraintCheck } from '@/misc'

export default {
	name: 'InsertDialog',
	props: { modelValue: Object },
	emits: ['update:modelValue'],
	setup() {
		const isVisible = ref(false);
		const isCancelled = ref(false);
		const show = () => {
			isVisible.value = true;
			isCancelled.value = false;
			return new Promise((resolve, reject) => watch(isVisible, newValue => {
				if (newValue) return;
				if(isCancelled.value) reject("Action cancelled!"); else resolve();
			}));
		};
		return { isVisible, isCancelled, show };
	},
	computed: {
		formValue: {
			get() { return this.modelValue; },
			set(value) { this.$emit('update:modelValue', value); }
		}
	},
	methods: {
		handleClose(done) {
			this.isCancelled = true;
			done();
		},
		handleSubmit() {
			constraintCheck(this.formValue).then(() => this.isVisible = false).catch(this.$message.error);
		}
	}
}
</script>
