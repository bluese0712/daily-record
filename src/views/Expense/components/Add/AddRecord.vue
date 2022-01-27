<template>
    <div class="category-list">
        <van-row class="category-box">
            <van-col :span="6" class="category d-flex-y f-y-center" v-for="item of showList" :key="item.categoryID" @click="iconClick(item)">
                <div class="show-icon d-flex f-center" :class="item.categoryID === addCategory.categoryID ? 'active' : ''"><svg-icon size="24" :icon-class="item.icon" /></div>
                <div class="mt-10 label">{{ item.categoryName }}</div>
            </van-col>
            <van-col :span="6" class="category d-flex-y f-y-center" @click="operation = { type: 'pay', show: true }">
                <div class="show-icon d-flex f-center"><svg-icon size="24" icon-class="setting-o" /></div>
                <div class="mt-10 label">设置</div>
            </van-col>
        </van-row>
        <CategorySet :operation="operation" @refresh="getCategory"></CategorySet>
        <NumberKeyboard v-if="numberKeyboardShow" @save="saveRecord" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
import CategorySet from '@/views/Settings/CategorySet.vue';
import NumberKeyboard from '@/components/NumberKeyboard/index.vue';
import utils from '@/utils';
import api from '@/api';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'AddPayRecord',
    components: { CategorySet, NumberKeyboard },
    props: {
        type: {
            type: String,
            default: 'pay'
        }
    },
    setup (props, { emit }) {
        const store = useStore();
        const data = reactive({
            numberKeyboardShow: false,
            operation: { type: 'pay', show: false },
            categoryList: {
                pay: store.state.validPayCategoryList,
                revenues: store.state.validRevenuesCategoryList
            } as any,
            payCategoryList: [] as any,
            revenuesCategoryList: [] as any,
            addCategory: {} as any
        });

        watch(
            () => [store.state.addStatus, props.type],
            () => {
                data.addCategory = {};
                data.numberKeyboardShow = false;
            }
        );
        // 获取展示的类别
        const showList = computed(() => {
            let array = [] as any[];
            for (const item of data.categoryList[props.type]) {
                array = array.concat(item.childrenList);
            }
            return array;
        });

        // 刷新类别列表
        const getCategory = async (): Promise<void> => {
            data.categoryList = {
                pay: store.state.validPayCategoryList,
                revenues: store.state.validRevenuesCategoryList
            };
        };

        // 类别点击
        const iconClick = (icon: any) => {
            data.addCategory = icon;
            data.numberKeyboardShow = true;
        };

        // 保存金额
        const saveRecord = (val: any) => {
            const date = new Date(val.date);
            recordAdd(date.getFullYear(), date.getMonth() + 1, date.getDate(), parseFloat(val.amount), val.remark);
            data.numberKeyboardShow = false;
        };

        // 添加记录
        const recordAdd = async (year: number, month: number, day: number, amount: number, remark: string) => {
            const res = await api.expense.record.recordAdd(data.addCategory.categoryID, year, month, day, 'pay', amount, remark, 1);
            if (res.code !== 200) {
                utils.message({ message: res.msg, position: 'top' });
                return;
            }
            emit('close');
        };

        return {
            ...toRefs(data),
            getCategory,
            saveRecord,
            iconClick,
            showList
        };
    }
});
</script>
<style lang="scss" scoped>
.category-list {
    height: 100%;
    position: relative;
    box-sizing: border-box;
    padding-top: 10px;
    .category {
        padding: 10px 0;
        position: relative;
        .label {
            text-align: center;
        }
        .show-icon.active {
            background: #ffda44;
        }
    }
}
</style>
