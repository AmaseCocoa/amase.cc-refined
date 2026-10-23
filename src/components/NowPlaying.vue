<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

type NowPlaying = {
  name: string;
  artist: string;
  album: {
    name: string;
    image: string;
  };
  url: string;
};

const endpoint = import.meta.env.PROD
  ? 'https://cfw-lastfm-proxy.amase-cocoa.workers.dev/api/v1/now_playing'
  : 'http://localhost:8787/api/v1/now_playing';

const nowPlaying = ref<NowPlaying | null | undefined>(undefined);
const failed = ref(false);
const loading = computed(() => nowPlaying.value === undefined && !failed.value);
let controller: AbortController | undefined;

async function loadNowPlaying() {
  controller?.abort();
  const request = new AbortController();
  controller = request;
  nowPlaying.value = undefined;
  failed.value = false;

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(8000)]),
      cache: 'no-store',
    });
    if (response.status === 204 || response.status === 404) {
      nowPlaying.value = null;
      return;
    }
    if (!response.ok) throw new Error('Now Playing unavailable');
    nowPlaying.value = await response.json();
  } catch {
    if (!request.signal.aborted) failed.value = true;
  }
}

onMounted(() => void loadNowPlaying());
onUnmounted(() => controller?.abort());
</script>

<template>
    <section class="content-section reveal" aria-labelledby="now-playing-title" aria-live="polite" :aria-busy="loading">
        <div class="section-heading flex items-center justify-between gap-4 mb-4">
            <h2 id="now-playing-title">Now Playing</h2>
            <button
                type="button"
                class="subtle-link cursor-pointer border-0 bg-transparent p-0 min-h-8 inline-flex items-center gap-2 whitespace-nowrap text-[10px] text-primary disabled:cursor-wait disabled:opacity-50"
                aria-label="再生情報を更新"
                :disabled="loading"
                @click="loadNowPlaying"
            >
                <span aria-hidden="true">↻</span> {{ loading ? '更新中…' : '更新' }}
            </button>
        </div>
        <div class="now-playing flex items-center gap-[17px] p-[18px] bg-surface rounded-[14px] max-[360px]:p-[14px] max-[360px]:gap-3" v-if="nowPlaying">
            <div class="artwork-placeholder grid place-items-center flex-[0_0_65px] h-[65px] rounded-[10px] text-primary bg-surface-container max-[360px]:basis-13 max-[360px]:h-13" aria-hidden="true">
                <img :src="nowPlaying.album.image" class="record-center rounded-lg" alt="" />
            </div>
            <div class="track-placeholder min-w-0">
                <p class="track-title m-0 text-[12px] font-medium"><a :href="nowPlaying.url" target="_blank" rel="noreferrer noopener">{{
                        nowPlaying.name }} - {{ nowPlaying.artist }}</a></p>
                <p class="track-note m-[6px_0_0] text-muted text-[10px] leading-[1.9]">{{ nowPlaying.album.name }}</p>
            </div>
        </div>
        <div class="now-playing flex items-center gap-[17px] p-[18px] bg-surface rounded-[14px] max-[360px]:p-[14px] max-[360px]:gap-3" v-else>
            <div class="artwork-placeholder grid place-items-center flex-[0_0_65px] h-[65px] rounded-[10px] text-primary bg-surface-container max-[360px]:basis-13 max-[360px]:h-13" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="17" />
                    <circle cx="24" cy="24" r="10" />
                    <circle class="record-center" cx="24" cy="24" r="3" />
                    <path d="M24 7a17 17 0 0 1 17 17M24 14a10 10 0 0 1 10 10" />
                </svg>
            </div>
            <div class="track-placeholder min-w-0">
                <p class="track-title m-0 text-[12px] font-medium" v-if="failed">曲の情報を取得できませんでした。更新ボタンから再試行できます。</p>
                <p class="track-title m-0 text-[12px] font-medium" v-else-if="nowPlaying === null">再生している曲はありません</p>
                <p class="track-title m-0 text-[12px] font-medium" v-else-if="nowPlaying === undefined">取得中...</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
@reference "../styles/global.css";

.lastfm-label {
  @apply inline-flex items-center gap-[10px] text-muted text-[10px];
}

.lastfm-label span {
  @apply p-[1px_7px] rounded-[5px] text-[9px];
  border: 1px solid var(--outline);
}
.now-playing {
  border: 1px dashed var(--outline);
}

svg {
  @apply w-[47px] h-[47px];
}

svg circle {
  stroke: var(--outline);
  stroke-width: 1.4;
}

svg path {
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}
.record-center {
  stroke: currentColor;
}

@media (max-width: 360px) {
  svg {
    @apply w-[39px] h-[39px];
  }
}
</style>
