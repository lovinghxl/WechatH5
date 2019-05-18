<template>
    <div>
        <van-tabbar v-model="active">
            <van-tabbar-item icon="shop-o" to="/">商城</van-tabbar-item>
            <van-tabbar-item icon="phone-o" to="/article">售后</van-tabbar-item>
            <van-tabbar-item icon="manager-o" to="/userCenter">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    name: 'vNav',
    data () {
        return {
            active: 0
        }
    },
    watch: {
        $route (to,from) {
            this.navAction()
        }
    },
    created: function () {
        
    },
    mounted: function () {
        this.navAction()
    },
    methods: {
        navAction () {
            if (this.$route.path === '/') {
                this.active = 0
            } else if (this.$route.path === '/article') {
                this.active = 1
            } else {
                this.active = 2
            }
        }
    }
}
</script>

