import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// svg Icon
// import '@/assets/icon/iconfont.js';
import SvgIcon from '@/components/SVG-Icon/index.vue';
// 入口文件
import './assets/scss/frame.scss';
// 公共样式
import './assets/scss/global.scss';
// 重置样式
import './assets/scss/reset.scss';
// import './assets/fonts/iconfont.css';
import { Col, Row, Icon, DatetimePicker, Popup, Circle, Field, Toast, Button } from 'vant';

const app = createApp(App);

app.use(Col);
app.use(Row);
app.use(Icon);
app.use(DatetimePicker);
app.use(Popup);
app.use(Circle);
app.use(Field);
app.use(Toast);
app.use(Button);

app.component('svg-icon', SvgIcon);

app.use(store).use(router).mount('#app');
