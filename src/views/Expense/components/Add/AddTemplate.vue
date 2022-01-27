<template>
    <div class="h-100 box d-flex-y">
        <div class="flex-1 overflow-scroll">
            <div class="template">
                <span class="title">支出模板</span>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <div class="flex-1 pl-15">
                        <span class="name">早餐晚餐1</span>
                        <span class="remark">早餐晚餐1</span>
                    </div>
                    <span class="pay">30</span>
                </div>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <span class="flex-1 pl-15">早餐晚餐1</span>
                    <span class="pay">30</span>
                </div>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <span class="flex-1 pl-15">早餐晚餐1</span>
                    <span class="pay">30</span>
                </div>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <span class="flex-1 pl-15">早餐晚餐1</span>
                    <span class="pay">30</span>
                </div>
            </div>
            <div class="template">
                <span class="title">支出模板</span>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <span class="flex-1 pl-15">早餐晚餐1</span>
                    <span class="pay">30</span>
                </div>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <span class="flex-1 pl-15">早餐晚餐1</span>
                    <span class="pay">30</span>
                </div>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <span class="flex-1 pl-15">早餐晚餐1</span>
                    <span class="pay">30</span>
                </div>
                <div class="d-flex px-10 f-y-center font-14 detail">
                    <div class="icon"><svg-icon size="16px" icon-class="naicha" /></div>
                    <span class="flex-1 pl-15">早餐晚餐1</span>
                    <span class="pay">30</span>
                </div>
            </div>
        </div>
        <div class="operation">
            <div class="btn d-flex f-center">
                <svg-icon size="16px" icon-class="beizhu" class="pr-5" />
                编辑
            </div>
            <div class="btn d-flex f-center">
                <svg-icon size="16px" icon-class="plus" class="pr-5" />
                添加
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import { useWindowSize } from '@vant/use';

export default defineComponent({
    name: 'AccountBook',
    setup () {
        const { height } = useWindowSize();
        const store = useStore();
        const data = reactive({
            addShow: false,
            documentHeight: height.value,
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
                } else {
                    data.addShow = false;
                }
            }
        );

        const tagSelect = (type: string, dom: any) => {
            data.activeLine.style.transform = 'translateX(' + dom.srcElement.offsetLeft + 'px)';
            data.activeLine.style.transitionDuration = '0.3s';
        };

        return {
            tagSelect,
            ...toRefs(data)
        };
    }
});
</script>
<style lang="scss" scoped>
.box {
    background: #f5f5f7;
    .template {
        background: #fff;
        margin-top: 5px;
        .title {
            display: block;
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
        }
        .detail {
            height: 60px;
            border-bottom: 1px solid #f5f5f5;
            .icon {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
                border-radius: 15px;
            }
            .name,.remark {
                display: block;

            }
            .remark {
                color: #aaaaaa;
                font-size: 10px;
            }
        }
        .detail:last-child {
            border-bottom: none;
        }
    }
    .template:first-child {
        margin: 0;
    }

    .operation {
        height: 40px;
        background: #fff;
        .btn {
            width: 50%;
            line-height: 40px;
            float: left;
            position: relative;
        }
        .btn:first-child::after {
            content: '';
            height: 20px;
            border-left: 1px solid #eaeaea;
            position: absolute;
            right: 0px;
        }
    }
}

.revenues {
    color: #ee543c;
    font-weight: 600;
}
.pay {
    color: #17b98a;
    font-weight: 600;
}
</style>
