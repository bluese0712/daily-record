<template>
    <div class="number-key-board">
        <div class="details">
            <span class="remark">
                <van-icon class-prefix="my-icon" size="20px" name="beizhu" class="icon" />
                <span class="text">备注：</span>
                <input class="input" type="text" placeholder="点击写备注..." @focus="show = false" @blur="show = true" v-model="remark" />
            </span>
            <span class="amount" v-html="amount"></span>
        </div>
        <div class="standard" v-if="show">
            <span class="cell" @click="numberClick(7)">7</span>
            <span class="cell" @click="numberClick(8)">8</span>
            <span class="cell" @click="numberClick(9)">9</span>
            <span class="cell" @click="dateSelectShow = true"><van-icon class-prefix="my-icon" size="18px" name="rili" v-if="showDate === '今天'" />{{ showDate }}</span>
        </div>
        <div class="standard" v-if="show">
            <span class="cell" @click="numberClick(4)">4</span>
            <span class="cell" @click="numberClick(5)">5</span>
            <span class="cell" @click="numberClick(6)">6</span>
            <span class="cell" @click="plusClick">+</span>
        </div>
        <div class="standard" v-if="show">
            <span class="cell" @click="numberClick(1)">1</span>
            <span class="cell" @click="numberClick(2)">2</span>
            <span class="cell" @click="numberClick(3)">3</span>
            <span class="cell" @click="reduceClick">-</span>
        </div>
        <div class="standard" v-if="show">
            <span class="cell" @click="decimalClick">.</span>
            <span class="cell" @click="numberClick(0)">0</span>
            <span class="cell" @click="backspaceClick"><svg-icon size="18px" icon-class="tuige" /></span>
            <span class="cell submit" @click="submit">完成</span>
        </div>
        <van-popup v-model:show="dateSelectShow" position="bottom" @closed="currentDate = new Date(recordDate)">
            <van-datetime-picker v-model="currentDate" type="date" title="选择日期" @confirm="DateSelect" @cancel="dateSelectShow = false" />
        </van-popup>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { Decimal } from 'decimal.js';
