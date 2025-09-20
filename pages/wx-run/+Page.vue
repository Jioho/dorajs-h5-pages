<template>
  <div class="max-norem">
    <h2 class="page-title">微信运动修改步数</h2>

    <van-field
      v-model="formData.account"
      is-link
      readonly
      name="picker"
      label="选择账号"
      placeholder="点击选择账号"
      @click="showPicker = true"
    />
    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
      <van-picker
        :columns="columns"
        :model-value="[formData.account]"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>

    <template v-if="formData.type === 'password'">
      <van-field
        v-model="formData.user"
        name="user"
        label="用户名"
        placeholder="用户名"
      />
      <van-field
        v-model="formData.password"
        name="password"
        label="密码"
        placeholder="密码"
      />
    </template>

    <div class="footer">
      <van-button block @click="handleSubmit">提交</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showPicker = ref(false);
const columns = [
  { value: "JIOHO", text: "手机号 / 135 / 主号" },
  { value: "EMAIL", text: "邮箱 / 9965/ 小号" },
  { value: "CUSTOM", text: "自定义输入账号" },
];

const formData = ref({
  type: "account", // password
  account: "",
  user: "",
  password: "",
  step: "",
});

const onConfirm = ({ selectedValues, selectedOptions }) => {
  formData.value.account = selectedValues[0];
  if (formData.value.account === "CUSTOM") {
    formData.value.type = "password";
  } else {
    formData.value.type = "account";
  }
  showPicker.value = false;
};

const handleSubmit = () => {
  $dora.sendEvent("changeStep", formData.value);
};
</script>

<style scoped lang="less">
.max-norem {
  // prettier-ignore
  max-width: 580PX;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  padding: 20px 0;
  font-size: 20px;
  font-weight: bold;
}

.footer {
  padding: 20px 0;
}
</style>
