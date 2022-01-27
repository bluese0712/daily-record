import { createStore } from 'vuex';
import api from '@/api';

export default createStore({
    state: {
        addStatus: false,
        iconList: [],
        /** **** 类别分组  **** **/
        validPayCategoryList: [],
        invalidPayCategoryList: [],
        validRevenuesCategoryList: [],
        invalidRevenuesCategoryList: []
        /** **** 类别分组  **** **/
    },
    mutations: {
        needAdd (state, val) {
            state.addStatus = val;
        },
        saveIcon (state, val) {
            state.iconList = val;
        },
        saveCategory (state, val) {
            state.validPayCategoryList = val[0];
            state.invalidPayCategoryList = val[1];
            state.validRevenuesCategoryList = val[2];
            state.invalidRevenuesCategoryList = val[3];
        }
    },
    actions: {
        // 获取所有图标
        async getIconList ({ commit }) {
            const res = await api.expense.category.getAllIcon();
            if (res.code !== 200) {
                return;
            }
            const typeMap = new Map();
            for (const item of res.data) {
                const array = typeMap.has(item.category) ? typeMap.get(item.category) : [];
                array.push(item);
                typeMap.set(item.category, array);
            }
            const array = [] as any;
            typeMap.forEach((v, k) => {
                array.push({ title: k, list: v });
            });
            commit('saveIcon', array);
        },
        // 获取所有图标，并分类
        async getAllCategory ({ commit }) {
            const effectiveArray = [[], []] as any;
            const invalidArray = [[], []] as any;
            const res = await api.expense.category.getAllCategory();
            if (res.code !== 200) {
                return false;
            }
            // 提取所有一级分类
            const categoryMap = new Map();
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].parentID === 0 && !categoryMap.has(res.data[i].categoryID)) {
                    res.data[i].childrenList = [];
                    categoryMap.set(res.data[i].categoryID, res.data[i]);
                    res.data.slice(i, 1);
                    i--;
                }
            }
            // 二级分类进行分门别类
            for (const item of res.data) {
                if (categoryMap.has(item.parentID)) {
                    const array = categoryMap.get(item.parentID);
                    array.childrenList.push(item);
                    categoryMap.set(item.parentID, array);
                }
            }
            categoryMap.forEach(v => {
                const num = v.flag === 'pay' ? 0 : 1;
                // 判断一级分类是否被删除 被删则不用进行下面判断 整个一级分类归属于已删
                if (v.deleteStatus) {
                    invalidArray[num].push(v);
                    return;
                }
                // 获取被删除的二级分类
                const array = [];
                for (let i = 0; i < v.childrenList.length; i++) {
                    if (v.childrenList[i].deleteStatus) {
                        array.push(v.childrenList.splice(i, 1)[0]);
                        i--;
                    }
                }
                // 如果有被删除的二级分类,则复制一级分类并赋值子分类 归属于已删
                if (array.length !== 0) {
                    const list = JSON.parse(JSON.stringify(v));
                    list.childrenList = array;
                    invalidArray[num].push(list);
                }
                effectiveArray[num].push(v);
            });
            commit('saveCategory', [effectiveArray[0], invalidArray[0], effectiveArray[1], invalidArray[1]]);
            return true;
        },
        // 刷新图标
        async refreshCategory ({ dispatch }) {
            await dispatch('getAllCategory');
            return new Promise((resolve) => {
                resolve('成功');
            });
        }

    },
    modules: {}
});
