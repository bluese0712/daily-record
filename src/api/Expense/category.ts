import axios from '../axiosConfig';

const api = {
    // 获取所有图标
    getAllIcon: (): any => axios.get('/api/expense/category/iconList'),
    // 添加分类
    categoryAdd: (categoryName: string, icon: string, level: number | string, parentID: number | string, flag: string, sort: number): any =>
        axios.post('/api/expense/category/categoryAdd', {
            categoryName: categoryName,
            icon: icon,
            level: level,
            parentID: parentID,
            flag: flag,
            sort: sort
        }),
    // 添加分类
    categoryEdit: (categoryID: number, categoryName: string, icon: string): any =>
        axios.post('/api/expense/category/categoryEdit', {
            categoryID: categoryID,
            categoryName: categoryName,
            icon: icon
        }),
    // 获取所有可用分类
    getCategory: (): any => axios.get('/api/expense/category/categoryList'),
    // 获取所有分类
    getAllCategory: (): any => axios.get('/api/expense/category/allCategoryList'),
    // 删除类别
    deleteCategory: (categoryID: number): any => axios.post('/api/expense/category/categoryDelete', { categoryID: categoryID }),
    // 恢复类别
    recoverCategory: (categoryID: number): any => axios.post('/api/expense/category/categoryRecover', { categoryID: categoryID })
};
export default api;
