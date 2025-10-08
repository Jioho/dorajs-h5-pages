<template>
  <div class="max-norem">
    <h2 class="page-title">微信运动修改步数</h2>

    <div style="display: flex; align-items: center">
      <van-field
        v-model="formData.account"
        is-link
        readonly
        name="picker"
        label="选择账号"
        placeholder="点击选择账号"
        @click="showPicker = true"
        style="flex: 1; width: 0"
      >
      </van-field>
      <van-button
        v-if="formData.account !== 'CUSTOM'"
        size="small"
        @click.stop="handleEditAccount"
        >账号管理</van-button
      >
    </div>

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

    <van-field
      v-model="formData.step"
      name="step"
      label="步数"
      placeholder="步数"
    />

    <div class="footer">
      <van-button type="primary" block @click="handleSubmit">提交</van-button>
    </div>

    <!-- 底部弹出 -->
    <van-popup
      v-model:show="showAccountInfo"
      position="bottom"
      :style="{ height: '90%' }"
    >
      <div class="popup-wrap">
        <h2 class="page-title">账号管理</h2>
        <div class="account">{{ formData.account }}</div>

        <van-field
          v-for="item in accountInfo"
          v-model="item.value"
          :name="item.key"
          :label="item.key"
          placeholder="请输入"
          type="textarea"
          clearable
        />

        <div class="footer">
          <van-button block @click="handleSaveAccount">提交</van-button>
        </div>

        <h2 class="page-title">动态解析</h2>
        <van-field
          v-model="appendInfo.key"
          name="key"
          label="key"
          placeholder="key"
        />
        <van-field
          v-model="appendInfo.value"
          name="value"
          label="value"
          placeholder="value"
        />

        <div class="footer">
          <van-button block @click="handleAppendInfo">追加</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";

const showPicker = ref(false);
const columns = ref([{ value: "CUSTOM", text: "自定义输入账号" }]);

const accountInfo = ref([]);
const appendInfo = ref({
  key: "",
  value: "",
});
const showAccountInfo = ref(false);

const formData = ref({
  type: "password", // password
  account: "CUSTOM",
  user: "",
  password: "",
  step: 100,
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
  try {
    $dora.sendEvent("changeStep", formData.value);
  } catch (error) {
    console.log(error);
  }
};

const handleEditAccount = () => {
  accountInfo.value = [];
  appendInfo.value = {
    key: "",
    value: "",
  };
  showAccountInfo.value = true;
  try {
    $dora.sendEvent("getAccountInfo", formData.value.account);
  } catch (error) {
    console.log(error);
  }
};

const handleSaveAccount = () => {
  showConfirmDialog({
    title: "二次确认",
    message: "是否确认保存该账号信息，保存后无法恢复",
  }).then(() => {
    // on confirm
    const info = {};
    accountInfo.value.forEach((item) => {
      info[item.key] = item.value;
    });

    console.log("info", info);
    try {
      $dora.sendEvent("saveAccountInfo", {
        account: formData.value.account,
        info,
      });
    } catch (error) {
      console.log(error);
    }

    showAccountInfo.value = false;
    accountInfo.value = [];
    appendInfo.value = {
      key: "",
      value: "",
    };
  });
};

const handleAppendInfo = () => {
  if (!appendInfo.value.key || !appendInfo.value.value) {
    showToast("请输入完整的key和value");
    return;
  }
  const index = accountInfo.value.findIndex(
    (item) => item.key === appendInfo.value.key
  );
  if (index !== -1) {
    accountInfo.value[index].value = appendInfo.value.value;
  } else {
    accountInfo.value.push(appendInfo.value);
  }
};

onBeforeMount(() => {
  window.wxRun = {
    setAccount(values) {
      columns.value.push(...values);
    },
    setAccountInfo(info) {
      if (info) {
        // const info = JSON.parse(infoSrt);
        accountInfo.value = Object.keys(info).map((key) => ({
          key: key,
          value: info[key],
        }));
      } else {
        accountInfo.value = [];
      }
    },
  };
});
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

.popup-wrap {
  padding: 0 20px;
  height: 100%;
  overflow-y: auto;

  .account {
    font-size: 12px;
    color: #666;
    margin-bottom: 20px;
  }
}
</style>
