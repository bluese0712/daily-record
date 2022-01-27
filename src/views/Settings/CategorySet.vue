<template>
    <van-popup v-model:show="addShow" position="right" ref="popup">
        <div class="d-flex-y" :style="{ width: documentSizse.width + 'px', height: documentSizse.height + 'px' }">
            <div class="status-bar"></div>
            <div class="header">
                类别设置
                <div class="return" @click="addShow = false"><svg-icon size="18" icon-class="arrowLeft" /></div>
            </div>
            <div class="tags d-flex f-center">
                <div class="tag" :class="categoryType === 'pay' ? 'active' : ''" @click="categoryType = 'pay'">支出</div>
                <div class="tag" :class="categoryType === 'revenues' ? 'active' : ''" @click="categoryType = 'revenues'">收入</div>
            </div>
            <div class="flex-1 content">
                <div class="category-list" v-if="categoryType === 'pay' && payCategoryList.length !== 0">
                    <van-row class="category-box" v-for="item of payCategoryList" :key="item.categoryID">
                        <van-col :span="24" class="title"><span @click="editOperation = { type: 'edit', category: item }">{{ item.categoryName }}</span></van-col>
                        <van-col :span="6" class="category d-flex-y f-y-center" v-for="child of item.childrenList" :key="child.categoryID">
                            <div class="show-icon d-flex f-center"><svg-icon size="24" :icon-class="child.icon" @click="editOperation = { type: 'edit', category: child }" /></div>
                            <div class="mt-10 label" @click="editOperation = { type: 'edit', category: child }">{{ child.categoryName }}</div>
                            <svg-icon icon-class="minus" size="18" class="deleteIcon" @click="categoryDelete(child)" v-if="!item.deleteStatus" />
                            <svg-icon icon-class="plus" size="18" class="addIcon" @click="categoryRecover(child)" v-else />
                        </van-col>
                        <van-col :span="6" class="category d-flex-y f-x-center" @click="categoryAddClick(2, item.categoryID)" v-if="!item.deleteStatus">
                            <div class="show-icon d-flex f-center"><svg-icon size="24" icon-class="plus" /></div>
                            <div class="mt-10 label">新增</div>
                        </van-col>
                    </van-row>
                </div>
                <div class="category-list" v-if="categoryType === 'revenues' && revenuesCategoryList.length !== 0">
                    <van-row class="category-box" v-for="item of revenuesCategoryList" :key="item.categoryID">
                        <van-col :span="24" class="title"><span @click="editOperation = { type: 'edit', category: item }">{{ item.categoryName }}</span></van-col>
                        <van-col :span="6" class="category d-flex-y f-y-center" v-for="child of item.childrenList" :key="child.categoryID">
                            <div class="show-icon d-flex f-center"><svg-icon size="24" :icon-class="child.icon" @click="editOperation = { type: 'edit', category: child }" /></div>
                            <div class="mt-10 label" @click="editOperation = { type: 'edit', category: child }">{{ child.categoryName }}</div>
                            <svg-icon icon-class="minus" size="18" class="deleteIcon" @click="categoryDelete(child)" v-if="!item.deleteStatus" />
                            <svg-icon icon-class="plus" size="18" class="addIcon" @click="categoryRecover(child)" v-else />
                        </van-col>
                        <van-col :span="6" class="category d-flex-y f-x-center" @click="categoryAddClick(2, item.categoryID)" v-if="!item.deleteStatus">
                            <div class="show-icon d-flex f-center"><svg-icon size="24" icon-class="plus" /></div>
                            <div class="mt-10 label">新增</div>
                        </van-col>
                    </van-row>
                </div>
            </div>
            <div class="add" @click="categoryAddClick(1, 0)">新建一级分类</div>
        </div>
        <CategoryEdit :operation="editOperation" @refresh="refreshCategory" />
    </van-popup>
</template>

