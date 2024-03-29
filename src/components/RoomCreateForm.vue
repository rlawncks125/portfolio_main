<template>
  <div class="foodChat-form">
    <loding :isLoding="isLoading" />

    <div
      class="foodChat-form-main"
      style="height: calc(var(--mobile--full) - 2vh)"
    >
      <button class="float-right mb-2" @click.prevent="onClose">X</button>

      <div ref="mapRef" class="w-full h-96 mx-auto"></div>

      <div class="pt-4 flex flex-col items-center">
        <div class="flex justify-between items-center">
          <label>방 이름 :</label>
          <input class="flex-1 w-1/2" type="text" v-model="roomName" />
        </div>
        <div class="mt-4 text-center">
          <p class="w-60 mx-auto">마크 이미지</p>
          <input-file
            ref="inputFileComponet"
            :isStyleRounded="true"
            class="w-60 h-60 bg-transparent"
            @cahngeFile="(data) => (imageFile = data)"
          />
        </div>
        <button @click.prevent="onCreateRoom">방 만들기</button>
        <div>방 생성시 기본값이 되는 좌표를 마커로 표시해주세요</div>

        <div class="flex justify-between w-full items-center">
          <label>도로명 주소 :</label>
          <input class="flex-1 w-0" type="text" v-model="addr" />
          <button class="p-1" @click.prevent="serachAddr">찾기</button>
        </div>
        <div class="w-full text-left">
          <template v-for="(addr, index) in findAddrs" :key="index">
            <div class="cursor-pointer border mt-1">
              <p @click="onMoveMarkerAddress(+addr.x, +addr.y)">
                {{ addr.roadAddress }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRaw,
  toRefs,
  watch,
} from "vue";
import InputFile, {
  FileDataType,
} from "@/components/common/Input/File-one.vue";

import Loding from "@/components/Loding.vue";
import { createRoom } from "@/api/Room";
import { getImageURLByFormData } from "@/api/file";
import { CustomNaverMaps, naverMapsFindAddress } from "@/lib/naverMaps";

export default defineComponent({
  emits: ["onCreated", "onClose"],
  components: { InputFile, Loding },
  setup(props, { emit }) {
    let naverMaps: CustomNaverMaps;
    let marker: naver.maps.Marker;

    const mapRef = ref();
    const roomName = ref("");
    const addr = ref();
    const findData = reactive({
      findAddrs: [] as naver.maps.Service.AddressItemV2[] | null,
    });

    const isLoading = ref(false);

    // 이미지 처리 관련
    const inputFileComponet = ref<InstanceType<typeof InputFile>>();
    const imageFile = ref<FileDataType>();

    const onCreateRoom = async () => {
      let markeImageUrl = "";

      isLoading.value = true;
      // 이미지 url 작업
      if (imageFile.value?.type === "image") {
        const postForm = new FormData();
        postForm.append("file", imageFile.value.file, imageFile.value.fileName);

        // markeImageUrl = await axios
        //   .post("/api/file", postForm, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   })
        //   .then((res) => res.data.url);
        markeImageUrl = await getImageURLByFormData(postForm);
      }

      console.log(marker.getPosition());
      const { ok, room } = await createRoom({
        roomName: roomName.value,
        lating: marker.getPosition(),
        markeImageUrl,
      });

      if (ok) {
        inputFileComponet.value?.resetFile();
        emit("onCreated", {
          ok,
          room,
        });
      }

      isLoading.value = false;
    };

    const onClose = () => {
      inputFileComponet.value?.resetFile();
      emit("onClose");
    };

    const serachAddr = async () => {
      if (!addr.value) return;

      findData.findAddrs = await naverMapsFindAddress(addr.value);
    };

    const onMoveMarkerAddress = (x: number, y: number) => {
      if (marker) {
        marker.onRemove();
      }

      naverMaps.mapCenterZoom({ x, y }, { number: 15, effect: true });
      marker = naverMaps.renderMarker({ x, y } as naver.maps.LatLng);
    };

    onMounted(() => {
      naverMaps = new CustomNaverMaps(
        mapRef,
        // new naver.maps.LatLng(37.4592758, 126.6838396)
        new naver.maps.LatLng(126.6838396, 37.4592758)
      );

      naver.maps.Event.addListener(naverMaps.map, "click", (e) => {
        if (marker) {
          marker.onRemove();
        }

        marker = naverMaps.renderMarker(e.coord);
      });
    });

    return {
      isLoading,
      inputFileComponet,
      imageFile,
      serachAddr,
      addr,
      onMoveMarkerAddress,
      ...toRefs(findData),
      onCreateRoom,
      onClose,
      roomName,
      mapRef,
    };
  },
});
</script>

<style></style>
