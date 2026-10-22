<script setup lang="ts">
import { ref } from 'vue';

type nowPlayingApiResp = {
    name: string,
    artist: string,
    album: {
        name: string,
        image: string
    },
    url: string
};

const isProd = import.meta.env.PROD;

const nowPlaying = ref<nowPlayingApiResp | null | undefined>(undefined);

const validate = async (resp: Response) => {
    if (resp.status === 200) {
        const data: {
            name: string,
            artist: string,
            album: {
                name: string,
                image: string
            },
            url: string
        } = await resp.json();
        nowPlaying.value = data;
    } else {
        nowPlaying.value = null;
    }
}

if (isProd) {
    const resp = await fetch('https://cfw-lastfm-proxy.amase-cocoa.workers.dev/api/v1/now_playing');
    await validate(resp)
} else {
    const resp = await fetch('http://localhost:8787/api/v1/now_playing');
    await validate(resp)
}
</script>

<template>
    <section class="content-section reveal" aria-labelledby="now-playing-title">
        <div class="section-heading flex items-center justify-between gap-4 mb-4">
            <h2 id="now-playing-title">Now Playing</h2>
        </div>
        <div class="now-playing flex items-center gap-[17px] p-[18px] bg-surface rounded-[14px] max-[360px]:p-[14px] max-[360px]:gap-3" v-if="nowPlaying">
            <div class="artwork-placeholder grid place-items-center flex-[0_0_65px] h-[65px] rounded-[10px] text-primary bg-surface-container max-[360px]:basis-13 max-[360px]:h-13" aria-hidden="true">
                <img :src="nowPlaying.album.image" class="record-center rounded-lg" />
            </div>
            <div class="track-placeholder min-w-0">
                <p class="track-title m-0 text-[12px] font-medium"><a :href="nowPlaying.url" target="_blank" ref="noreferer noopener">{{
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
                <p class="track-title m-0 text-[12px] font-medium" v-if="nowPlaying === null">再生している曲はありません</p>
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
