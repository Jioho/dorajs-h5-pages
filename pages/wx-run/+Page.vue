<template>
  <div>
    <div>微信运动修改步数</div>

    <input type="text" v-model="formData.phone" />
    <input type="text" v-model="formData.password" />
    <input type="text" v-model="formData.step" />

    <div>
      <button @click="handleSubmit">提交</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const formData = ref({
  phone: "",
  password: "",
  step: "",
});

const handleSubmit = () => {
  $dora.sendEvent("change-step", formData.value);
};
</script>

<style scoped lang="less"></style>
