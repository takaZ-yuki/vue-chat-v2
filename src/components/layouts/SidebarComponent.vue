<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-sheet color="grey lighten-4" class="pa-4">
      <v-avatar color="indigo">
        <input type="file" ref="fileInput" style="display: none" accept="image/jpeg, image/jpg, image/ping"
          @change="updateIcon">
        <v-icon dark @click="changeIcon" v-if="!photoUrl">
          mdi-account-circle
        </v-icon>
        <img :src="photoUrl" alt="" @click="changeIcon" v-if="photoUrl">
      </v-avatar>

      <div class="username">{{ user && user.displayName }}</div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="[icon, text, to] in links" :key="icon" :to="to" link>
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title><strong>Logout</strong></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss">
.grey.darken-1 {
  background-color: #757575 !important;
  border-color: #757575 !important;
}

.pa-4 {
  padding: 16px !important;
}

.username {
  padding-top: 10px;
}
</style>


<script>
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Firebase from "@/firebase/firebase";
const auth = Firebase.auth;
const storage = Firebase.storage;

export default {
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.photoUrl = this.user.photoURL;
  },

  data: () => ({
    cards: ['Today', 'Yesterday'],
    drawer: null,
    links: [
      ['mdi-inbox-arrow-down', 'Inbox', '/'],
      ['mdi-send', 'Send', '/about'],
      ['mdi-delete', 'Trash', '/about'],
      ['mdi-alert-octagon', 'Spam', '/about'],
    ],
    user: null,
    photoUrl: "",
  }),
  methods: {
    logout() {
      console.log("call Logout");
      signOut(auth).then(() => {
        // Sign-out successful.
        localStorage.message = "ログアウトに成功しました";
        this.$router.push('login');
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });
    },
    changeIcon() {
      this.$refs.fileInput.click()
    },
    updateIcon() {
      console.log("updateIcon call");
      // ログイン状態を確認
      let user = this.getAuth()
      if (!user) {
        sessionStorage.removeItem('user');
        this.$router.push('/login');
      }

      // 画像をCloud Storageへアップロード
      const file = this.$refs.fileInput.files[0];
      const filePath = `/user/${file.name}`;
      console.log(filePath);
      const storageRef = ref(storage, filePath);
      uploadBytes(storageRef, file).then(async (snapshot) => {
        // ダウンロードURLを取得
        const photoUrl = await getDownloadURL(snapshot.ref).then((downloadURL) => {
          return downloadURL
        });
        console.log(photoUrl);

        // ユーザーの画像を更新する
        user = this.getAuth()
        if (user) { 
          await updateProfile(auth.currentUser, { photoURL: photoUrl });
        }

        // セッションのユーザー情報を更新
        this.user.photoURL = photoUrl;
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.photoUrl = photoUrl;

      }).catch((error) => {
        console.log('Uploaded a blob or file fail!!!!!', error);
      });
    },
    getAuth() {
      return onAuthStateChanged(auth, (user) => {
        return user
      });
    }
  }
}
</script>