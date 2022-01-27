import axios from 'axios';
// import VueRouter from '../router';

axios.interceptors.request.use(config => {
    if (config.method === 'post') {
        const data = config.data;
        for (const key in data) {
            if (key === '') {
                continue;
            }
            if (data[key] === null || data[key] === '' || data[key] === undefined) {
                delete data[key];
                continue;
            }
        }
        config.data = data;
    }
    return config;
});

axios.interceptors.response.use(
    response => {
        // if (response.data.code === 901) {
        //     localStorage.removeItem('loginToken');
        //     MessageBox.confirm('登录已失效，请重新登录', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         showCancelButton: false,
        //         type: 'warning'
        //     }).then(() => {
        //         VueRouter.push({ name: 'login' }).catch(() => {});
        //     }).catch(() => {
        //         VueRouter.push({ name: 'login' }).catch(() => {});
        //     });
        // }
        return response.data;
    },
    error => {
        // if (error.meaasge || error) {
        //     Message({
        //         type: 'error',
        //         message: error.meaasge ? error.meaasge : error
        //     });
        // }
        console.log(error);
        return { code: '233' };
    }
);

export default axios;
