<template>
  <label
    class="checkd-label w-12 h-12 bg-center bg-cover cursor-pointer justify-self-start sm:hidden"
    for="checkd-menu"
  >
    <!-- cheked icon -->
    <div class="w-full h-full flex flex-col justify-center dark:text-white">
      <fa-icon
        v-if="isCehckd"
        class="w-full h-full"
        :icon="['fa', 'xmark']"
        :size="'2x'"
      />
      <fa-icon
        v-else
        class="w-full h-4/6"
        :icon="['fa', 'align-justify']"
        :size="'2x'"
      />
    </div>
  </label>

  <input
    id="checkd-menu"
    class="out-checkd"
    type="checkbox"
    v-model="isCehckd"
  />
  <div id="nav" :class="{ 'sm:pl-20 ': route.path.includes('foodChat') }">
    <div class="nav-home" @click="changePage">
      <router-link to="/">
        <img class="object-contain" src="@/assets/images/HOME.png" alt="" />
        <span class="web-acc-hidden">Home</span>
      </router-link>
    </div>
    <div
      class="nav-wrap text-three-dot bg-slate-100 sm:items-center sm:bg-transparent sm:dark:bg-transparent dark:bg-blue-800 dark:text-white"
      @click="changePage"
    >
      <router-link
        to="/foodChat"
        :class="{ '!text-green-400': route.path.includes('foodChat') }"
        >음식 채팅방</router-link
      >
      <router-link to="/SubWay">지하철 도착 시간</router-link>
      <router-link to="/">준비중</router-link>
      <router-link to="/">준비중</router-link>
      <div class="py-4 cursor-pointer" @click="changeDarkmode">
        <fa-icon v-if="isDarkMode" :icon="['fa', 'sun']" />
        <fa-icon v-else :icon="['fa', 'moon']" />
      </div>
    </div>
  </div>

  <div
    class="render-view mb-12 border-t-2 border-black border-opacity-50 dark:bg-blue-900 dark:text-white"
    :class="{ 'sm:pl-20': route.path.includes('foodChat') }"
  >
    <router-view />
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useStore } from "./store";

export default defineComponent({
  components: {},
  setup() {
    const store = useStore();
    const isDarkMode = ref(false);
    const isCehckd = ref();

    const route = useRoute();

    const changePage = () => {
      isCehckd.value = false;
    };

    const mobileHeightSize = () => {
      const dh = window.innerHeight;
      isCehckd.value = false;

      document.documentElement.style.setProperty("--mobile--full", `${dh}px`);
    };

    watch(isCehckd, () => {
      // 토글 버튼 활성화시 scroll 방지
      isCehckd.value
        ? (document.documentElement.style.overflow = "hidden")
        : (document.documentElement.style.overflow = "auto");
    });

    const changeDarkmode = () => {
      document.documentElement.classList.toggle("dark");
      isDarkMode.value =
        document.documentElement.classList.value.includes("dark");
    };

    const setDarkmode = () => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
        isDarkMode.value = true;
      } else {
        document.documentElement.classList.remove("dark");
        isDarkMode.value = false;
      }
    };

    onMounted(async () => {
      window.addEventListener("load", mobileHeightSize);
      window.addEventListener("resize", mobileHeightSize);

      await axios.get("/api").then((res) => console.log(res.data));

      // 다크모드 감지
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", setDarkmode);
    });

    watch(
      () => route.path,
      () => {
        if (route.path.includes("foodChat")) {
          document.documentElement.style.setProperty(
            "--body-color",
            "rgb(96, 165, 250)"
          );
        } else {
          document.documentElement.style.setProperty("--body-color", "white");
        }
      }
    );

    return {
      isCehckd,
      changePage,
      route,
      changeDarkmode,
      isDarkMode,
    };
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300&family=Song+Myung&display=swap");

$max-width: 1280px;
$checkd-width: 50px;
$checkd-height: 4.5rem;

:root {
  --shadow-fill-food-bottom: drop-shadow(0px -1px rgb(0 0 0 / 0.1))
    drop-shadow(0px -2px rgb(0 0 0 / 0.06));
}
:root.dark {
  --shadow-fill-food-bottom: drop-shadow(0px -1px rgb(255 255 255 / 0.1))
    drop-shadow(0px -2px rgb(255 255 255 / 0.2));
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  @include mobile() {
    font-size: 12px;
  }

  @include tablet() {
    font-size: 13px;
  }
  @include laptop() {
    font-size: 13px;
  }
  @include desktop() {
    font-size: 13px;
  }
}

body {
  background-color: var(--body-color);
}

#app {
  font-family: "IBM Plex Sans KR", sans-serif;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 30px;
  color: #2c3e50;

  display: grid;
  margin: 0;
  margin-top: 0;

  grid-template:
    "nav nav nav nav" 4rem
    "render-view render-view render-view render-view" minmax(
      calc(var(--mobile--full) - 5rem),
      auto
    )
    / 1fr 1fr 1fr 1fr;
  justify-items: center;

  @include mobile() {
    grid-template:
      "out-checkd nav nav" 4.5rem
      "render-view render-view render-view" minmax(
        calc(var(--mobile--full) - 5rem),
        auto
      )
      / 1fr 1fr 1fr 1fr;
    justify-items: center;
  }
  @include tablet() {
    grid-template:
      "nav nav nav nav" 4rem
      "render-view render-view render-view render-view" minmax(
        calc(var(--mobile--full) - 5rem),
        auto
      )
      / 1fr 1fr 1fr 1fr;
    justify-items: center;
  }
}

