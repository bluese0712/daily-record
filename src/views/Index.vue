<template>
    首页 记账 日程 + 杂记(计划，读书，喝水) 运动 我的
    {{ data.edata.a }}
</template>

<script lang="ts">
import { reactive } from 'vue';

export default {
    setup (): any {
        const data = reactive({
            edata: {
                a: '1'
            }
        });

        return {
            data
        };
    }
};
</script>
