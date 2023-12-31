<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><XHeader :actions="headerActions" :tabs="headerTabs"/></template>
	<MkSpacer :contentMax="700" :marginMin="16" :marginMax="32">
		<FormSuspense :p="init">
			<div class="_gaps_m">
				<MkFolder>
					<template #icon><i class="ph-shield ph-bold ph-lg"></i></template>
					<template #label>{{ i18n.ts.botProtection }}</template>
					<template v-if="enableHcaptcha" #suffix>hCaptcha</template>
					<template v-else-if="enableRecaptcha" #suffix>reCAPTCHA</template>
					<template v-else-if="enableTurnstile" #suffix>Turnstile</template>
					<template v-else #suffix>{{ i18n.ts.none }} ({{ i18n.ts.notRecommended }})</template>

					<XBotProtection/>
				</MkFolder>

				<MkFolder>
					<template #label>Active Email Validation</template>
					<template v-if="enableActiveEmailValidation" #suffix>Enabled</template>
					<template v-else #suffix>Disabled</template>

					<div class="_gaps_m">
						<span>{{ i18n.ts.activeEmailValidationDescription }}</span>
						<MkSwitch v-model="enableActiveEmailValidation" @update:modelValue="save">
							<template #label>Enable</template>
						</MkSwitch>
						<MkSwitch v-model="enableVerifymailApi" @update:modelValue="save">
							<template #label>Use Verifymail.io API</template>
						</MkSwitch>
						<MkInput v-model="verifymailAuthKey" @update:modelValue="save">
							<template #prefix><i class="ph-key ph-bold ph-lg"></i></template>
							<template #label>Verifymail.io API Auth Key</template>
						</MkInput>
					</div>
				</MkFolder>

				<MkFolder>
					<template #label>Banned Email Domains</template>

					<div class="_gaps_m">
						<MkTextarea v-model="bannedEmailDomains">
							<template #label>Banned Email Domains List</template>
						</MkTextarea>
						<MkButton primary @click="save"><i class="ph-floppy-disk ph-bold ph-lg"></i> {{ i18n.ts.save }}</MkButton>
					</div>
				</MkFolder>

				<MkFolder>
					<template #label>Log IP address</template>
					<template v-if="enableIpLogging" #suffix>Enabled</template>
					<template v-else #suffix>Disabled</template>

					<div class="_gaps_m">
						<MkSwitch v-model="enableIpLogging" @update:modelValue="save">
							<template #label>Enable</template>
						</MkSwitch>
					</div>
				</MkFolder>

				<MkFolder>
					<template #label>Summaly Proxy</template>

					<div class="_gaps_m">
						<MkInput v-model="summalyProxy">
							<template #prefix><i class="ph-link ph-bold ph-lg"></i></template>
							<template #label>Summaly Proxy URL</template>
						</MkInput>

						<MkButton primary @click="save"><i class="ph-floppy-disk ph-bold ph-lg"></i> {{ i18n.ts.save }}</MkButton>
					</div>
				</MkFolder>
			</div>
		</FormSuspense>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import XBotProtection from './bot-protection.vue';
import XHeader from './_header_.vue';
import MkFolder from '@/components/MkFolder.vue';
import MkRadios from '@/components/MkRadios.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import FormSuspense from '@/components/form/suspense.vue';
import MkRange from '@/components/MkRange.vue';
import MkInput from '@/components/MkInput.vue';
import MkButton from '@/components/MkButton.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import * as os from '@/os.js';
import { fetchInstance } from '@/instance.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';

const summalyProxy = ref<string>('');
const enableHcaptcha = ref<boolean>(false);
const enableRecaptcha = ref<boolean>(false);
const enableTurnstile = ref<boolean>(false);
const enableIpLogging = ref<boolean>(false);
const enableActiveEmailValidation = ref<boolean>(false);
const enableVerifymailApi = ref<boolean>(false);
const verifymailAuthKey = ref<string | null>(null);
const bannedEmailDomains = ref<string>('');

async function init() {
	const meta = await os.api('admin/meta');
	summalyProxy.value = meta.summalyProxy;
	enableHcaptcha.value = meta.enableHcaptcha;
	enableRecaptcha.value = meta.enableRecaptcha;
	enableTurnstile.value = meta.enableTurnstile;
	enableIpLogging.value = meta.enableIpLogging;
	enableActiveEmailValidation.value = meta.enableActiveEmailValidation;
	enableVerifymailApi.value = meta.enableVerifymailApi;
	verifymailAuthKey.value = meta.verifymailAuthKey;
	bannedEmailDomains.value = meta.bannedEmailDomains.join('\n');
}

function save() {
	os.apiWithDialog('admin/update-meta', {
		summalyProxy: summalyProxy.value,
		enableIpLogging: enableIpLogging.value,
		enableActiveEmailValidation: enableActiveEmailValidation.value,
		enableVerifymailApi: enableVerifymailApi.value,
		verifymailAuthKey: verifymailAuthKey.value,
		bannedEmailDomains: bannedEmailDomains.value.split('\n'),
	}).then(() => {
		fetchInstance();
	});
}

const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePageMetadata({
	title: i18n.ts.security,
	icon: 'ph-lock ph-bold ph-lg',
});
</script>
