import usePreferencesStore from 'stores/preferences.js'
// import { createDiscreteApi, darkTheme } from 'naive-ui'
// import { darkThemeOverrides, themeOverrides } from '@/utils/theme.js'
import { i18nGlobal } from '@/utils/i18n.js'
import { ElMessage, ElLoading, ElNotification, ElMessageBox } from 'element-plus'
// import { computed } from 'vue'

function setupMessage(message) {
    return {
        error: (content, option = null) => {
            return ElMessage({
                message: content,
                type: 'error',
                duration: option?.duration || 5000,
                showClose: true,
            })
        },
        info: (content, option = null) => {
            return ElMessage({
                message: content,
                type: 'info',
                duration: option?.duration || 5000,
                showClose: true,
            })
        },
        loading: (content, option = {}) => {
            return ElLoading.service({
                lock: true,
                content,
                spinner: option?.spinner,
                background: 'rgba(0, 0, 0, 0.7)',
            })
        },
        success: (content, option = null) => {
            return ElMessage({
                message: content,
                type: 'success',
                duration: option?.duration || 5000,
                showClose: true,
            })
        },
        warning: (content, option = null) => {
            return ElMessage({
                message: content,
                type: 'warning',
                duration: option?.duration || 5000,
                showClose: true,
            })
        },
    }
}

function setupNotification(notification) {
    return {
        /**
         * @param {NotificationOption} option
         * @return {NotificationReactive}
         */
        show(option) {
            return ElNotification({
                title: option.title,
                message: option.action || option.content,
                duration: 0,
                position: 'bottom-right',
            })
        },
        error: (content, option = {}) => {
            option.content = content
            option.title = option.title || i18nGlobal.t('common.error')
            return ElNotification({
                title: option.title,
                message: option.content,
                type: 'error',
                position: 'bottom-right',
            })
        },
        info: (content, option = {}) => {
            option.content = content
            return ElNotification({
                title: option.title,
                message: option.content,
                type: 'info',
                position: 'bottom-right',
            })
        },
        success: (content, option = {}) => {
            option.content = content
            option.title = option.title || i18nGlobal.t('common.success')
            return ElNotification({
                title: option.title,
                message: option.content,
                type: 'success',
                position: 'bottom-right',
            })
        },
        warning: (content, option = {}) => {
            option.content = content
            option.title = option.title || i18nGlobal.t('common.warning')
            return ElNotification({
                title: option.title,
                message: option.content,
                type: 'warning',
                position: 'bottom-right',
            })
        },
    }
}

/**
 *
 * @param {DialogApiInjection} dialog
 * @return {*}
 */
function setupDialog(dialog) {
    return {
        /**
         * @param {DialogOptions} option
         * @return {DialogReactive}
         */
        show(option) {
            option.closable = option.closable === true
            option.autoFocus = option.autoFocus === true
            return ElMessageBox.confirm(
                content,
                i18nGlobal.t('common.warning'),
                {
                    confirmButtonText: i18nGlobal.t('common.confirm'),
                    cancelButtonText: i18nGlobal.t('common.cancel'),
                    type: 'info',
                    autofocus: option.autoFocus,
                    showClose: option.closable,
                }
            )
                .then(() => {
                    onConfirm && onConfirm()
                })
                .catch(() => {})
        },
        warning: (content, onConfirm) => {
            return ElMessageBox.confirm(
                content,
                i18nGlobal.t('common.warning'),
                {
                    confirmButtonText: i18nGlobal.t('common.confirm'),
                    cancelButtonText: i18nGlobal.t('common.cancel'),
                    type: 'warning',
                    autofocus: false,
                    showClose: false,
                }
            )
                .then(() => {
                    onConfirm && onConfirm()
                })
                .catch(() => {})
        },
    }
}

/**
 * setup discrete api and bind global component (like dialog, message, alert) to window
 * @return {Promise<void>}
 */
export async function setupDiscreteApi() {
    const prefStore = usePreferencesStore()
    // const configProviderProps = computed(() => ({
    //     theme: prefStore.isDark ? darkTheme : undefined,
    //     themeOverrides,
    // }))
    // const { message, dialog, notification } = createDiscreteApi(['message', 'notification', 'dialog'], {
    //     configProviderProps,
    //     messageProviderProps: {
    //         placement: 'bottom',
    //         keepAliveOnHover: true,
    //         containerStyle: {
    //             marginBottom: '38px',
    //         },
    //         themeOverrides: prefStore.isDark ? darkThemeOverrides.Message : themeOverrides.Message,
    //     },
    //     notificationProviderProps: {
    //         max: 5,
    //         placement: 'bottom-right',
    //         keepAliveOnHover: true,
    //         containerStyle: {
    //             marginBottom: '38px',
    //         },
    //     },
    // })
    const message = prefStore
    const notification = prefStore
    const dialog = prefStore

    window.$message = setupMessage(message)
    window.$notification = setupNotification(notification)
    window.$dialog = setupDialog(dialog)
}
