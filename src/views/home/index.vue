<template>
  <section>
    <div class="banner-wrap">
      <van-swipe
        :autoplay="3000"
        v-if="images.length"
      >
        <van-swipe-item
          v-for="(item, index) in images"
          :key="index"
        >
          <img
            class="image"
            :src="item.pic"
          />
        </van-swipe-item>
      </van-swipe>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      images: [],
    };
  },
  created() {
    this.$axios.get('/banner', { params: { type: 1 } })
      .then((res) => {
        this.images = res.data.banners || [];
      });
  },
};
</script>

<style lang="less" scoped>
.banner-wrap {
  padding: 0 15px;
  position: relative;
  /deep/ .van-swipe {
    border-radius: 10px;
    background: #aaaaaa;
  }
  .image {
    width: 100%;
    display: block;
  }
}
</style>
