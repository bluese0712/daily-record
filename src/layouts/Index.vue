<template>
    <div class="d-flex-y h-100 w-100">
        <div class="status-bar"></div>
        <div class="flex-1 h-0"><router-view /></div>
        <van-row class="fooder" style="z-index: 10">
            <van-col span="5" class="category" @click="menuClick('expense')">
                 <svg-icon icon-class="expense" :class-name="menuName === 'expense' ? 'checked' : 'unchecked'"></svg-icon>
                <div class="font-10" :class="menuName === 'expense' ? 'checked' : 'unchecked'">花销</div>
            </van-col>
            <van-col span="5" class="category" @click="menuClick('movement')">
                <svg-icon icon-class="movement" :class-name="menuName === 'movement' ? 'checked' : 'unchecked'"></svg-icon>
                <div class="font-10" :class="menuName === 'movement' ? 'checked' : 'unchecked'">运动</div>
            </van-col>
            <van-col span="4" class="category" @click="menuClick('add')">
                <div class="add">
                    <label class="addBtn">
                        <svg-icon icon-class="plus" style="color: #ffffff"></svg-icon>
                    </label>
                </div>
            </van-col>
            <van-col span="5" class="category" @click="menuClick('record')">
                <svg-icon icon-class="record" :class-name="menuName === 'record' ? 'checked' : 'unchecked'"></svg-icon>
                <div class="font-10" :class="menuName === 'record' ? 'checked' : 'unchecked'">日历</div>
            </van-col>
            <van-col span="5" class="category" @click="menuClick('settings')">
                <svg-icon icon-class="settings" :class-name="menuName === 'settings' ? 'checked' : 'unchecked'"></svg-icon>
                <div class="font-10" :class="menuName === 'settings' ? 'checked' : 'unchecked'">我的</div>
            </van-col>
        </van-row>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'Layouts',
    setup () {
        const router = useRouter();
        const store = useStore();
        const data = reactive({
            menuName: 'expense'
        });

        const menuClick = (name: string) => {
            if (name === data.menuName) {
                return;
            }
            if (name === 'add') {
                store.commit('needAdd', true);
                return;
            }
            router.push('/' + name);
            data.menuName = name;
        };
        return {
            ...toRefs(data),
            menuClick
        };
    }
});
</script>
<style lang="scss" scoped>
.fooder {
    height: 50px;
    box-shadow: 0px 3px 5px #757575;
}
.category,
.add,
.addBtn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}
.add {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    position: absolute;
    top: -20px;
    box-shadow: 0px -2px 2px #ebedf0;
}
.addBtn {
    width: 40px;
    height: 40px;
    background: #ffda44;
    border-radius: 20px;
}
.unchecked {
    color: #646566;
}
.checked {
    color: #000;
}
</style>
