<template>
  <section
    class="list-wrap"
    v-show="$store.state.showSongs"
    @click.stop="$store.commit('setShowSongs', false)"
  >
    <div
      class="wrap"
      @click.stop="() => {}"
    >
      <div class="count">当前播放（{{ $store.state.songs.length }}）</div>
      <div class="ctrl">
        <div
          class="mode"
          @click.stop="$store.commit('changeMode');"
        >
          <van-icon
            class="iconfont icon other"
            :class="{
              'my-iconcaozuo-xunhuan1': $store.state.type === 0,
              'my-iconsuijibofang': $store.state.type === 1,
              'my-icondanquxunhuan': $store.state.type === 2,
            }"
          ></van-icon>
          <div>
            {{ $store.state.type === 0 ? '列表循环' : $store.state.type === 1 ? '随机播放' : '单曲循环'  }}
          </div>
        </div>
        <van-icon
          name="delete"
          class="icon"
          @click="onClearSongs"
        />
      </div>
      <div class="musil-list">
        <div
          class="item"
          v-for="item in $store.state.songs"
          :key="item.id"
          @click="onPlay(item)"
        >
          <div class="left">
            <van-icon
              name="music-o"
              class="playing"
              v-show="$store.state.playId === item.id"
            />
            <div class="text">{{ item.name }} <span class="singer">- {{ item.singer }}</span></div>
          </div>
          <div class="right">
            <van-icon
              name="cross"
              @click.stop="onRemoveOne(item)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    onClearSongs() {
      this.$dialog.confirm({
        message: '确定要清空播放列表?',
      })
        .then(() => {
          this.$store.commit('setShowSongs', false);
          this.$store.commit('setShowPlay', false);
          this.$store.commit('clearSongs');
        })
        .catch(() => {});
    },
    onPlay(item) {
      if (item.id === this.$store.state.currentSong.id) return;
      this.$store.commit('setCurrentSong', item);
      this.$store.commit('playMusic');
    },
    onRemoveOne(item) {
      const { songs, currentSong } = this.$store.state;
      if (currentSong.id === item.id) {
        songs.forEach((song, index) => {
          if (song.id === item.id) {
            const nextSong = songs[index + 1] || songs[index - 1];
            if (nextSong) {
              this.$store.commit('setCurrentSong', nextSong);
              this.$store.commit('playMusic');
            }
          }
        });
      }
      const newSongs = songs.filter((song) => song.id !== item.id);
      this.$store.commit('setSongs', newSongs);
    },
  },
};
</script>

<style lang="less" scoped>
.list-wrap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);
  z-index: 5;
  .wrap {
    position: relative;
    bottom: -40%;
    left: 0;
    height: 60vh;
    padding: 0 10px;
    background: #ffffff;
    .count {
      font-size: 16px;
      font-weight: bold;
      height: 50px;
      line-height: 50px;
    }
    .ctrl {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      .icon {
        font-size: 18px;
      }
      .other {
        margin-right: 5px;
      }
      .mode {
        display: flex;
      }
    }
    .musil-list {
      height: calc(100% - 80px);
      overflow-y: auto;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        .left {
          flex: 1;
          display: flex;
          align-items: center;
          .playing {
            font-size: 18px;
            margin-right: 5px;
          }
          .text {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: calc(100vw - 100px);
            .singer {
              color: #bbbbbb;
              font-size: 14px;
            }
          }
        }
        .right {
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          color: #bbbbbb;
          line-height: 40px;
          text-align: center;
        }
      }
    }
  }
}
</style>
