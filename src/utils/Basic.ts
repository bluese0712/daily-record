import api from '@/api';

// 从缓存或者服务器获取所有类别
const getAllCategory = async (): Promise<any[]> => {
    const array = window.sessionStorage.getItem('category') as any;
    if (array !== null) {
        return JSON.parse(array);
    }
    const effectiveArray = [[], []] as any;
    const invalidArray = [[], []] as any;
    const res = await api.expense.category.getAllCategory();
    if (res.code !== 200) {
        return [];
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
            console.log('delete');
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
    window.sessionStorage.setItem('category', JSON.stringify([effectiveArray[0], invalidArray[0], effectiveArray[1], invalidArray[1]]));
    return [effectiveArray[0], invalidArray[0], effectiveArray[1], invalidArray[1]];
};

const request = {
    /**
     * 获取所有类别
     * @method getCategoryByType
     * @for utils
     * @param {String} type 数据分类，all:全部 effective:有效的 invalid:删除的
     * @return {Array<any[]>} all:[有效支出，删除支出，有效收入，删除收入], effective:[有效支出，有效收入], invalid:[删除支出，删除收入]
     */
    getCategoryByType: async (type = 'effective'): Promise<any> => {
        // allCategory: [有效支出，无效支出，有效收入，无效收入]
        const allCategory = await getAllCategory();
        let array = [];
        switch (type) {
        case 'all':
            array = allCategory;
            break;
        case 'effective':
            array = [allCategory[0], allCategory[2]];
            break;
        case 'invalid':
            array = [allCategory[1], allCategory[3]];
            break;
        }
        return array;
    }
};
export default request;
