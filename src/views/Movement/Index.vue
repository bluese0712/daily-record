<template>
    <div class="d-flex-y">
        <div class="header">
            <div class="cell-top d-flex f-y-center">
                <div class="month">
                    <label class="title">2021年</label>
                    <div class="detail">
                        <span>04</span>
                        <span class="d-month">月</span>
                        <van-icon class-prefix="my-icon" size="14px" name="lowerTriangle" color="#000" />
                    </div>
                </div>
                <div class="flex-1">
                    <label class="title">收入</label>
                    <div class="detail">
                        <span class="integer">11228</span>
                        <span class="decimal">.75</span>
                    </div>
                </div>
                <div class="flex-1">
                    <label class="title">支出</label>
                    <div class="detail">
                        <span class="integer">11228</span>
                        <span class="decimal">.75</span>
                    </div>
                </div>
            </div>
            <div class="cell-bottom">
                <div class="function d-flex f-y-center">
                    <div class="flex-1 text-center">
                        <van-icon class-prefix="my-icon" size="22px" name="bill" />
                        <div class="font-10 info mt-5">账单</div>
                    </div>
                    <div class="flex-1 text-center">
                        <van-icon class-prefix="my-icon" size="22px" name="budget" />
                        <div class="font-10 info mt-5">预算</div>
                    </div>
                    <div class="flex-1 text-center">
                        <van-icon class-prefix="my-icon" size="22px" name="chart" />
                        <div class="font-10 info mt-5">图表</div>
                    </div>
                    <div class="flex-1 text-center">
                        <van-icon class-prefix="my-icon" size="22px" name="account" />
                        <div class="font-10 info mt-5">账户</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1 overflow-hidden">123</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
// import Detail from './Detail.vue';
export default defineComponent({
    name: 'AccountBook',
    // components: { Detail },
    setup () {
        const store = useStore();
        const data = reactive({
            edata: {
                a: '1'
            }
        });

        watch(
            () => store.state.addStatus,
            () => {
                console.log('change1');
            }
        );

        const ces = () => {
            console.log('ces');
        };

        onMounted(() => {
            console.log(123);
        });

        return {
            ces,
            ...toRefs(data)
        };
    }
});
</script>
<style lang="scss" scoped>
.header {
    background: #ffda44;
    width: 100%;
    height: 140px;
}
.cell-top,
.cell-bottom {
    height: 70px;
}
.cell-top {
    padding: 0 15px;
    .month {
        width: 70px;
    }
    .title {
        color: #8e7c34;
        font-size: 10px;
    }
    .detail {
        padding-top: 3px;
        color: #000;
        font-size: 24px;
        .d-month {
            font-size: 14px;
        }
        .integer {
            font-size: 14px;
        }
        .decimal {
            font-size: 10px;
        }
    }
    .flex-1:first {
        padding-left: 20px;
    }
    // background: #000;
}
.cell-bottom {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 90%);
}
.function {
    background: #fff;
    height: 70px;
    margin: 0 10px;
    border-radius: 8px;
    border: 1px solid rgb(245, 245, 245);
    box-shadow: 0px 3px 10px #f1f1f1;
}
.info {
    color: #757575;
}
</style>
