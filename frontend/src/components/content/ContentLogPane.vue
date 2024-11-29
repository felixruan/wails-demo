<script setup>
import { computed, h, nextTick, reactive, ref } from 'vue'
import IconButton from '@/components/common/IconButton.vue'
import Refresh from '@/components/icons/Refresh.vue'
import { map, size, split, uniqBy } from 'lodash'
import { useI18n } from 'vue-i18n'
import Delete from '@/components/icons/Delete.vue'
import dayjs from 'dayjs'
// import { useThemeVars } from 'naive-ui'
import { useThemeVars } from '@/utils/theme_vars.js'
import usePreferencesStore from 'stores/preferences.js'
// import useBrowserStore from 'stores/browser.js'

// const themeVars = useThemeVars()
const prefStore = usePreferencesStore()
const themeVars = computed(() => {
    return useThemeVars(prefStore.isDark)
})

// const browserStore = useBrowserStore()
const i18n = useI18n()
const data = reactive({
    loading: false,
    server: '',
    keyword: '',
    history: [],
})
const filterServerOption = computed(() => {
    const serverSet = uniqBy(data.history, 'server')
    const options = map(serverSet, ({ server }) => ({
        label: server,
        value: server,
    }))
    options.splice(0, 0, {
        label: 'common.all',
        value: '',
    })
    return options
})

const tableRef = ref(null)

const columns = computed(() => [
    {
        title: () => i18n.t('log.exec_time'),
        key: 'timestamp',
        defaultSortOrder: 'ascend',
        sorter: 'default',
        width: 180,
        align: 'center',
        titleAlign: 'center',
        render: ({ timestamp }, index) => {
            return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
        },
    },
    {
        title: () => i18n.t('log.server'),
        key: 'server',
        filterOptionValue: data.server,
        filter: (value, row) => {
            return value === '' || row.server === value.toString()
        },
        width: 150,
        align: 'center',
        titleAlign: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: () => i18n.t('log.cmd'),
        key: 'cmd',
        titleAlign: 'center',
        filterOptionValue: data.keyword,
        resizable: true,
        filter: (value, row) => {
            return value === '' || !!~row.cmd.indexOf(value.toString())
        },
        render: ({ cmd }, index) => {
            const cmdList = split(cmd, '\n')
            if (size(cmdList) > 1) {
                return h(
                    'div',
                    null,
                    map(cmdList, (c) => h('div', { class: 'cmd-line' }, c)),
                )
            }
            return h('div', { class: 'cmd-line' }, cmd)
        },
    },
    {
        title: () => i18n.t('log.cost_time'),
        key: 'cost',
        width: 100,
        align: 'center',
        titleAlign: 'center',
        render: ({ cost }, index) => {
            const ms = dayjs.duration(cost).asMilliseconds()
            if (ms < 1000) {
                return `${ms} ms`
            } else {
                return `${Math.floor(ms / 1000)} s`
            }
        },
    },
])

const loadHistory = async () => {
    try {
        await nextTick()
        data.loading = true
        const list = undefined // await browserStore.getCmdHistory()
        data.history = list || []
    } finally {
        data.loading = false
        await nextTick()
        tableRef.value?.scrollTo({ position: 'bottom' })
    }
}

const cleanHistory = async () => {
    $dialog.warning(i18n.t('log.confirm_clean_log'), async () => {
        try {
            data.loading = true
            const success = undefined // await browserStore.cleanCmdHistory()
            if (success) {
                data.history = []
                await nextTick()
                tableRef.value?.scrollTo({ position: 'top' })
                $message.success(i18n.t('dialogue.handle_succ'))
            }
        } finally {
            data.loading = false
        }
    })
}

defineExpose({
    refresh: loadHistory,
})
</script>

<template>
    <div class="content-log content-container content-value fill-height flex-box-v">
        <h3>{{ $t('log.title') }}</h3>
        <el-form :disabled="data.loading" class="flex-item" label-position="top" inline>
            <el-form-item :label="$t('log.filter_server')">
                <el-select
                    v-model="data.server"
                    :consistent-menu-width="false"
                    style="min-width: 100px"
                >
                    <el-option
                        v-for="(item, index) in filterServerOption"
                        :key="index"
                        :label="item.value === '' ? $t(item.label) : item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('log.filter_keyword')">
                <el-input v-model="data.keyword" clearable placeholder="" />
            </el-form-item>
            <el-form-item label="&nbsp;">
                <icon-button :icon="Refresh" border t-tooltip="log.refresh" @click="loadHistory" />
            </el-form-item>
            <el-form-item label="&nbsp;">
                <icon-button :icon="Delete" border t-tooltip="log.clean_log" @click="cleanHistory" />
            </el-form-item>
        </el-form>
        <el-table
            ref="tableRef"
            :columns="columns"
            :data="data.history"
            :loading="data.loading"
            class="flex-item-expand"
            flex-height
            virtual-scroll
        >
            <template #empty>
                <el-empty />
            </template>
        </el-table>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/content';
</style>
