import axios from '../axiosConfig';

const api = {
    // 添加账单
    billAdd: (categoryID: string, year: number, month: number, day: number, flag: string, amount: number, remark: string, accountBookID: number): any =>
        axios.post('/api/accountBook/bill/billAdd', {
            categoryID: categoryID,
            year: year,
            month: month,
            day: day,
            flag: flag,
            amount: amount,
            remark: remark,
            accountBookID: accountBookID
        }),
    // 编辑分类
    categoryEdit: (categoryID: number, categoryName: string, icon: string): any =>
        axios.post('/api/accountBook/category/categoryEdit', {
            categoryID: categoryID,
            categoryName: categoryName,
            icon: icon
        }),
    // 获取所有可用分类
    getBillList: (): any => axios.get('/api/accountBook/bill/billList'),
    // 获取所有分类
    getAllCategory: (): any => axios.get('/api/accountBook/category/allCategoryList'),
    // 删除类别
    deleteCategory: (categoryID: number): any => axios.post('/api/accountBook/category/categoryDelete', { categoryID: categoryID }),
    // 恢复类别
    recoverCategory: (categoryID: number): any => axios.post('/api/accountBook/category/categoryRecover', { categoryID: categoryID })
};
export default api;
