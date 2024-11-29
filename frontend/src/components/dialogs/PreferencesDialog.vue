<script setup>
import { computed, h, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import useDialog from 'stores/dialog'
import usePreferencesStore from 'stores/preferences.js'
import { find, map, sortBy } from 'lodash'
import { typesIconStyle } from '@/consts/support_redis_type.js'
import Help from '@/components/icons/Help.vue'
import Delete from '@/components/icons/Delete.vue'
import IconButton from '@/components/common/IconButton.vue'
// import { NButton, NEllipsis, NIcon, NSpace, NTooltip } from 'naive-ui'
import { ElButton as NButton, ElText as NEllipsis } from 'element-plus/es'
import { ElIcon as NIcon, ElSpace as NSpace, ElTooltip as NTooltip } from 'element-plus/es'
import Edit from '@/components/icons/Edit.vue'
import { joinCommand } from '@/utils/decoder_cmd.js'
import AddLink from '@/components/icons/AddLink.vue'
import Checked from '@/components/icons/Checked.vue'
import { BrowserOpenURL } from 'wailsjs/runtime/runtime.js'

const prefStore = usePreferencesStore()

const prevPreferences = ref({})
const tab = ref('general')
const dialogStore = useDialog()
const i18n = useI18n()
const loading = ref(false)

const initPreferences = async () => {
    try {
        loading.value = true
        tab.value = dialogStore.preferencesTag || 'general'
        await prefStore.loadPreferences()
        prevPreferences.value = {
            general: prefStore.general,
            editor: prefStore.editor,
            cli: prefStore.cli,
            decoder: prefStore.decoder,
        }
    } finally {
        loading.value = false
    }
}

watchEffect(() => {
    if (dialogStore.preferencesDialogVisible) {
        initPreferences()
    }
})

const keyOptions = computed(() => {
    const opts = map(typesIconStyle, (v) => ({
        value: v,
        label: 'preferences.general.key_icon_style' + v,
    }))
    return sortBy(opts, (o) => o.value)
})

const onOpenPrivacy = () => {
    let helpUrl = ''
    switch (prefStore.currentLanguage) {
        case 'zh':
            helpUrl = 'https://redis.tinycraft.cc/zh/guide/privacy.html'
            break
        default:
            helpUrl = 'https://redis.tinycraft.cc/guide/privacy.html'
            break
    }
    BrowserOpenURL(helpUrl)
}

const openDecodeHelp = () => {
    let helpUrl = ''
    switch (prefStore.currentLanguage) {
        case 'zh':
            helpUrl = 'https://redis.tinycraft.cc/zh/guide/custom-decoder.html'
            break
        default:
            helpUrl = 'https://redis.tinycraft.cc/guide/custom-decoder.html'
            break
    }
    BrowserOpenURL(helpUrl)
}

const onSavePreferences = async () => {
    const success = await prefStore.savePreferences()
    if (success) {
        // $message.success(i18n.t('dialogue.handle_succ'))
        dialogStore.closePreferencesDialog()
    }
}

const onClose = () => {
    // restore to old preferences
    prefStore.resetToLastPreferences()
    dialogStore.closePreferencesDialog()
}
</script>

<template>
    <el-dialog
        v-model="dialogStore.preferencesDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :title="$t('preferences.name')"
        close-on-press-escape
        style="width: 640px"
        align-center
        @close="onClose"
    >
        <el-tabs v-model="tab" tab-position="left" tab-style="font-weight: 420" style="height: 100%">
            <!-- general pane -->
            <el-tab-pane :label="$t('preferences.general.name')" name="general" style="min-height: 300px">
                <el-form :disabled="loading" :model="prefStore.general" hide-required-asterisk label-position="top" inline>
                    <template #default>
                        <el-form-item :label="$t('preferences.general.theme')" style="width: 100%" required>
                            <el-radio-group v-model="prefStore.general.theme" name="theme" size="default">
                                <el-radio-button
                                    v-for="opt in prefStore.themeOption"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ $t(opt.label) }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('preferences.general.language')" style="width: 100%" required>
                            <el-select v-model="prefStore.general.language" filterable>
                                <el-option
                                    v-for="(item, index) in prefStore.langOption"
                                    :key="index"
                                    :label="item.value === 'auto' ? $t(item.label) : item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item style="width: 100%" required>
                            <template #label>
                                {{ $t('preferences.general.font') }}
                                <el-tooltip trigger="hover">
                                    <el-icon><component :is="Help" /></el-icon>
                                    <template #content>
                                        <div class="text-block">
                                            {{ $t('preferences.font_tip') }}
                                        </div>
                                    </template>
                                </el-tooltip>
                            </template>
                            <el-select
                                v-model="prefStore.general.fontFamily"
                                :placeholder="$t('preferences.general.font_tip')"
                                filterable
                                multiple
                            >
                                <el-option
                                    v-for="(item, index) in prefStore.fontOption"
                                    :key="index"
                                    :label="item.value === '' ? $t(item.label) : item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('preferences.general.font_size')" style="width: 100%">
                            <el-input-number v-model="prefStore.general.fontSize" :max="65535" :min="1" />
                        </el-form-item>
                        <el-form-item style="width: 40%">
                            <template #label>
                                {{ $t('preferences.general.scan_size') }}
                                <el-tooltip trigger="hover">
                                    <el-icon><component :is="Help" /></el-icon>
                                    <template #content>
                                        <div class="text-block">
                                            {{ $t('preferences.general.scan_size_tip') }}
                                        </div>
                                    </template>
                                </el-tooltip>
                            </template>
                            <el-input-number
                                v-model="prefStore.general.scanSize"
                                :min="1"
                                :show-button="false"
                                style="width: 100%" />
                        </el-form-item>
                        <el-form-item :label="$t('preferences.general.key_icon_style')" style="width: 40%">
                            <el-select v-model="prefStore.general.keyIconStyle">
                                <el-option
                                    v-for="(item, index) in keyOptions"
                                    :key="index"
                                    :label="$t(item.label)"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('preferences.general.update')" style="width: 100%">
                            <el-checkbox v-model:checked="prefStore.general.checkUpdate">
                                {{ $t('preferences.general.auto_check_update') }}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item :label="$t('preferences.general.privacy')" style="width: 100%">
                            <el-checkbox v-model:checked="prefStore.general.allowTrack">
                                {{ $t('preferences.general.allow_track') }}
                                <el-button style="text-decoration: underline" text type="primary" @click="onOpenPrivacy">
                                    {{ $t('preferences.general.privacy') }}
                                </el-button>
                            </el-checkbox>
                        </el-form-item>
                    </template>
                </el-form>
            </el-tab-pane>

            <!-- editor pane -->
            <el-tab-pane :label="$t('preferences.editor.name')" name="editor">
                <el-form :disabled="loading" :model="prefStore.editor" hide-required-asterisk label-position="top" inline>
                    <template #default>
                        <el-form-item style="width: 100%" required>
                            <template #label>
                                {{ $t('preferences.general.font') }}
                                <el-tooltip trigger="hover">
                                    <el-icon><component :is="Help" /></el-icon>
                                    <template #content>
                                        <div class="text-block">
                                            {{ $t('preferences.font_tip') }}
                                        </div>
                                    </template>
                                </el-tooltip>
                            </template>
                            <el-select
                                v-model="prefStore.editor.fontFamily"
                                :placeholder="$t('preferences.general.font_tip')"
                                filterable
                                multiple
                            >
                                <el-option
                                    v-for="(item, index) in prefStore.fontOption"
                                    :key="index"
                                    :label="item.value || $t(item.label)"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('preferences.general.font_size')" style="width: 100%">
                            <el-input-number v-model="prefStore.editor.fontSize" :max="65535" :min="1" />
                        </el-form-item>
                        <el-form-item :show-feedback="false" :show-label="false" style="width: 100%">
                            <el-checkbox v-model:checked="prefStore.editor.showLineNum">
                                {{ $t('preferences.editor.show_linenum') }}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item :show-feedback="false" :show-label="false" style="width: 100%">
                            <el-checkbox v-model:checked="prefStore.editor.showFolding">
                                {{ $t('preferences.editor.show_folding') }}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item :show-feedback="false" :show-label="false" style="width: 100%">
                            <el-checkbox v-model:checked="prefStore.editor.dropText">
                                {{ $t('preferences.editor.drop_text') }}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item :show-feedback="false" :show-label="false" style="width: 100%">
                            <el-checkbox v-model:checked="prefStore.editor.links">
                                {{ $t('preferences.editor.links') }}
                            </el-checkbox>
                        </el-form-item>
                    </template>
                </el-form>
            </el-tab-pane>

            <!-- cli pane -->
            <el-tab-pane :label="$t('preferences.cli.name')" name="cli">
                <el-form :disabled="loading" :model="prefStore.cli" hide-required-asterisk label-position="top" inline>
                    <template #default>
                        <el-form-item style="width: 100%" required>
                            <template #label>
                                {{ $t('preferences.general.font') }}
                                <el-tooltip trigger="hover">
                                    <el-icon><component :is="Help" /></el-icon>
                                    <template #content>
                                        <div class="text-block">
                                            {{ $t('preferences.font_tip') }}
                                        </div>
                                    </template>
                                </el-tooltip>
                            </template>
                            <el-select
                                v-model="prefStore.cli.fontFamily"
                                :placeholder="$t('preferences.general.font_tip')"
                                filterable
                                multiple
                            >
                                <el-option
                                    v-for="(item, index) in prefStore.fontOption"
                                    :key="index"
                                    :label="item.value || $t(item.label)"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('preferences.general.font_size')" style="width: 100%">
                            <el-input-number v-model="prefStore.cli.fontSize" :max="65535" :min="1" />
                        </el-form-item>
                        <el-form-item :label="$t('preferences.cli.cursor_style')" style="width: 100%">
                            <el-radio-group v-model="prefStore.cli.cursorStyle" name="theme" size="default">
                                <el-radio-button
                                    v-for="opt in prefStore.cliCursorStyleOption"
                                    :key="opt.value"
                                    :value="opt.value">
                                    {{ $t(opt.label) }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <template #footer>
            <div class="flex-box">
                <div class="flex-box flex-item-expand">
                    <el-button :disabled="loading" @click="prefStore.restorePreferences">
                        {{ $t('preferences.restore_defaults') }}
                    </el-button>
                </div>
                <div class="flex-item n-dialog__action">
                    <el-button :disabled="loading" @click="onClose">{{ $t('common.cancel') }}</el-button>
                    <el-button :disabled="loading" type="primary" @click="onSavePreferences">
                        {{ $t('common.save') }}
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.el-form-item {
    margin-bottom: 10px;
}
:deep(.el-form-item__label) {
    margin-bottom: 5px !important;
}
</style>
