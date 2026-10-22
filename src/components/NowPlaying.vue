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
    const resp = await fetch('http://localhost:8787/api/v1/now_playing');
    await validate(resp)
} else {
    const resp = await fetch('http://localhost:8787/api/v1/now_playing');
    await validate(resp)
}
</script>

<template>
    <section class="content-section reveal" aria-labelledby="now-playing-title">
        <div class="section-heading">
            <h2 id="now-playing-title">Now Playing</h2>
        </div>
        <div class="now-playing" v-if="nowPlaying">
            <div class="artwork-placeholder" aria-hidden="true">
                <img :src="nowPlaying.album.image" class="record-center rounded-lg" />
            </div>
            <div class="track-placeholder">
                <p class="track-title"><a :href="nowPlaying.url" target="_blank" ref="noreferer noopener">{{
                        nowPlaying.name }} - {{ nowPlaying.artist }}</a></p>
                <p class="track-note">{{ nowPlaying.album.name }}</p>
            </div>
        </div>
        <div class="now-playing" v-else>
            <div class="artwork-placeholder" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="17" />
                    <circle cx="24" cy="24" r="10" />
                    <circle class="record-center" cx="24" cy="24" r="3" />
                    <path d="M24 7a17 17 0 0 1 17 17M24 14a10 10 0 0 1 10 10" />
                </svg>
            </div>
            <div class="track-placeholder">
                <p class="track-title" v-if="nowPlaying === null">再生している曲はありません</p>
                <p class="track-title" v-else-if="nowPlaying === undefined">取得中...</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.lastfm-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 10px;
}

.lastfm-label span {
    padding: 1px 7px;
    border: 1px solid var(--outline);
    border-radius: 5px;
    font-size: 9px;
}

.now-playing {
    display: flex;
    align-items: center;
    gap: 17px;
    padding: 18px;
    background: var(--surface);
    border: 1px dashed var(--outline);
    border-radius: 14px;
}

.artwork-placeholder {
    display: grid;
    place-items: center;
    flex: 0 0 65px;
    height: 65px;
    border-radius: 10px;
    color: var(--primary);
    background: var(--surface-container);
}

svg {
    width: 47px;
    height: 47px;
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

.track-placeholder {
    min-width: 0;
}

.track-title {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
}

.track-note {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 10px;
    line-height: 1.9;
}

@media (max-width: 360px) {
    .now-playing {
        padding: 14px;
        gap: 12px;
    }

    .artwork-placeholder {
        flex-basis: 52px;
        height: 52px;
    }

    svg {
        width: 39px;
        height: 39px;
    }
}
</style>
