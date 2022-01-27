<template>
    <van-popup v-model:show="addShow" position="right" ref="popup">
        <div class="d-flex-y" :style="{ width: documentSizse.width + 'px', height: documentSizse.height + 'px' }">
            <div class="status-bar"></div>
            <div class="header">
                类别设置
                <div class="return" @click="addShow = false"><svg-icon icon-class="arrowLeft"></svg-icon></div>
                <div class="save" @click="saveCategory">完成</div>
            </div>
            <!-- 输入框 -->
            <div class="d-flex category">
                <div class="category-icon">
                    <div class="show-icon active d-flex f-center">
                        <svg-icon :icon-class="addForm.icon"></svg-icon>
                    </div>
                </div>
                <div class="flex-1 category-input">
                    <van-field
                        v-model="addForm.categoryName"
                        label-width="0"
                        :placeholder="'输入' + (addForm.level === 1 ? '一级' : '二级') + '类别名称（不能超过四个汉字）'"
                        :maxlength="4"
                        class="category-name"
                    />
                </div>
            </div>
            <!-- 图标列表 -->
            <div class="flex-1 icon-box">
                <div class="icon-list" v-for="item of categoryList" :key="item.title">
                    <div :span="24" class="title" v-html="item.title"></div>
                    <div class="icon" v-for="icon of item.list" :key="icon.iconID">
                        <div class="show-icon d-flex f-center" :class="icon.iconName === addForm.icon ? 'active' : ''" @click="addForm.icon = icon.iconName">
                            <svg-icon :icon-class="icon.iconName"></svg-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import { useWindowSize } from '@vant/use';
import api from '@/api';
import Category from '@/models/Expense/Category';
import utils from '@/utils';
import { useStore } from 'vuex';
export default defineComponent({
    name: 'CategorySet',
    props: {
        operation: Object
    },
    setup (props, { emit }) {
        const { width, height } = useWindowSize();
        const store = useStore();
        const data = reactive({
            dialogType: 'add',
            addShow: false,
            documentSizse: { width: width.value, height: height.value },
            categoryList: localStorage.getItem('abIcon') ? JSON.parse(localStorage.getItem('abIcon') + '') : ([] as any),
            addForm: {
                categoryName: '',
                icon: '',
                level: '',
                parentID: '',
                userID: '',
                flag: '',
                sort: 0
            } as Category
        });
        onMounted(() => {
            data.categoryList = store.state.iconList;
            getFirstIcon();
        });
        // 监听操作类型
        watch(
            () => props.operation,
            (newVal: any) => {
                data.addShow = true;
                data.dialogType = newVal.type;
                if (newVal.type === 'edit') {
                    data.addForm = newVal.category;
                    return;
                }
                data.addForm.level = newVal.leavel;
                data.addForm.parentID = newVal.parentID;
                data.addForm.flag = newVal.flag;
                data.addForm.sort = newVal.sort;
                getFirstIcon();
            }
        );

        // 保存类型
        const saveCategory = () => {
            const str = data.addForm.categoryName.replace(/(^\s*)|(\s*$)/g, '');
            if (str === '') {
                utils.message({ message: '名称不能为空', position: 'top' });
                return;
            }
            switch (data.dialogType) {
            case 'add':
                categoryAdd();
                break;
            case 'edit':
                categoryEdit();
                break;
            }
        };

        // 类型添加
        const categoryAdd = async () => {
            const res = await api.expense.category.categoryAdd(
                data.addForm.categoryName.replace(/(^\s*)|(\s*$)/g, ''),
                data.addForm.icon,
                data.addForm.level,
                data.addForm.parentID,
                data.addForm.flag,
                data.addForm.sort
            );
            if (res.code !== 200) {
                utils.message({ message: '添加失败', position: 'top' });
                return;
            }
            window.sessionStorage.removeItem('category');
            emit('refresh');
            data.addShow = false;
            clearForm();
        };
        // 类型编辑
        const categoryEdit = async () => {
            const res = await api.expense.category.categoryEdit(data.addForm.categoryID, data.addForm.categoryName.replace(/(^\s*)|(\s*$)/g, ''), data.addForm.icon);
            if (res.code !== 200) {
                utils.message({ message: '修改失败', position: 'top' });
                return;
            }
            window.sessionStorage.removeItem('category');
            emit('refresh');
            data.addShow = false;
            clearForm();
        };
        // 清空输入内容
        const clearForm = () => {
            data.addForm = {
                categoryName: '',
                icon: '',
                level: '',
                parentID: '',
                userID: '',
                flag: '',
                sort: 0
            } as Category;
        };

        // 获取第一个icon
        const getFirstIcon = () => {
            if (data.categoryList.lengrh === 0) {
                return;
            }
            data.addForm.icon = data.categoryList[0].list[0].iconName;
        };

        return {
            ...toRefs(data),
            saveCategory
        };
    }
});
</script>
<style lang="scss" scoped>
.header {
    background: #ffda44;
    height: 40px;
    position: relative;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
    .return,
    .save {
        font-size: 14px;
        font-weight: 400;
    }
    .return {
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
    }
    .save {
        position: absolute;
        right: 0;
        top: 0;
        width: 50px;
    }
}
.category {
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid #d9d9d9;
    .category-icon {
        width: 20%;
    }
    .category-input {
        padding-right: 15px;
    }
    .category-name {
        border-bottom: 1px solid #757575;
        padding: 0;
        margin-top: 12px;
    }
}
.icon-box {
    height: 0;
    overflow: scroll;
    padding-bottom: 20px;
    .icon-list {
        display: flex;
        flex-flow: wrap;
        .title {
            text-align: center;
            height: 20px;
            line-height: 20px;
            margin-top: 20px;
            width: 100%;
            letter-spacing: 2px;
        }
        .icon {
            width: 20%;
            padding-top: 15px;
            position: relative;
        }
    }
    .icon-list:first-child .title {
        margin-top: 10px;
    }
}
</style>
<style scoped>
.category-input :deep(.van-field__control::placeholder) {
    font-size: 12px;
    letter-spacing: 2px;
}
</style>
