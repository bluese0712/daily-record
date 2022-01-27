<template>
    <div class="d-flex-y h-100">
        <div class="header">
            <!-- 月度统计 -->
            <div class="cell-top d-flex f-y-center">
                <!-- 月份 -->
                <div class="month" @click="yearMonthSelectShow = true">
                    <label class="title">{{ date.year }}年</label>
                    <div class="detail">
                        <span>{{ date.month }}</span>
                        <span class="d-month">月</span>
                        <van-icon class="pl-5" class-prefix="my-icon" size="14px" name="lowerTriangle" />
                    </div>
                    <van-popup v-model:show="yearMonthSelectShow" position="bottom" @closed="currentDate = date.time" teleport="body">
                        <van-datetime-picker v-model="currentDate" type="year-month" title="选择月份" :formatter="formatter" @confirm="monthSelect" @cancel="yearMonthSelectShow = false" />
                    </van-popup>
                </div>
                <!-- 收入 支出 余额 -->
                <div class="flex-1 interval" v-for="item of statistical" :key="item.title">
                    <label class="title" v-html="item.title"></label>
                    <div class="detail">
                        <span class="integer">{{ item.integer }}</span
                        ><span class="decimal">.{{ item.decimal }}</span>
                    </div>
                </div>
                <!-- 账本选择 -->
                <div>
                    <svg-icon icon-class="zhangben"></svg-icon>
                </div>
            </div>
            <div class="cell-bottom">
                <div class="function d-flex f-y-center">
                    <div class="flex-1 text-center">
                        <svg-icon icon-class="bill"></svg-icon>
                        <div class="font-10 info mt-5">账单</div>
                    </div>
                    <div class="flex-1 text-center">
                        <svg-icon icon-class="budget"></svg-icon>
                        <div class="font-10 info mt-5">预算</div>
                    </div>
                    <div class="flex-1 text-center">
                        <svg-icon icon-class="chart"></svg-icon>
                        <div class="font-10 info mt-5">图表</div>
                    </div>
                    <div class="flex-1 text-center" @click="showAccount = true">
                        <svg-icon icon-class="account"></svg-icon>
                        <div class="font-10 info mt-5">资产</div>
                        <Account v-model:show="showAccount"></Account>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1 overflow-hidden">
            <Detail ref="detailModal"></Detail>
        </div>
        <AccountRecordAdd @refresh="detailModal.getRecordList()"></AccountRecordAdd>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, defineAsyncComponent } from 'vue';
import Detail from './components/Detail.vue';
import api from '@/api';
import utils from '@/utils';
import { Decimal } from 'decimal.js';
import { useStore } from 'vuex';
export default defineComponent({
    name: 'AccountBook',
    components: {
        Detail,
        AccountRecordAdd: defineAsyncComponent(() => import('./components/Add/AddModal.vue')),
        Account: defineAsyncComponent(() => import('./components/Subfunction/Account.vue'))
    },
    setup () {
        const store = useStore();
        const data = reactive({
            date: {
                time: new Date(),
                year: new Date().getFullYear(),
                month: new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString()
            },
            currentDate: new Date(),
            yearMonthSelectShow: false,
            statistical: [{ title: '收入', integer: '0', decimal: '00' }, { title: '支出', integer: '0', decimal: '00' }, { title: '余额', integer: '0', decimal: '00' }] as any,
            detailModal: ref<any>(null),
            showAccount: false,
            complete: false
        });

        onMounted(() => {
            recordMonthStatistics();
            monthSelect(new Date());
            // 获取所有icon
            store.dispatch('getIconList');
            // 获取所有类别
            store.dispatch('getAllCategory');
        });

        // 月份选择选项显示处理
        const formatter = (type: string, val: string) => {
            if (type === 'year') { return `${val}年`; }
            if (type === 'month') { return `${val}月`; }
            return val;
        };

        // 月度统计
        const recordMonthStatistics = async () => {
            const res = await api.expense.record.recordMonthStatistics(data.date.year, parseInt(data.date.month));
            if (res.code !== 200) {
                utils.message({ message: res.msg, position: 'top' });
                return;
            }
            const pay = new Decimal(res.data.pay);
            const payDecimal = pay.minus(Decimal.trunc(pay)).mul(new Decimal(100)).abs().toString();
            const revenues = new Decimal(res.data.revenues);
            const revenuesDecimal = revenues.minus(Decimal.trunc(revenues)).mul(new Decimal(100)).abs().toString();
            const balance = revenues.sub(pay);
            const balanceDecimal = balance.minus(Decimal.trunc(balance)).mul(new Decimal(100)).abs().toString();
            data.statistical = [
                { title: '收入', integer: Decimal.trunc(revenues).toString(), decimal: revenuesDecimal.length < 2 ? (revenuesDecimal + '0') : revenuesDecimal },
                { title: '支出', integer: Decimal.trunc(pay).toString(), decimal: payDecimal.length < 2 ? (payDecimal + '0') : payDecimal },
                { title: '余额', integer: Decimal.trunc(balance).toString(), decimal: balanceDecimal.length < 2 ? (balanceDecimal + '0') : balanceDecimal }
            ];
        };

        // 月份选择触发
        const monthSelect = (value: Date) => {
            data.yearMonthSelectShow = false;
            data.date = {
                time: new Date(value),
                year: new Date(value).getFullYear(),
                month: new Date(value).getMonth() < 9 ? '0' + (new Date(value).getMonth() + 1) : (new Date(value).getMonth() + 1).toString()
            };
            data.detailModal.changeDate(data.date.time);
            recordMonthStatistics();
        };

        return {
            formatter,
            monthSelect,
            ...toRefs(data)
        };
    }
});
</script>
<style lang="scss" scoped>
.header {
    background: #ffda44;
    width: 100%;
}
.cell-top,
.cell-bottom {
    height: 70px;
}
.cell-top {
    padding: 0 15px;
    .month {
        width: 70px;
        .detail::after {
            content: '';
            display: block;
            position: absolute;
            width: 1px;
            background: #1c1d21;
            height: 80%;
            right: 0;
            bottom: 0;
        }
    }
    .title {
        color: #8e7c34;
        font-size: 10px;
    }
    .detail {
        padding-top: 3px;
        color: #1c1d21;
        font-size: 24px;
        position: relative;
        .d-month,
        .integer {
            font-size: 14px;
        }
        .decimal {
            font-size: 10px;
        }
    }
    .interval {
        padding-left: 20px;
    }
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
