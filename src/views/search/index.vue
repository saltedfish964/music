<template>
  <section class="container">
    <van-search
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
      @input="onInput"
      @clear="resultList = []"
    />
    <div
      class="scroll"
      ref="scroll"
    >
      <div
        class="result"
        v-show="resultList.length"
      >
        <div class="title">搜索结果</div>
        <div>
          <div
            class="result-item"
            v-for="item in resultList"
            :key="item.id"
            @click="onPlayMusic(item)"
          >
            <van-icon
              name="search"
              class="result-icon"
            />
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="hot-result">
        <div class="hot">热搜榜</div>
        <div
          class="hot-item"
          v-for="(item, index) in list"
          :key="item.id"
          @click="quickSearch(item.searchWord)"
        >
          <div class="left">
            <div class="num">{{ index += 1 }}</div>
            <div>
              <div class="search-word">
                {{ item.searchWord }}
                <img
                  class="icon"
                  :src="item.iconUrl"
                />
              </div>
              <div class="content">{{ item.content }}</div>
            </div>
          </div>
          <div class="score">{{ item.score }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      list: [],
      resultList: [],
    };
  },
  created() {
    this.$axios.get('/search/hot/detail').then((res) => {
      if (res.data.code === 200) {
        this.list = res.data.data;
      } else {
        this.$toast(res.data.message);
      }
    });
  },
  methods: {
    onInput(value) {
      if (value === '') {
        this.resultList = [];
        return;
      }
      this.onSearch();
    },
    onCancel() {
      this.$router.push('/');
    },
    onSearch() {
      if (this.value === '') {
        this.$toast('请输入搜索关键字');
        this.resultList = [];
        return;
      }
      this.$axios.get('/search',
        {
          params: {
            keywords: this.value,
            type: 1,
          },
        }).then((res) => {
        if (res.data.code === 200) {
          this.resultList = res.data.result.songs;
          if (this.value === '') {
            this.resultList = [];
          }
          this.$refs.scroll.scrollTop = 0;
        } else {
          this.$toast(res.data.message);
        }
      });
    },
    quickSearch(value) {
      this.value = value;
      this.onSearch();
    },
    async onPlayMusic(item) {
      const obj = {};
      obj.name = item.name;
      obj.id = item.id;
      this.$store.commit('setOverlay', true);
      let check;
      try {
        check = await this.$axios.get('/check/music', {
          params: {
            id: item.id,
          },
        });
      } catch (error) {
        this.$toast('无版权');
      }
      if (check) {
        const url = await this.$axios.get('/song/url', {
          params: {
            id: item.id,
          },
        });
        const lyrics = await this.$axios.get('/lyric', {
          params: {
            id: item.id,
          },
        });
        obj.lrc = this.formatLyrics(lyrics.data.lrc.lyric);
        const detail = await this.$axios.get('/song/detail', {
          params: {
            ids: item.id,
          },
        });
        obj.image = detail.data.songs[0].al.picUrl;
        obj.singer = detail.data.songs[0].ar[0].name;
        obj.url = url.data.data[0].url;
        if (url.data.code === 200) {
          this.$store.commit('pushSong', obj);
          this.$store.commit('setCurrentSong', obj);
          this.$store.commit('setShowPlay', true);
          this.$store.commit('playMusic');
        }
      }
      this.$store.commit('setOverlay', false);
    },
    formatLyrics(lyrics) {
      const lrcList = lyrics.split('\n');
      const lrc = [];
      lrcList.forEach((lrcItem) => {
        const oneLrc = lrcItem.split(']');
        if (oneLrc[1]) {
          const time = oneLrc[0].replace('[', '');
          const timeSplit = time.split(':');
          const second = Number(timeSplit[1]);
          const minute = Number(timeSplit[0]);
          const allSecond = second + (minute * 60);
          const str = oneLrc[1];
          lrc.push({
            time: allSecond,
            lyrics: str,
          });
        }
      });
      return lrc;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding-bottom: 50px;
  .scroll {
    overflow-y: auto;
    height: calc(100vh - 104px);
    .result {
      box-sizing: border-box;
      padding: 0 12px;
      color: #333333;
      .title {
        font-size: 13px;
      }
      .result-item {
        min-height: 35px;
        padding: 5px 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        &:last-child {
          border-bottom: none;
        }
      }
      .result-icon {
        line-height: 35px;
        font-size: 18px;
        margin-right: 15px;
      }
    }
    .hot-result {
      box-sizing: border-box;
      padding: 0 12px;
      .hot {
        font-size: 13px;
      }
      .hot-item {
        justify-content: space-between;
        display: flex;
        height: 50px;
        color: #333333;
        .left {
          display: flex;
          align-items: center;
          .num {
            line-height: 50px;
            padding: 0 15px 0 5px;
            text-align: center;
          }
          .search-word {
            font-size: 16px;
            line-height: 22px;
            .icon {
              height: 12px;
            }
          }
          .content {
            font-size: 12px;
            color: #aaaaaa;
          }
        }
        .score {
          font-size: 12px;
          color: #aaaaaa;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
