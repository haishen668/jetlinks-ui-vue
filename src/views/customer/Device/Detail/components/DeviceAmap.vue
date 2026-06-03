<template>
    <div class="device-amap">
        <AMapComponent :center="center" :zoom="zoom" :zooms="zooms">
            <el-amap-label-marker
                :position="center"
                :text="markerText"
                :icon="markerIcon"
            />
        </AMapComponent>
    </div>
</template>

<script lang="ts" setup>
import AMapComponent from '@/components/AMapComponent/index.vue';

const props = withDefaults(
    defineProps<{
        center?: number[];
        zooms?: number[];
        zoom?: number;
        text?: string;
    }>(),
    {
        center: () => [116.397428, 39.90923],
        zooms: () => [3, 20],
        zoom: 13,
        text: '',
    },
);

const markerText = computed(() => ({
    content: props.text,
    style: {
        fontSize: 13,
        fillColor: 'black',
        strokeColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        strokeWidth: 5,
        padding: '0 0',
    },
}));

const markerIcon = {
    image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
    anchor: 'bottom-center',
    size: [25, 34],
    clipOrigin: [280, 0],
    clipSize: [50, 68],
};
</script>

<style scoped>
.device-amap {
    width: 100%;
    height: 300px;
}
</style>
