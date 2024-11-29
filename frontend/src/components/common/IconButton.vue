<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
    tooltip: String,
    tTooltip: String,
    tooltipDelay: {
        type: Number,
        default: 800,
    },
    type: String,
    icon: [String, Object],
    size: {
        type: [Number, String],
        default: 20,
    },
    color: {
        type: String,
        default: '',
    },
    strokeWidth: {
        type: [Number, String],
        default: 3,
    },
    loading: Boolean,
    border: Boolean,
    disabled: Boolean,
    buttonStyle: [String, Object],
    buttonClass: [String, Object],
    small: Boolean,
    secondary: Boolean,
    tertiary: Boolean,
})

const emit = defineEmits(['click'])

const slots = useSlots()

const hasTooltip = computed(() => {
    return props.tooltip || props.tTooltip || slots.tooltip
})
</script>

<template>
    <el-tooltip v-if="hasTooltip" :show-after="tooltipDelay" :keep-alive-on-hover="false" :show-arrow="false">
        <el-button
            :class="props.buttonClass"
            :color="props.color"
            :disabled="props.disabled"
            :focusable="false"
            :loading="loading"
            :secondary="props.secondary"
            :size="props.small ? 'small' : ''"
            :style="props.buttonStyle"
            :tertiary="props.tertiary"
            :text="!props.border"
            :type="props.type"
            @click.prevent="emit('click')">
            <template #icon>
                <slot>
                    <el-icon :color="props.color || 'currentColor'" :size="props.size">
                        <component :is="props.icon" :stroke-width="props.strokeWidth" />
                    </el-icon>
                </slot>
            </template>
        </el-button>
        <template #content>
            <slot name="tooltip">
                {{ props.tTooltip ? $t(props.tTooltip) : props.tooltip }}
            </slot>
        </template>
    </el-tooltip>
    <el-button
        v-else
        :class="props.buttonClass"
        :color="props.color"
        :disabled="props.disabled"
        :focusable="false"
        :loading="loading"
        :secondary="props.secondary"
        :size="props.small ? 'small' : ''"
        :style="props.buttonStyle"
        :text="!props.border"
        :type="props.type"
        @click.prevent="emit('click')">
        <template #icon>
            <slot>
                <el-icon :color="props.color || 'currentColor'" :size="props.size">
                    <component :is="props.icon" :stroke-width="props.strokeWidth" />
                </el-icon>
            </slot>
        </template>
    </el-button>
</template>

<style lang="scss"></style>
