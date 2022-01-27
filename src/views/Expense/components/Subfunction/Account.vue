<template>
    <van-popup v-model:show="addShow" position="bottom" ref="popup">
        <div class="d-flex-y bg" :style="{ height: documentHeight + 'px' }">
            <div class="status-bar"></div>
            <span class="modal-title">资产</span>
            <div class="total-assets">
                <span class="title">净资产</span>
                <div class="amount">12<span class="decimal">.00</span></div>
            </div>
            <div class="classify">
                <div class="item">
                    <span class="title">资产</span>
                    <div class="amount">12<span class="decimal">.00</span></div>
                </div>
                <div class="item">
                    <span class="title">负债</span>
                    <div class="amount">12<span class="decimal">.00</span></div>
                </div>
            </div>
            <div class="main-container">
                <div class="add">
                    <van-button icon="plus" color="#ffda44" style="color:#000" block>添加资产</van-button>
                </div>
            </div>
            <div class="category">
                <div class="item">资产</div>
                <div class="item">图表</div>
            </div>
        </div>
    </van-popup>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import { useWindowSize } from '@vant/use';

export default defineComponent({
    name: 'AccountBookAddModal',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
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
            () => props.show,
            (newVal: boolean) => {
                console.log(newVal);
                data.addShow = newVal;
                // if (newVal) {
                //     data.addShow = true;
                //     setTimeout(() => {
                //         data.activeLine.style.transform = 'translateX(' + data.payDom.offsetLeft + 'px)';
                //     }, 0);
                //     data.activeType = 'pay';
                // } else {
                //     data.addShow = false;
                // }
            }
        );
        onMounted(() => {
            emit('update:show', false);
        });

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
.bg {
    // background: url('../../../../assets/img/123.jpg');
    background-size: 100%;
}
.modal-title {
    font-size: 18px;
    font-weight: 600;
    height: 45px;
    line-height: 45px;

}
.total-assets {
    .title {
        font-size: 14px;
        color: #89752c;
        padding-bottom: 10px;
        display: block;
    }
    .amount {
        font-size: 36px;
        .decimal {
            font-size: 26px;
        }
    }
}
.classify {
    display: flex;
    padding: 10px 0;
    .item {
        width: 50%;
        position: relative;
        .title {
            color: #877535;
        }
        .amount {
            padding: 5px;
            font-size: 20px;
            .decimal {
                font-size: 16px;
            }
        }
    }
    .item:first-child:after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 10px;
        width: 1px;
        height: 50%;
        background: #caa82d;
    }
}
.modal-title, .total-assets, .classify {
    background: #ffda44;
}
.category {
    display: flex;
    .item {
        width: 50%;
        height: 30px;
    }
}
</style>
<style lang="scss" scoped>
.main-container {
    flex: 1;
    background: #f6f6f6;
    .add {
        padding: 20px 30px;
        .van-button {
            border-radius: 10px;
        }
    }
}
</style>
