<template>
  <section>
    <div class="tab-wrap">
      <van-icon
        name="user-o"
        class="icon"
      />
      <div class="tab">
        <router-link
          class="tab-item"
          :class="{
            active: item.path === $route.fullPath
          }"
          v-for="item in $store.state.tabs"
          :key="item.path"
          :to="item.path"
        >{{ item.name }}</router-link>
      </div>
      <van-icon
        name="search"
        class="icon"
        @click="$router.push('/search')"
      />
    </div>
    <div>
      <router-view />
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style lang="less" scoped>
.tab-wrap {
  display: flex;
  background: #ffffff;
  .icon {
    line-height: 44px;
    font-size: 22px;
    flex: 0 0 44px;
    text-align: center;
  }
  .tab {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .tab-item {
      margin: 0 10px;
      width: 50px;
      color: #333333;
      text-align: center;
    }
    .active {
      font-size: 20px;
    }
  }
}
</style>
