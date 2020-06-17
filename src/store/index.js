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
  },
  mutations: {
    setIsPlay(state, status) {
      state.isPlay = status;
    },
    setShowPlay(state, status) {
      state.showPlay = status;
    },
    initSongs(state) {
      const songs = localStorage.getItem('songs');
      if (songs) {
        state.songs = JSON.parse(songs);
      }
    },
    pushSong(state, item) {
      const haveSong = state.songs.some((song) => song.id === item.id);
      if (haveSong) return;
      state.songs.unshift(item);
      localStorage.setItem('songs', JSON.stringify(state.songs));
    },
    clearSongs(state) {
      state.audio.currentTime = 0;
      state.sliderValue = 0;
      state.musicCurrentTime = '00:00';
      state.isPlay = false;
      state.audio.pause();
      state.songs = [];
    },
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
    setOverlay(state, bool) {
      state.overlay = bool;
    },
    setShowSongs(state, bool) {
      state.showSongs = bool;
    },
    playMusic(state) {
      if (state.audio) {
        state.audio.addEventListener('timeupdate', () => {
          const { currentTime, duration } = state.audio;
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
          state.isPlay = false;
          state.audio.pause();
        }, false);
        state.audio.play();
        state.isPlay = true;
      }
    },
    pauseMusic(state) {
      if (state.audio) {
        state.audio.pause();
        state.isPlay = false;
      }
    },
    sliderChange(state, value) {
      if (state.audio) {
        state.audio.currentTime = state.audio.duration * (value / 100);
        state.sliderValue = value;
        state.musicCurrentTime = transTime(state.audio.currentTime);
      }
    },
  },
  actions: {
  },
  modules: {
  },
});
