<template>
  <div
    class="player-detail"
    v-show="$store.state.showPlay"
  >
    <van-nav-bar
      :title="`${$store.state.currentSong.name} - ${$store.state.currentSong.singer}`"
      left-arrow
      @click-left="$store.commit('setShowPlay', false)"
    />
    <div class="wrap">
      <img
        class="aqn"
        :class="{
            'aqn-play': $store.state.isPlay,
          }"
        src="../../assets/images/aqn.png"
      >
      <div
        class="axo-wrap"
        :class="{
            'axo-play': $store.state.isPlay,
          }"
      >
        <img :src="$store.state.currentSong.image">
      </div>
    </div>
    <div class="top-btn">
      <van-icon
        name="like-o"
        class="icon"
      />
      <van-icon
        name="comment-o"
        class="icon"
      />
    </div>
    <div class="ctrl">
      <div class="time">{{ $store.state.musicCurrentTime }}</div>
      <div class="slider">
        <van-slider
          v-model="$store.state.sliderValue"
          @change="onChange"
        />
      </div>
      <div class="time">{{ $store.state.musicMaxTime }}</div>
    </div>
    <div class="bottom-btn">
      <van-icon class="iconfont my-iconcaozuo-xunhuan1 other"></van-icon>
      <van-icon
        name="arrow-left"
        class="pre"
      />
      <van-icon
        :name="$store.state.isPlay ? 'pause-circle-o' : 'play-circle-o'"
        class="play"
        @click="handlePlay"
      />
      <van-icon
        name="arrow"
        class="next"
      />
      <van-icon
        name="wap-nav"
        class="other"
        @click="$store.commit('setShowSongs', true)"
      />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handlePlay() {
      this.$store.commit('setIsPlay', !this.$store.state.isPlay);
      if (this.$store.state.isPlay) {
        this.$store.commit('playMusic');
      } else {
        this.$store.commit('pauseMusic');
      }
    },
    onChange(value) {
      this.$store.commit('sliderChange', value);
    },
  },
};
</script>

<style lang="less" scoped>
.player-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #555555;
  z-index: 2;
  /deep/ .van-nav-bar {
    background: #555555;
    .van-icon,
    .van-nav-bar__title {
      color: #ffffff;
    }
    .van-nav-bar__title {
      margin-left: 52px;
    }
  }
  /deep/ [class*="van-hairline"]::after {
    border: none;
  }
  .wrap {
    height: calc(100vh - 166px);
    .aqn {
      position: absolute;
      transform: translateX(-50%) rotate(-45deg);
      transform-origin: 0 0;
      transition: 1s all linear;
      top: 17vh;
      left: 50%;
      z-index: 2;
      &.aqn-play {
        transform: translateX(-50%) rotate(0deg);
      }
    }
    .axo-wrap {
      width: 66vw;
      height: 66vw;
      margin: 0 auto;
      border-radius: 50%;
      background: url("../../assets/images/axo.png") no-repeat;
      background-size: cover;
      position: relative;
      top: 15vh;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: rotate360 15s linear infinite;
      animation-play-state: paused;
      &.axo-play {
        animation-play-state: running;
      }
      img {
        width: 40vw;
        height: 40vw;
        border-radius: 50%;
      }
    }
  }
  .top-btn {
    display: flex;
    justify-content: center;
    .icon {
      font-size: 22px;
      width: 50px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #dddddd;
    }
  }
  .ctrl {
    display: flex;
    align-items: center;
    height: 20px;
    /deep/ .van-slider__button {
      width: 12px;
      height: 12px;
    }
    .slider {
      flex: 1;
    }
    .time {
      color: #dddddd;
      flex: 0 0 60px;
      text-align: center;
    }
  }
  .bottom-btn {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dddddd;
    .play {
      font-size: 42px;
    }
    .pre,
    .next,
    .other {
      font-size: 24px;
      width: 60px;
      text-align: center;
    }
  }
}
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
