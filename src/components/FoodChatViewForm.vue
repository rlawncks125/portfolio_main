<template>
  <div class="foodChat-form">
    <div
      class="foodChat-form-main !pt-0 !overflow-x-hidden"
      style="height: calc(var(--mobile--full) - 2vh)"
    >
      <div
        class="form-full sticky py-3 px-5 left-0 top-0 mx-auto flex justify-between bg-white items-center shadow-lg dark:bg-blue-900"
        style="z-index: 103"
      >
        <button
          class="none-btn text-4xl font-bold dark:text-white"
          @click.prevent="onClose"
        >
          &lt;
        </button>
        <p class="w-auto flex-1 text-center text-2xl text-three-dot">
          {{ viewData.restaurantName }}
        </p>
        <div v-if="isSuperUser" class="w-[7rem] md:w-[9rem] text-right">
          <button @click.prevent="onDeleteRestaurnt">삭제 버튼</button>
        </div>
      </div>
      <!-- <button class="hidden sm:block absolute top-2 right-2" @click.prevent="onClose">
        X
      </button> -->

      <!-- <p>접속유저 : {{ store.state.userName }}</p> -->
      <div class="form-full h-80 sm:h-96">
        <img
          class="object-cover object-center w-full h-full"
          :src="restaurantImageUrl"
        />
      </div>

      <div class="flex items-center mt-4 mb-8 gap-2">
        <span class="text-3xl">평균 별점 </span>
        <star-fill :starNum="5" :starSize="2" :fill="viewData.avgStar" />
      </div>
      <div class="flex flex-wrap items-center gap-2 pb-4 mb-4">
        <span> 전문 분야 </span>
        <template v-for="special in viewData.specialization" :key="special.id">
          <p class="text-gray-500 bg-yellow-400 rounded-full py-1 px-3">
            {{ special }}
          </p>
        </template>
      </div>

      <div
        v-if="viewData.hashTags && viewData.hashTags.length > 0"
        class="flex flex-wrap items-center gap-2 pb-4 mb-4"
      >
        <span> 태그 </span>
        <template v-for="tag in viewData.hashTags" :key="tag.id">
          <p class="px-1 text-indigo-100 bg-cyan-500 rounded-full">
            {{ tag }}
          </p>
        </template>
      </div>

      <!-- 댓글 -->
      <form>
        <fieldset
          class="border-2 p-2 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-left ml-4">후기 리뷰</legend>
          <p v-if="viewData.comments && viewData.comments.length === 0">
            리뷰가 없습니다.
          </p>

          <div class="text-left w-full">
            <div
              class="px-4 mb-4"
              v-for="comment in viewData.comments"
              :key="comment.id"
            >
              <div class="flex justify-between whitespace-pre mb-2">
                <span> {{ comment.message.userInfo.nickName }} : </span>
                <p
                  class="cursor-pointer text-left flex-initial w-full"
                  @click.prevent="setcommentId(comment.id)"
                >
                  {{ comment.message.message }}
                </p>
                <div
                  v-show="
                    store.state.userName === comment.message.userInfo.nickName
                  "
                >
                  <button
                    class="blue-btn"
                    @click.prevent="setEditCommentId(comment.id)"
                  >
                    수정
                  </button>
                  <button
                    class="red-btn"
                    @click.prevent="onDeleteComment(comment.id)"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div
                v-show="editActiveMessage === comment.id"
                class="border my-[1rem] p-1"
              >
                <label for="message-chnage" class="block text-blue-500"
                  >댓글 수정:</label
                >
                <div class="flex items-center">
                  <input
                    v-enter-next-focus
                    id="message-chnag"
                    type="text"
                    v-model="editMessage"
                    class="w-0 flex-1"
                  />
                  <button
                    @click.prevent="onEditCommentId(comment.id)"
                    class="h-full"
                  >
                    댓글 수정
                  </button>
                </div>
              </div>
              <div
                v-show="activeMessage === comment.id"
                class="border my-2 p-1"
              >
                <label for="message-add" class="block text-green-600"
                  >추가 댓글 달기 :</label
                >
                <div class="flex items-center">
                  <input
                    v-enter-next-focus
                    id="message-add"
                    type="text"
                    v-model="childMessage"
                    class="w-0 flex-1"
                  />
                  <button
                    @click.prevent="onAddCommentByCommentId(comment.id)"
                    class="h-full"
                  >
                    대댓글 추가
                  </button>
                </div>
              </div>
              <!-- 대댓글 -->
              <div
                class="ml-6 pl-4 flex flex-col border-2 border-t-0 gap-1"
                v-for="(childMessages, index) in comment.childMessages"
                :key="index"
                :class="index === 0 ? '!border-t-2' : ''"
              >
                <div class="whitespace-pre-wrap">
                  <div class="flex flex-wrap justify-between -translate-x-2">
                    <div>
                      <span class="translate-y-4">└ </span>
                      <span>
                        {{ childMessages.userInfo.nickName }}[{{
                          childMessages.userInfo.role
                        }}]
                      </span>
                      <span class="text-gray-500">
                        {{ getDateData(childMessages.CreateTime) }}
                      </span>
                    </div>
                    <button
                      class="flex-none blue-btn"
                      v-show="
                        store.state.userName === childMessages.userInfo.nickName
                      "
                      @click.prevent="
                        setChildCommentCreateTime(childMessages.CreateTime + '')
                      "
                    >
                      수정
                    </button>
                  </div>
                  <p>
                    {{ childMessages.message }}
                  </p>
                </div>
                <div
                  class="border my-2 p-1"
                  v-show="
                    editActiveChildMessage === childMessages.CreateTime + ''
                  "
                >
                  <label class="block text-blue-500" for="edit-child-message"
                    >수정할 내용</label
                  >
                  <div class="flex items-center">
                    <input
                      v-enter-next-focus
                      type="text"
                      id="edit-child-message"
                      v-model="editChildMessage"
                      class="w-0 flex-1"
                    />
                    <button
                      class="flex-none h-full"
                      @click.prevent="
                        onEditChildComment(
                          comment.id,
                          childMessages.CreateTime + ''
                        )
                      "
                    >
                      수정
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      <!-- 댓글 달기 -->
      <div class="mt-4 flex flex-col text-left pb-14">
        <star-touch-event
          :starNum="5"
          :starSize="2"
          :fill="star"
          @clickStar="
            (starValue) => {
              star = starValue;
            }
          "
        />
        <label for="">추가 댓글 달기 :</label>
        <textarea
          class="border border-black min-h-[7rem] resize-none mb-2 mx-2"
          v-model="message"
        />
        <button @click.prevent="onAddCommentRestaurantById">댓글 추가</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  EnumAddMessageByCommentIdInPutDtoRole,
  EnumAddRestaurantCommentByIdIdInputDtoRole,
  RestaurantInfoDto,
} from "@/assets/swagger";
import StarFill from "@/components/common/StarFill.vue";
import StarTouchEvent from "@/components/common/StarTouchEvent.vue";
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "@/store/index";
import {
  addMessageByCommentId,
  addRestaurantCommentById,
  deleteComment,
  editCommentChildMessage,
  editCommentMessage,
} from "@/api/Restaurant";

