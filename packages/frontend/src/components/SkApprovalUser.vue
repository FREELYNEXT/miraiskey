<template>
<MkFolder :expanded="false">
	<template #icon><i class="ph-user ph-bold ph-lg"></i></template>
	<template #label>{{ i18n.ts.user }}: {{ user.username }}</template>

	<div class="_gaps_s" :class="$style.root">
		<div :class="$style.items">
			<div>
				<div :class="$style.label">{{ i18n.ts.createdAt }}</div>
				<div><MkTime :time="user.createdAt" mode="absolute"/></div>
			</div>
			<div v-if="email">
				<div :class="$style.label">{{ i18n.ts.emailAddress }}</div>
				<div>{{ email }}</div>
			</div>
			<div>
				<div :class="$style.label">Reason</div>
				<div>{{ reason }}</div>
			</div>
		</div>
		<div :class="$style.buttons">
			<MkButton inline success @click="approveAccount(user)">{{ i18n.ts.approveAccount }}</MkButton>
			<MkButton inline danger @click="deleteAccount(user)">{{ i18n.ts.denyAccount }}</MkButton>
		</div>
	</div>
</MkFolder>
</template>

<script lang="ts" setup>
import * as Misskey from 'misskey-js';
import MkFolder from '@/components/MkFolder.vue';
import MkButton from '@/components/MkButton.vue';
import { i18n } from '@/i18n.js';
import * as os from '@/os.js';

const props = defineProps<{
	user: Misskey.entities.User;
}>();

let reason = $ref('');
let email = $ref('');

function getReason() {
	return os.api('admin/show-user', {
		userId: props.user.id,
	}).then(info => {
		reason = info?.signupReason;
		email = info?.email;
	});
}
getReason();

const emits = defineEmits<{
	(event: 'deleted', value: string): void;
}>();

async function deleteAccount(user) {
	const confirm = await os.confirm({
		type: 'warning',
		text: i18n.ts.deleteAccountConfirm,
	});
	if (confirm.canceled) return;

	const typed = await os.inputText({
		text: i18n.t('typeToConfirm', { x: user?.username }),
	});
	if (typed.canceled) return;

	if (typed.result === user?.username) {
		await os.apiWithDialog('admin/delete-account', {
			userId: user.id,
		});
		emits('deleted', user.id);
	} else {
		os.alert({
			type: 'error',
			text: 'input not match',
		});
	}
}

async function approveAccount(user) {
	const confirm = await os.confirm({
		type: 'warning',
		text: i18n.ts.approveConfirm,
	});
	if (confirm.canceled) return;
	await os.api('admin/approve-user', { userId: user.id });
	emits('deleted', user.id);
}
</script>

<style lang="scss" module>
.root {
	text-align: left;
}

.items {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	grid-gap: 12px;
}

.label {
	font-size: 0.85em;
	padding: 0 0 8px 0;
	user-select: none;
	opacity: 0.7;
}
.buttons {
	display: flex;
	gap: 8px;
}
</style>