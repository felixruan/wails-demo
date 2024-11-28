<script setup>
import iconUrl from '@/assets/images/icon.png'
import useDialog from 'stores/dialog.js'
// import { useThemeVars } from 'naive-ui'
import { useThemeVars } from '@/utils/theme_vars.js'
import usePreferencesStore from 'stores/preferences.js'
import { BrowserOpenURL } from 'wailsjs/runtime/runtime.js'
import { GetAppVersion } from 'wailsjs/go/services/preferencesService.js'
import { computed, onMounted, ref } from 'vue'

// const themeVars = useThemeVars()
const prefStore = usePreferencesStore()
const themeVars = computed(() => {
    return useThemeVars(prefStore.isDark)
})
const dialogStore = useDialog()
const version = ref('')

onMounted(() => {
    GetAppVersion().then(({ data }) => {
        version.value = data.version
    })
})

const onOpenSource = () => {
    BrowserOpenURL('https://github.com/tiny-craft/tiny-rdm')
}

const onOpenWebsite = () => {
    BrowserOpenURL('https://redis.tinycraft.cc/')
}
</script>

<template>
    <el-dialog v-model="dialogStore.aboutDialogVisible" align-center center>
        <el-space :size="10" :wrap="false" alignment="center" direction="vertical" style="width: 100%">
            <el-avatar :size="120" :src="iconUrl" color="#0000"></el-avatar>
            <div class="about-app-title">Demo</div>
            <el-text>{{ version }}</el-text>
            <el-space :size="5" :wrap="false" alignment="center">
                <el-text class="about-link" @click="onOpenSource">{{ $t('dialogue.about.source') }}</el-text>
                <el-divider direction="vertical" />
                <el-text class="about-link" @click="onOpenWebsite">{{ $t('dialogue.about.website') }}</el-text>
            </el-space>
            <div :style="{ color: themeVars.textColor3 }" class="about-copyright">
                Copyright © 2024 Tinycraft.cc All rights reserved
            </div>
        </el-space>
    </el-dialog>
</template>

<style lang="scss" scoped>
.about-app-title {
    font-weight: bold;
    font-size: 18px;
    margin: 5px;
}

.about-link {
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

.about-copyright {
    font-size: 12px;
}
</style>
