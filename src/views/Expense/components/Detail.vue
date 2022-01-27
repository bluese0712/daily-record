<template>
    <div class="h-100 d-flex-y">
        <div class="d-flex f-y-center text-center">
            <div class="flex-1 d-flex f-x-center py-10">
                <van-circle v-model:current-rate="quota.circle.circleRate" :rate="quota.circle.rate" layer-color="#ebedf0" :text="quota.circle.rate + '%'" size="80px" color="#00bd00" />
            </div>
            <div class="flex-1">
                <div class="font-bold">{{ quota.total }}</div>
                <div class="font-10">总额度</div>
            </div>
            <div class="flex-1">
                <div class="font-bold">{{ quota.surplus }}</div>
                <div class="font-10">剩余额度</div>
            </div>
        </div>
        <div class="interval flex-1 h-0 overflow-scroll">
            <div v-for="(dailyRecord, index) of recordList" :key="index">
                <div class="d-flex font-12 px-10 total">
                    <div class="flex-1">{{queryDate.month}}月{{dailyRecord.day}}日 {{dailyRecord.week}}</div>
                    <div class="text-right" style="min-width: 100px">收入：{{dailyRecord.revenues}}</div>
                    <div class="text-right" style="min-width: 100px">支出：{{dailyRecord.pay}}</div>
                </div>
                <div class="d-flex px-10 f-y-center font-14 detail" v-for="record of dailyRecord.array" :key="record.recordID">
                    <div class="icon"><svg-icon size="14px" :icon-class="record.category.icon" /></div>
                    <div class="flex-1 pl-15">
                        <span>{{ record.category.categoryName }}</span>
                        <span>{{ record.remark }}</span>
                    </div>
                    <span :class="record.flag">{{ (record.flag === 'pay' ? '-' : '') + record.amount }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import api from '@/api';
import utils from '@/utils';
import { defineComponent, reactive, toRefs } from 'vue';
import dayjs from 'dayjs';
import { Decimal } from 'decimal.js';

export default defineComponent({
    setup () {
        const data = reactive({
            quota: { total: '97.25', surplus: '59.20', circle: { circleRate: 0, rate: 0 } },
            queryDate: { time: new Date(), year: '', month: '' },
            recordList: [] as any
        });
        // 获取月份的记录
        const getRecordList = async () => {
            const res = await api.expense.record.getRecordList(data.queryDate.year, data.queryDate.month);
            if (res.code !== 200) {
                utils.message({ message: res.msg, position: 'top' });
                return;
            }
            groupByDate(res.data);
        };
        // 根据日期分组
        const groupByDate = (array: any) => {
            data.recordList = [];
            const recordMap = new Map();
            for (const record of array) {
                const key = record.day > 9 ? record.day.toString() : '0' + record.day;
                const array = recordMap.has(key) ? recordMap.get(key) : [];
                array.push(record);
                recordMap.set(key, array);
            }
            recordMap.forEach((v, key) => {
                const time = dayjs().year(parseInt(data.queryDate.year)).month(parseInt(data.queryDate.month)).day(key);
                let pay = new Decimal(0);
                let revenues = new Decimal(0);
                for (const record of v) {
                    if (record.flag === 'pay') {
                        pay = pay.add(new Decimal(record.amount));
                        continue;
                    }
                    revenues = revenues.add(new Decimal(record.amount));
                }
                data.recordList.push({
                    day: key,
                    week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][time.day()],
                    pay: pay.toFixed(2).toString(),
                    revenues: revenues.toFixed(2).toString(),
                    array: v
                });
            });
        };

        // 改变日期
        const changeDate = (date: Date) => {
            data.queryDate = {
                time: date, year: dayjs(date).format('YYYY'), month: dayjs(date).format('MM')
            };
            getRecordList();
        };

        return {
            ...toRefs(data),
            getRecordList,
            changeDate
        };
    }
});
</script>
<style lang="scss" scoped>
.interval {
    border-top: 5px solid #f8f8f8;
}
.total {
    color: #969696;
    border-bottom: 1px solid #e1e1e1;
    height: 25px;
    line-height: 25px;
}
.detail {
    height: 50px;
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
