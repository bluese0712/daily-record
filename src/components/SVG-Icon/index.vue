<template>
    <svg :class="svgClass" aria-hidden="true" :style="svgStyle">
        <use :xlink:href='iconName' />
    </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        },
        size: {
            type: String || Number,
            default: ''
        }
    },
    setup (props) {
        const iconName = computed(() => {
            return `#my-icon-${props.iconClass}`;
        });

        const svgClass = computed(() => {
            if (props.className) {
                return 'svg-icon ' + props.className;
            } else {
                return 'svg-icon';
            }
        });

        const svgStyle = computed(() => {
            if (props.size) {
                if (props.size.toString().indexOf('px') !== -1) {
                    return { width: props.size, height: props.size };
                }
                if (!parseInt(props.size)) {
                    return { width: parseInt(props.size) + 'px', height: parseInt(props.size) + 'px' };
                }
            }
            return { width: '22px', height: '22px' };
        });

        return {
            iconName,
            svgClass,
            svgStyle
        };
    }
});
</script>
<style lang="scss" scoped>
.svg-icon {
    width: 22px;
    height: 22px;
    vertical-align: -0.15em;
    fill:currentColor;
    overflow: hidden;
}
</style>
