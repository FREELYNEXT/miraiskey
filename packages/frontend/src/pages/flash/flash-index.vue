<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><MkPageHeader v-model:tab="tab" :actions="headerActions" :tabs="headerTabs"/></template>
	<MkSpacer :contentMax="700">
		<div v-if="tab === 'featured'">
			<MkPagination v-slot="{items}" :pagination="featuredFlashsPagination">
				<div class="_gaps_s">
					<MkFlashPreview v-for="flash in items" :key="flash.id" :flash="flash"/>
				</div>
			</MkPagination>
		</div>

		<div v-else-if="tab === 'my'">
			<div class="_gaps">
				<MkButton gradate rounded style="margin: 0 auto;" @click="create()"><i class="ph-plus ph-bold ph-lg"></i></MkButton>
				<MkPagination v-slot="{items}" :pagination="myFlashsPagination">
					<div class="_gaps_s">
						<MkFlashPreview v-for="flash in items" :key="flash.id" :flash="flash"/>
					</div>
				</MkPagination>
			</div>
		</div>

		<div v-else-if="tab === 'liked'">
			<MkPagination v-slot="{items}" :pagination="likedFlashsPagination">
				<div class="_gaps_s">
					<MkFlashPreview v-for="like in items" :key="like.flash.id" :flash="like.flash"/>
				</div>
			</MkPagination>
		</div>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import MkFlashPreview from '@/components/MkFlashPreview.vue';
import MkPagination from '@/components/MkPagination.vue';
import MkButton from '@/components/MkButton.vue';
import { useRouter } from '@/router.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';

const router = useRouter();

const tab = ref('featured');

const featuredFlashsPagination = {
	endpoint: 'flash/featured' as const,
	noPaging: true,
};
const myFlashsPagination = {
	endpoint: 'flash/my' as const,
	limit: 5,
};
const likedFlashsPagination = {
	endpoint: 'flash/my-likes' as const,
	limit: 5,
};

function create() {
	router.push('/play/new');
}

const headerActions = computed(() => [{
	icon: 'ph-plus ph-bold ph-lg',
	text: i18n.ts.create,
	handler: create,
}]);

const headerTabs = computed(() => [{
	key: 'featured',
	title: i18n.ts._play.featured,
	icon: 'ph-fire ph-bold ph-lg',
}, {
	key: 'my',
	title: i18n.ts._play.my,
	icon: 'ph-pencil-line ph-bold ph-lg',
}, {
	key: 'liked',
	title: i18n.ts._play.liked,
	icon: 'ph-heart ph-bold ph-lg',
}]);

definePageMetadata(computed(() => ({
	title: 'Play',
	icon: 'ph-play ph-bold ph-lg',
})));
</script>
