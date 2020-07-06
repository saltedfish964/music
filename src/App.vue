<template>
  <div
    id="app"
    class="app"
  >
    <router-view />
    <div class="player">
      <player></player>
      <audio ref="audio"></audio>
    </div>
    <van-overlay :show="$store.state.overlay">
      <div class="wrap">
        <van-loading
          type="spinner"
          vertical
        >加载中...</van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  components: {
    player: () => import('./components/player/index.vue'),
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$store.state.audio === null) {
        this.$store.commit('setAudio', this.$refs.audio);
        this.$store.commit('initListentener');
        this.$store.commit('initSongs');
        this.$store.commit('initCurrentSong');
      }
    });
  },
};
</script>

<style lang="less" scoped>
.app {
  position: relative;
  min-height: 100vh;
  background: #ffffff;
  .player {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .wrap {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }
}
</style>
