<template>
    <van-popup v-model:show="addShow" position="bottom" ref="popup">
        <div class="d-flex-y" :style="{ height: documentHeight + 'px' }">
            <div class="status-bar"></div>
            <div class="tags d-flex f-center">
                <div class="tag" @click="tagSelect('template', $event)">模板</div>
                <div class="tag" @click="tagSelect('pay', $event)" ref="payDom">支出</div>
                <div class="tag" @click="tagSelect('revenues', $event)">收入</div>
                <div class="active—line" ref="activeLine"></div>
                <div class="return" @click="store.commit('needAdd', false)">取消</div>
            </div>
            <div class="flex-1 overflow-scroll">
                <AddTemplate v-if="activeType === 'template'" />
                <AddRecord v-if="activeType === 'pay' || activeType === 'revenues'" :type='activeType' @close="store.commit('needAdd', false)" />
            </div>
        </div>
    </van-popup>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import { useWindowSize } from '@vant/use';
import AddTemplate from '../Add/AddTemplate.vue';
import AddRecord from '../Add/AddRecord.vue';

export default defineComponent({
    name: 'AccountBookAddModal',
    components: { AddTemplate, AddRecord },
    setup (props, { emit }) {
        const { height } = useWindowSize();
        const store = useStore();
        const data = reactive({
            addShow: false,
            documentHeight: height.value,
            activeType: '',
            activeLine: ref<any>(null),
            payDom: ref<any>(null)
        });
        watch(
            () => store.state.addStatus,
            (newVal: boolean) => {
                if (newVal) {
                    data.addShow = true;
                    setTimeout(() => {
                        data.activeLine.style.transform = 'translateX(' + data.payDom.offsetLeft + 'px)';
                    }, 0);
                    data.activeType = 'pay';
                } else {
                    data.addShow = false;
                }
            }
        );

        const tagSelect = (type: string, dom: any) => {
            data.activeType = type;
            data.activeLine.style.transform = 'translateX(' + dom.srcElement.offsetLeft + 'px)';
            data.activeLine.style.transitionDuration = '0.3s';
        };

        const refreshDate = () => {
            emit('refresh');
            data.addShow = false;
        };

        return {
            tagSelect,
            ...toRefs(data),
            refreshDate,
            store
        };
    }
});
</script>
<style lang="scss" scoped>
.tags {
    background: #ffda44;
    height: 40px;
    position: relative;
    .return {
        font-size: 14px;
        font-weight: 400;
        display: flex;
        align-items: center;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        width: 50px;
    }
}
.tag {
    color: #343434;
    padding: 0 15px;
}
.active—line {
    position: absolute;
    width: 60px;
    height: 2px;
    background: #343434;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
}
</style>
