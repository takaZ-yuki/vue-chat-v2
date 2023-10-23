<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-from">
        <v-card-title class="login-title">SignUp</v-card-title>
        <v-card-subtitle>ユーザー情報を入力してください</v-card-subtitle>
        <v-btn text color="light-blue" to="login">ログイン画面はこちら</v-btn>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="name" :rules="nameRules" :counter="10" label="UserName" required></v-text-field>

          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

          <v-text-field :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" v-model="password"
            :type="show ? 'text' : 'password'" label="Password" required @click:append="show = !show"></v-text-field>

          <v-btn color="success" class="login-btn" :disabled="isValid" @click="submit">
            SIGNUP
          </v-btn>
          <v-btn>
            CLEAR
          </v-btn>
          <v-alert class="error-message" dense outlined type="error" v-if="errorMessage">
            {{ this.errorMessage }}
          </v-alert>
        </v-form>
      </v-card>
    </div>
  </v-app>
</template>
    
<style>
.login-from {
  margin: 150px;
  padding: 30px;
}

.login-box {
  width: 50%;
  margin: 0px auto;
  padding: 30px;
}

.login-title {
  display: inline-block;
}

.login-btn {
  margin-right: 20px;
}

.error-message {
  margin-top: 20px;
}
</style>
    
<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Firebase from "@/firebase/firebase";
const auth = Firebase.auth;

export default {
  data: () => ({
    show: false,
    valid: false,
    name: '',
    nameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 10) || '名前は10文字以内で入力してください',
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
    ],
    password: '',
    errorMessage: "",
  }),
  computed: {
    isValid() {
      return !this.valid;
    }
  },
  methods: {
    submit() {
      console.log("submit call");
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(async (userCredential) => {
          // ユーザー新規登録成功
          console.log("success", userCredential)
          await updateProfile(userCredential.user, { displayName: this.name });
          console.log("updateProfile", userCredential)

          localStorage.message = "新規作成に成功しました"

          // TOPにリダイレクト
          this.$router.push('/login')
        })
        .catch((error) => {
          // ユーザー新規登録失敗
          console.log("fail", error);
          // エラーメッセージを表示
          this.errorMessage = "ユーザーの新規作成に失敗しました";
        });
    },
  },
}
</script>