a:-webkit-any-link {
  text-decoration: none;
}

#nav {
  grid-area: nav;
  width: 100%;
  max-width: $max-width;
  text-align: center;
  // position: relative;

  // background-color: $color-blue-2;

  .nav-home {
    height: 100%;

    img {
      height: 100%;
    }
  }

  .nav-wrap {
    a {
      border: 1px solid black;
      height: 100%;
      font-weight: bold;
      padding: 0.3rem;
    }
    a.router-link-exact-active {
      color: #42b983;
    }
  }

  @include mobile() {
    .nav-home {
      width: 100%;
      max-width: 14rem;
      margin: 0 auto;
    }
    .nav-wrap {
      display: flex;
      position: fixed;
      top: $checkd-height;
      left: 0;
      right: 0;

      flex-direction: column;
      flex-wrap: wrap;
      z-index: 1000;

      transform: translateX(-1000px);
      transition: transform 0.2s ease-in-out;

      a {
        padding: 2rem 0;
      }
    }
  }

  @mixin mobile-high-setup() {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .nav-home {
      width: 14rem;
      padding: 0 1rem;
    }
    .nav-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
  }
  @include tablet() {
    @include mobile-high-setup();
  }
  @include laptop() {
    @include mobile-high-setup();
  }
  @include desktop() {
    @include mobile-high-setup();
  }
}

.out-checkd,
.checkd-label {
  grid-area: out-checkd;
  display: block;
  align-self: center;

  z-index: 100;
}

.out-checkd {
  width: 0;
  height: 0;

  &:checked ~ #nav {
    .nav-wrap {
      transform: translateX(0px);
    }
  }

  &:checked {
    &::after {
      display: block;
      content: " ";
      position: fixed;
      margin-top: $checkd-height;
      width: 100vw;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0.5;
      background-color: black;
    }
  }
}

.render-view {
  grid-area: render-view;
  // grid 마지막 col에 하나가 더껴있어서 거기까지 index지정으로 늘림
  grid-column-end: 7;
  width: 100%;

  // max-width: $max-width;
}

.web-acc-hidden {
  display: inline-block;
  width: 0px;
  height: 0px;
  overflow: hidden;
}
</style>