export default defineComponent({
  props: {
    isRoomSuperUser: Boolean,
  },
  emits: ["closeViewForm", "DeleteRestrunt", "UpdateRestaurantById"],
  components: { StarFill, StarTouchEvent },
  setup(props, { emit }) {
    const store = useStore();
    const isSuperUser = ref(false);

    const activeMessage = ref<number | null>();
    const editActiveMessage = ref<number | null>();
    const editActiveChildMessage = ref<string | null>();

    const restaurantImageUrl = ref(
      "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg"
    );

    const viewData = computed(() => store.getters["pickRestaurantInfo"]());

    const addFormData = reactive({
      message: "",
      childMessage: "",
      editChildMessage: "",
      editMessage: "",
      star: 5,
    });

    const setcommentId = (id: number) => {
      if (activeMessage.value === id) {
        activeMessage.value = null;
        return;
      }

      activeMessage.value = id;
      addFormData.childMessage = "";

      // console.log(activeMessage.value);
    };

    const setChildCommentCreateTime = (createTime: string) => {
      if (editActiveChildMessage.value === createTime) {
        editActiveChildMessage.value = null;
        return;
      }

      editActiveChildMessage.value = createTime;
      addFormData.childMessage = "";
      // console.log(editActiveChildMessage.value);
    };

    const setEditCommentId = (id: number) => {
      if (editActiveMessage.value === id) {
        editActiveMessage.value = null;
        return;
      }

      editActiveMessage.value = id;
      addFormData.editMessage = " ";
    };

    const getDateData = (date: Date) => {
      let outPutTime = "오류";
      if (date) {
        // 데이터 가 어떻게 받아올지 모르겠지만
        // 2021-12-20T17:14:34.508Z 형식일경우
        const paseDate = new Date(date);
        const nt = new Date();

        // outPutTime = paseDate.toLocaleString();
        const year = nt.getFullYear() - paseDate.getFullYear();
        const month = nt.getMonth() - paseDate.getMonth();
        const day = nt.getDate() - paseDate.getDate();
        const hours = nt.getHours() - paseDate.getHours();
        const min = nt.getMinutes() - paseDate.getMinutes();

        if (paseDate.getFullYear() !== nt.getFullYear()) {
          outPutTime = `${year * 12 + month}달 전`;
        } else if (paseDate.getMonth() !== nt.getMonth()) {
          month > 1
            ? (outPutTime = `${month}달 전`)
            : (outPutTime = `${month * 30 + day}일 전`);
        } else if (paseDate.getDate() != nt.getDate()) {
          day > 1
            ? (outPutTime = `${day}일 전`)
            : (outPutTime = `${day * 24 + hours}시간 전`);
        } else if (paseDate.getHours() != nt.getHours()) {
          hours > 1
            ? (outPutTime = `${hours}시간 전`)
            : (outPutTime = `${hours * 60 + min}분 전`);
        } else if (paseDate.getMinutes() != nt.getMinutes()) {
          outPutTime = `${min}분 전`;
        } else {
          outPutTime = "방금 전";
        }
      }

      return outPutTime;
    };

    const setOpenViewData = (restaurnt: RestaurantInfoDto) => {
      if (!restaurnt) return;
      store.commit("setRestaurantInfo", { restaurnt });
      // viewData.value.value = data;

      if (
        viewData.value.restaurantImageUrl !== null &&
        typeof viewData.value.restaurantImageUrl === "string" &&
        (viewData.value.restaurantImageUrl as string).length > 10
      ) {
        restaurantImageUrl.value = viewData.value.restaurantImageUrl;
      } else {
        restaurantImageUrl.value =
          "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg";
      }

      if (viewData.value.resturantSuperUser.nickName === store.state.userName) {
        isSuperUser.value = true;
      } else if (props.isRoomSuperUser) {
        isSuperUser.value = true;
      } else {
        isSuperUser.value = false;
      }
      // console.log(viewData.value.value);
    };

    const onClose = () => {
      resetFormData();
      emit("closeViewForm");
    };

    const onDeleteRestaurnt = () => {
      emit("DeleteRestrunt", viewData.value!.id);
    };

    const onAddCommentRestaurantById = async () => {
      const { id } = viewData.value!;

      const { ok, err } = await addRestaurantCommentById({
        restaurantId: id,
        role: EnumAddRestaurantCommentByIdIdInputDtoRole.User,
        message: addFormData.message,
        star: addFormData.star,
      });
      if (ok) {
        addFormData.message = "";
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onAddCommentByCommentId = async (id: number) => {
      const { ok, err } = await addMessageByCommentId({
        commentId: id,
        role: EnumAddMessageByCommentIdInPutDtoRole.Anonymous,
        message: addFormData.childMessage,
      });

      if (ok) {
        activeMessage.value = null;
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onEditCommentId = async (id: number) => {
      const { ok, err } = await editCommentMessage({
        id,
        message: addFormData.editMessage,
      });

      if (ok) {
        editActiveMessage.value = null;
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onEditChildComment = async (
      commentId: number,
      childCreateTime: string
    ) => {
      // console.log(commentId, childCreateTime, addFormData.editChildMessage);
      // console.log(new Date(childCreateTime));
      const { ok, err } = await editCommentChildMessage({
        id: commentId,
        createTime: new Date(childCreateTime),
        message: addFormData.editChildMessage,
      });

      if (ok) {
        editActiveChildMessage.value = null;
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onDeleteComment = async (id: number) => {
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        const { ok, err } = await deleteComment(id);
        if (ok) {
          updateRestaurant();
        } else {
          console.log(err);
        }
      }
    };

    const updateRestaurant = () => {
      emit("UpdateRestaurantById", viewData.value!.id);
      resetFormData();
    };

    const resetFormData = () => {
      addFormData.message = "";
      addFormData.childMessage = "";
      addFormData.editChildMessage = "";
      addFormData.editMessage = "";
      addFormData.star = 5;
    };

    return {
      viewData,
      setOpenViewData,
      store,
      isSuperUser,
      getDateData,
      restaurantImageUrl,
      onClose,
      onDeleteRestaurnt,
      onAddCommentRestaurantById,
      ...toRefs(addFormData),
      setcommentId,
      onAddCommentByCommentId,
      onEditChildComment,
      activeMessage,
      onDeleteComment,
      editActiveChildMessage,
      setChildCommentCreateTime,
      onEditCommentId,
      editActiveMessage,
      setEditCommentId,
    };
  },
});
</script>

<style lang="scss"></style>
