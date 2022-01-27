interface Category {
    categoryID: number; // 分类ID
    categoryName: string; // 类别名称
    icon: string; // 图标
    level: number | string; // 级别(一级，二级)
    parentID: number | string; // 父ID
    userID: number | string; // 所属用户
    flag: string; // 类型 pay:支出，revenues:收入
    deleteStatus: boolean; // 删除状态 1为删除 0为使用中
    createTime: Date | string; // 创建时间
    updateTime: Date | string; // 更新时间
    sort: number; // 排序
}

export default Category;