<script lang="ts">
import api from '@/api';
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { useWindowSize } from '@vant/use';
import CategoryEdit from './CategoryEdit.vue';
import utils from '@/utils';
import { useStore } from 'vuex';
export default defineComponent({
    name: 'CategorySet',
    components: { CategoryEdit },
    props: {
        operation: Object
    },
    setup (props, { emit }) {
        const { width, height } = useWindowSize();
        const store = useStore();
        const data = reactive({
            categoryType: 'pay',
            addShow: false,
            documentSizse: { width: width.value, height: height.value },
            editOperation: {},
            activeType: '',
            payCategoryList: store.state.validPayCategoryList.concat(store.state.invalidPayCategoryList),
            revenuesCategoryList: store.state.validRevenuesCategoryList.concat(store.state.invalidRevenuesCategoryList)
        });
        watch(
            () => props.operation,
            (newVal: any) => {
                data.categoryType = newVal.type;
                data.addShow = newVal.show;
            }
        );

        // 类别删除
        const categoryDelete = async (category: any) => {
            const res = await api.expense.category.deleteCategory(category.categoryID);
            if (res.code !== 200) {
                utils.message.fail(res.msg);
                return false;
            }
            refreshCategory();
        };

        // 类别恢复
        const categoryRecover = async (category: any) => {
            const res = await api.expense.category.recoverCategory(category.categoryID);
            if (res.code !== 200) {
                utils.message.fail(res.msg);
                return false;
            }
            refreshCategory();
        };

        // 添加点击
        const categoryAddClick = (leavel: number, parentID: number) => {
            let num = 1;
            const array = data.categoryType === 'pay' ? JSON.parse(JSON.stringify(data.payCategoryList)) : JSON.parse(JSON.stringify(data.revenuesCategoryList));
            switch (leavel) {
            case 1:
                for (const item of array) {
                    num = num > item.sort ? num : item.sort;
                }
                num++;
                break;
            case 2:
                for (const item of array) {
                    if (item.categoryID === parentID) {
                        for (const child of item.childrenList) {
                            num = num > child.sort ? num : child.sort;
                        }
                    }
                }
                num++;
                break;
            }
            data.editOperation = { type: 'add', flag: data.categoryType, leavel: leavel, parentID: parentID, sort: num };
        };
        const refreshCategory = async () => {
            store.dispatch('refreshCategory').then(() => {
                data.payCategoryList = store.state.validPayCategoryList.concat(store.state.invalidPayCategoryList);
                data.revenuesCategoryList = store.state.validRevenuesCategoryList.concat(store.state.invalidRevenuesCategoryList);
                emit('refresh');
            });
        };

        return {
            ...toRefs(data),
            categoryDelete,
            categoryAddClick,
            categoryRecover,
            refreshCategory
        };
    }
});
</script>
<style lang="scss" scoped>
// 顶部标题
.tags,
.header {
    background: #ffda44;
    height: 40px;
    position: relative;
    text-align: center;
    line-height: 40px;
}
.header .return {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
}
.tags {
    .tag {
        color: #343434;
        width: 40%;
        text-align: center;
        border: 1px solid #343233;
        border-radius: 0px 5px 5px 0px;
        height: 25px;
        line-height: 25px;
        margin-bottom: 5px;
    }
    .tag:first-child {
        border-radius: 5px 0px 0px 5px;
    }
    .tag.active {
        background: #343233;
        color: #fed845;
    }
}
// 分类详情
.content {
    height: 0;
    overflow: scroll;
}
.category-list:last-child {
    padding-bottom: 65px;
}
.category-list {
    position: relative;
    box-sizing: border-box;
    .category-box:first-child .title {
        margin-top: 10px;
    }
    .title {
        text-align: center;
        height: 20px;
        line-height: 20px;
        margin-top: 20px;
    }
    .category {
        padding-top: 10px;
        position: relative;
        .show-icon {
            width: 44px;
            height: 44px;
            background: #f5f5f5;
            border-radius: 22px;
            margin: 0 auto;
        }
        .label {
            text-align: center;
        }
        .addIcon,
        .deleteIcon {
            position: absolute;
            right: 9px;
            top: 4px;
            padding: 4px;
            border-radius: 50%;
            color: #fff;
        }
        .deleteIcon {
            background: #fa3a39;
        }
        .addIcon {
            background: #30ff29;
        }
    }
    .add {
        position: absolute;
        bottom: 0;
        height: 45px;
        line-height: 45px;
        border-top: 1px solid #d9d9d9;
        left: 0;
        right: 0;
        text-align: center;
        letter-spacing: 2px;
        background: #fff;
    }
}
</style>