import dayjs from 'dayjs';
export default defineComponent({
    name: 'AddPayRecord',
    setup (props, { emit }) {
        const data = reactive({
            show: true,
            amount: '0.00',
            initial: true,
            compute: false,
            computeDateail: { first: '0', last: '0', symbol: '' },
            dateSelectShow: false,
            currentDate: new Date(),
            recordDate: new Date(),
            showDate: '今天',
            remark: ''
        });

        // 数字点击
        const numberClick = (number: number): void => {
            if (data.initial) {
                data.amount = number.toString();
                data.initial = false;
                return;
            }
            let index = data.amount.indexOf('.');
            const strArray = data.amount.split(data.computeDateail.symbol);
            switch (data.compute) {
            case true:
                index = strArray[1].indexOf('.');
                if ((index !== -1 && strArray[1].length - 1 - index >= 2) || (number === 0 && strArray[1] === '0') || strArray[1].length >= 8) {
                    break;
                }
                data.computeDateail.last = strArray[1] + number.toString();
                data.amount += number.toString();
                break;
            case false:
                if ((index !== -1 && data.amount.length - 1 - index >= 2) || (number === 0 && data.amount === '0') || data.amount.length >= 8) {
                    break;
                }
                if (data.amount === '0') {
                    data.amount = number.toString();
                    break;
                }
                data.amount += number.toString();
                break;
            }
        };

        // 小数点点击
        const decimalClick = (): void => {
            if (data.initial) {
                data.amount = '.';
                data.initial = false;
                return;
            }
            const index = data.amount.indexOf('.');
            const strArray = data.amount.split(data.computeDateail.symbol);
            switch (data.compute) {
            case true:
                if (index !== -1 && data.amount.split('.').length >= 3) {
                    break;
                }
                data.amount += '.';
                if (strArray[1] === '.') {
                    data.computeDateail.last = '0';
                }
                break;
            case false:
                if (index !== -1) {
                    break;
                }
                data.amount += '.';
                break;
            }
        };

        // 回退点击
        const backspaceClick = (): void => {
            if (data.amount === '0') {
                return;
            }
            if (data.amount.length === 1) {
                data.amount = '0';
                return;
            }
            const lastTxt = data.amount.slice(data.amount.length - 1);
            if (data.compute && (lastTxt === '+' || lastTxt === '-')) {
                data.compute = false;
                data.computeDateail = { first: '0', last: '0', symbol: '' };
            }
            data.amount = data.amount.slice(0, data.amount.length - 1);
        };
        // + 点击
        const plusClick = (): void => {
            if (data.initial || data.amount === '0') {
                return;
            }
            const lastTxt = data.amount.slice(data.amount.length - 1);
            if (lastTxt === '+') {
                return;
            }
            if (lastTxt === '-') {
                data.amount = data.amount.slice(0, data.amount.length - 1) + '+';
                return;
            }
            if (!data.compute) {
                data.compute = true;
                data.computeDateail.first = data.amount === '.' ? '0' : data.amount;
                data.computeDateail.symbol = '+';
                data.amount += '+';
                return;
            }
            calculate();
            data.computeDateail.first = data.amount;
            data.computeDateail.symbol = '+';
            data.amount += '+';
        };

        // - 点击
        const reduceClick = (): void => {
            if (data.initial || data.amount === '0') {
                return;
            }
            const lastTxt = data.amount.slice(data.amount.length - 1);
            if (lastTxt === '-') {
                return;
            }
            if (lastTxt === '+') {
                data.amount = data.amount.slice(0, data.amount.length - 1) + '-';
                return;
            }
            if (!data.compute) {
                data.compute = true;
                data.computeDateail.first = data.amount === '.' ? '0' : data.amount;
                data.computeDateail.symbol = '-';
                data.amount += '-';
                return;
            }
            calculate();
            data.computeDateail.first = data.amount;
            data.computeDateail.symbol = '-';
            data.amount += '-';
        };

        // 完成计算
        const calculate = (): void => {
            let val = 0 as any;
            switch (data.computeDateail.symbol) {
            case '+':
                val = new Decimal(data.computeDateail.first).add(new Decimal(data.computeDateail.last));
                break;
            case '-':
                val = new Decimal(data.computeDateail.first).sub(new Decimal(data.computeDateail.last));
                break;
            }
            data.amount = val.toString();
            data.computeDateail = { first: '0', last: '0', symbol: '' };
        };

        // 确定及保存点击
        const submit = (): void => {
            switch (data.compute) {
            case true:
                calculate();
                data.compute = false;
                break;
            case false:
                if (parseFloat(data.amount) === 0) {
                    break;
                }
                emit('save', { amount: data.amount, remark: data.remark, date: data.recordDate });
                break;
            }
        };

        // 日期选择
        const DateSelect = (): void => {
            data.recordDate = data.currentDate;
            data.dateSelectShow = false;
            const now = dayjs().format('YYYY/MM/DD');
            const date = dayjs(data.recordDate.toString()).format('YYYY/MM/DD');
            data.showDate = now === date ? '今天' : date;
        };

        return {
            ...toRefs(data),
            numberClick,
            decimalClick,
            backspaceClick,
            plusClick,
            reduceClick,
            submit,
            DateSelect
        };
    }
});
</script>
<style lang="scss" scoped>
.number-key-board {
    position: fixed;
    bottom: 0;
    background: #f2f3f5;
    left: 0;
    right: 0;
    .details {
        height: 44px;
        line-height: 44px;
        display: flex;
        padding: 0 10px;
        .remark {
            flex: 1;
            display: flex;
            align-items: center;
            width: 0;
            .icon {
                color: #000;
                padding-right: 5px;
            }
            .text {
                width: 42px;
            }
            .input {
                border: 0;
                height: 25px;
                background: transparent;
                width: 0;
                flex: 1;
            }
            .input::placeholder {
                color: #bbb;
            }
        }
        .amount {
            font-size: 20px;
            padding-left: 10px;
        }
    }
    .standard {
        .cell {
            width: 25%;
            height: 44px;
            line-height: 44px;
            text-align: center;
            border-right: 1px solid #d8dad9;
            box-sizing: border-box;
            float: left;
        }
        .cell:last-child {
            border-right: 0;
        }
        .submit {
            background: #ffda44;
        }
        border-top: 1px solid #d8dad9;
        box-sizing: border-box;
        height: 45px;
    }
    .standard:last-child {
        border-bottom: 0;
    }
}
</style>
