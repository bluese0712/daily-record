import axios from '../axiosConfig';

const api = {
    // 添加分类
    recordMonthStatistics: (year:number, month: number): any => axios.post('/api/expense/record/recordMonthStatistics', { year: year, month: month }),
    // 添加账单记录
    recordAdd: (categoryID: string, year: number, month: number, day: number, flag: string, amount: number, remark: string, accountBookID: number): any =>
        axios.post('/api/expense/record/recordAdd', {
            categoryID: categoryID,
            year: year,
            month: month,
            day: day,
            flag: flag,
            amount: amount,
            remark: remark,
            accountBookID: accountBookID
        }),
    // 获取所有可用分类
    getRecordList: (year?: string, month?: string, day?: string): any => axios.post('/api/expense/record/recordList', {
        year: year,
        month: month,
        day: day
    }),
    // 获取所有可用分类
    getRecordPaging: (): any => axios.get('/api/expense/record/recordPaging')
};
export default api;
