<script setup>
import WindowMin from '@/components/icons/WindowMin.vue'
import WindowMax from '@/components/icons/WindowMax.vue'
import WindowClose from '@/components/icons/WindowClose.vue'
import { computed } from 'vue'
// import { useThemeVars } from 'naive-ui'
import { useThemeVars } from '@/utils/theme_vars.js'
import usePreferencesStore from 'stores/preferences.js'
import { Quit, WindowMinimise, WindowToggleMaximise } from 'wailsjs/runtime/runtime.js'
import WindowRestore from '@/components/icons/WindowRestore.vue'

// const themeVars = useThemeVars()
const prefStore = usePreferencesStore()
const themeVars = computed(() => {
    return useThemeVars(prefStore.isDark)
})
const props = defineProps({
    size: {
        type: Number,
        default: 35,
    },
    maximised: {
        type: Boolean,
    },
})

const buttonSize = computed(() => {
    return props.size + 'px'
})

const handleMinimise = async () => {
    WindowMinimise()
}

const handleMaximise = () => {
    WindowToggleMaximise()
}

const handleClose = () => {
    Quit()
}
</script>

<template>
    <el-space :size="0" :wrap-item="false" align="center" justify="center">
        <el-tooltip :show-after="1000" :show-arrow="false">
            <template #content>
                {{ $t('menu.minimise') }}
            </template>
            <div class="btn-wrapper" @click="handleMinimise">
                <window-min />
            </div>
        </el-tooltip>
        <el-tooltip v-if="maximised" :show-after="1000" :show-arrow="false">
            <template #content>
                {{ $t('menu.restore') }}
            </template>
            <div class="btn-wrapper" @click="handleMaximise">
                <window-restore />
            </div>
        </el-tooltip>
        <el-tooltip v-else :show-after="1000" :show-arrow="false">
            <template #content>
                {{ $t('menu.maximise') }}
            </template>
            <div class="btn-wrapper" @click="handleMaximise">
                <window-max />
            </div>
        </el-tooltip>
        <el-tooltip :show-after="1000" :show-arrow="false">
            <template #content>
                {{ $t('menu.close') }}
            </template>
            <div class="btn-wrapper" @click="handleClose">
                <window-close />
            </div>
        </el-tooltip>
    </el-space>
</template>

<style lang="scss" scoped>
.btn-wrapper {
    width: v-bind('buttonSize');
    height: v-bind('buttonSize');
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    --wails-draggable: none;

    &:hover {
        cursor: pointer;
    }

    &:not(:last-child) {
        &:hover {
            background-color: v-bind('themeVars.closeColorHover');
        }

        &:active {
            background-color: v-bind('themeVars.closeColorPressed');
        }
    }

    &:last-child {
        &:hover {
            background-color: v-bind('themeVars.primaryColorHover');
        }

        &:active {
            background-color: v-bind('themeVars.primaryColorPressed');
        }
    }
}
</style>
