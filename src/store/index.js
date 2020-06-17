import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function transTime(time) {
  const duration = parseInt(time, 10);
  let minute = parseInt(duration / 60, 10);
  let sec = `${duration % 60}`;
  const isM0 = ':';
  if (minute === 0) {
    minute = '00';
  } else if (minute < 10) {
    minute = `0${minute}`;
  }
  if (sec.length === 1) {
    sec = `0${sec}`;
  }
  return minute + isM0 + sec;
}

export default new Vuex.Store({
  state: {
    tabs: [
      {
        name: '发现',
        path: '/home',
      },
      {
        name: '视频',
        path: '/video',
      },
    ],
    isPlay: false,
    showPlay: false,
    currentSong: {},
    audio: null,
    musicMaxTime: '00:00',
    musicCurrentTime: '00:00',
    sliderValue: 0,
    // 遮罩控制
    overlay: false,
    // 音乐列表
    songs: [],
    showSongs: false,
    playId: 0,
    // 播放模式
    type: 0, // 0 列表循环，1 随机播放， 2 单曲循环
    // 控制歌词
    lrcIndex: 0,
  },
  mutations: {
    setIsPlay(state, status) {
      state.isPlay = status;
    },
    setShowPlay(state, status) {
      state.showPlay = status;
    },
    // 初始化播放列表
    initSongs(state) {
      const songs = localStorage.getItem('songs');
      if (songs) {
        state.songs = JSON.parse(songs);
      }
    },
    // 添加音乐到播放列表
    pushSong(state, item) {
      const haveSong = state.songs.some((song) => song.id === item.id);
      if (haveSong) return;
      state.songs.unshift(item);
      localStorage.setItem('songs', JSON.stringify(state.songs));
    },
    // 清空播放列表
    clearSongs(state) {
      state.audio.currentTime = 0;
      state.sliderValue = 0;
      state.musicCurrentTime = '00:00';
      state.isPlay = false;
      state.audio.pause();
      state.songs = [];
      localStorage.setItem('songs', JSON.stringify([]));
    },
    // 重新赋值播放列表
    setSongs(state, songs) {
      state.songs = songs;
      localStorage.setItem('songs', JSON.stringify(songs));
      if (songs.length === 0) {
        this.commit('pauseMusic');
      }
    },
    setAudio(state, audio) {
      state.audio = audio;
    },
    // 初始化当前播放音乐
    initCurrentSong(state) {
      const currentSong = localStorage.getItem('currentSong');
      if (currentSong) {
        state.currentSong = JSON.parse(currentSong);
        state.audio.src = state.currentSong.url;
        state.playId = state.currentSong.id;
        state.audio.addEventListener('loadedmetadata', () => {
          state.musicMaxTime = transTime(state.audio.duration);
        }, false);
      }
    },
    // 设置当前播放音乐
    setCurrentSong(state, item) {
      if (state.audio) {
        state.currentSong = item;
        localStorage.setItem('currentSong', JSON.stringify(item));
        state.audio.src = item.url;
        state.playId = item.id;
        state.audio.addEventListener('loadedmetadata', () => {
          state.musicMaxTime = transTime(state.audio.duration);
        }, false);
      }
    },
    // 设置遮罩 loading
    setOverlay(state, bool) {
      state.overlay = bool;
    },
    setShowSongs(state, bool) {
      state.showSongs = bool;
    },
    // 初始化 audio 事件监听
    initListentener(state) {
      state.audio.addEventListener('timeupdate', () => {
        const {
          currentTime,
          duration,
        } = state.audio;
        const { currentSong } = state;
        if (state.lrcIndex !== currentSong.lrc.length - 1) {
          for (let i = 0; i < currentSong.lrc.length; i += 1) {
            const lrc = currentSong.lrc[i];
            if (
              state.lrcIndex >= currentSong.lrc.length - 2
              && currentTime >= currentSong.lrc[currentSong.lrc.length - 1].time
            ) {
              state.lrcIndex = currentSong.lrc.length - 1;
              break;
            }
            try {
              if (currentTime >= lrc.time && currentTime <= currentSong.lrc[i + 1].time) {
                state.lrcIndex = i;
                break;
              }
            } catch (error) {
              break;
            }
          }
        }
        state.sliderValue = Math.round(
          (Math.floor(currentTime) / Math.floor(duration)) * 100,
          0,
        );
        state.musicCurrentTime = transTime(currentTime);
      }, false);
      state.audio.addEventListener('ended', () => {
        state.audio.currentTime = 0;
        state.sliderValue = 0;
        state.musicCurrentTime = '00:00';
        state.audio.pause();
        if (state.type === 0) {
          this.commit('nextSong');
        } else if (state.type === 1) {
          this.commit('randomSong');
        } else {
          state.audio.play();
        }
      }, false);
    },
    // 播放音乐
    playMusic(state) {
      if (state.audio) {
        state.audio.play();
        state.isPlay = true;
      }
    },
    // 暂停音乐
    pauseMusic(state) {
      if (state.audio) {
        state.audio.pause();
        state.isPlay = false;
      }
    },
    // 设置进度条
    sliderChange(state, value) {
      if (state.audio) {
        state.audio.currentTime = state.audio.duration * (value / 100);
        state.sliderValue = value;
        state.musicCurrentTime = transTime(state.audio.currentTime);
      }
    },
    // 切换下一首
    nextSong(state) {
      if (state.type === 1) {
        this.commit('randomSong');
      } else {
        const { songs, currentSong } = state;
        const currentIndex = songs.findIndex((item) => item.id === currentSong.id);
        const nextSong = songs[currentIndex + 1] || songs[0];
        state.currentSong = nextSong;
        this.commit('setCurrentSong', nextSong);
        state.audio.play();
        state.isPlay = true;
      }
    },
    // 切换上一首
    prevSong(state) {
      if (state.type === 1) {
        this.commit('randomSong');
      } else {
        const { songs, currentSong } = state;
        const currentIndex = songs.findIndex((item) => item.id === currentSong.id);
        const prevSong = songs[currentIndex - 1] || songs[songs.length - 1];
        state.currentSong = prevSong;
        this.commit('setCurrentSong', prevSong);
        state.audio.play();
        state.isPlay = true;
      }
    },
    // 切换播放模式
    changeMode(state) {
      state.type += 1;
      if (state.type > 2) {
        state.type = 0;
      }
    },
    // 随机播放
    randomSong(state) {
      const index = Math.floor((Math.random() * state.songs.length));
      state.currentSong = state.songs[index];
      this.commit('setCurrentSong', state.songs[index]);
      state.audio.play();
      state.isPlay = true;
    },
  },
  actions: {
  },
  modules: {
  },
});
