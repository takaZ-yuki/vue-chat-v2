<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-from">
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle>ユーザー情報を入力してください</v-card-subtitle>
        <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

          <v-text-field :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" v-model="password"
            :type="show ? 'text' : 'password'" label="Password" required @click:append="show = !show"></v-text-field>

          <v-btn color="success" class="login-btn" :disabled="isValid" @click="submit">
            LOGIN
          </v-btn>
          <v-btn>
            CLEAR
          </v-btn>
          <v-alert class="success-message" dense outlined type="success" v-if="message">
            {{ this.message }}
          </v-alert>
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

.success-message {
  margin-top: 20px;
}

.error-message {
  margin-top: 20px;
}
</style>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import Firebase from "@/firebase/firebase"
const auth = Firebase.auth;

export default {
  data: () => ({
    show: false,
    valid: false,
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
    ],
    password: '',
    message: "",
    errorMessage: "",
  }),
  mounted() {
    if (localStorage.message) {
      this.message = localStorage.message;
      localStorage.message = '';
    }
  },
  computed: {
    isValid() {
      return !this.valid;
    }
  },
  methods: {
    submit() {
      console.log("submit call");
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // ログインに成功
          console.log("success", userCredential);
          console.log("user", userCredential.user);

          // ブラウザのセッションにユーザー情報を確保
          const userData = {
            displayName: userCredential.user.displayName,
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            refreshToken: userCredential.user.refreshToken,
            photoURL: userCredential.user.photoURL,
          }
          sessionStorage.setItem('user', JSON.stringify(userData))

          this.$router.push('/');
        })
        .catch((error) => {
          // ログインに失敗
          console.log("fail", error);
          // エラーメッセージを表示
          this.errorMessage = "ログインに失敗しました";
        });
    }
  },
}
</script>
