<template>
  <section
    class="player"
    v-if="$store.state.songs.length"
  >
    <div
      class="left"
      @click="$store.commit('setShowPlay', true)"
    >
      <div class="image-wrap">
        <img
          :src="$store.state.currentSong.image"
          style="height: 100%;"
        >
      </div>
      <div class="text">
        <div class="title">{{ $store.state.currentSong.name }}</div>
        <div class="tips">
          {{ $store.state.currentSong.lrc[$store.state.lrcIndex].lyrics }}
        </div>
      </div>
    </div>
    <div class="right">
      <van-icon
        :name="$store.state.isPlay ? 'pause-circle-o' : 'play-circle-o'"
        class="icon"
        @click="handlePlay"
      />
      <van-icon
        name="bars"
        class="icon"
        @click="$store.commit('setShowSongs', true)"
      />
    </div>
    <detail></detail>
    <list></list>
  </section>
</template>

<script>
export default {
  components: {
    detail: () => import('./detail.vue'),
    list: () => import('./list.vue'),
  },
  methods: {
    handlePlay() {
      this.$store.commit('setIsPlay', !this.$store.state.isPlay);
      if (this.$store.state.isPlay) {
        this.$store.commit('playMusic');
      } else {
        this.$store.commit('pauseMusic');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.player {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border-top: 1px solid #eeeeee;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  padding: 0 0 0 10px;
  .left {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;
    .image-wrap {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      overflow: hidden;
      border-radius: 50%;
      background: #eeeeee;
      margin-right: 5px;
    }
    .text {
      color: #333333;
      width: calc(100% - 50px);
      .tips {
        color: #aaaaaa;
        font-size: 11px;
        margin-top: 5px;
      }
      .tips,
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .right {
    flex: 0 0 100px;
    .icon {
      line-height: 50px;
      width: 50px;
      height: 50px;
      text-align: center;
      font-size: 28px;
      color: #333333;
    }
  }
}
</style>
