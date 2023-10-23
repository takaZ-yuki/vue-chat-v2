<template>
  <v-app id="inspire">
    <Sidebar />
    <v-main>
      <h1>{{ room ? room.name : "" }}</h1>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col v-for="card in cards" :key="card" cols="12">
            <v-card>
              <v-subheader>{{ card }}</v-subheader>

              <v-list two-line>
                <template v-for="(data, index) in messages">
                  <v-list-item :key="index">
                    <v-list-item-avatar color="grey darken-1">
                      <v-img :src="data.photoURL" v-if="data.photoURL"></v-img>
                      <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" v-if="!data.photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-subtitle class="message">
                        {{ data.message }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider v-if="index !== 6" :key="`divider-${index}`" inset></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-textarea v-model="body" auto-grow append-icon="mdi-comment" class="mx-2" label="メッセージを送信する"
        rows="3"></v-textarea>
      <v-btn class="mr-4" @click="submit" :disabled="invalid">
        submit
      </v-btn>
      <v-btn @click="clear">
        clear
      </v-btn>
    </v-main>
  </v-app>
</template>
  
<script>
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import Sidebar from "@/components/layouts/SidebarComponent"
import { doc, onSnapshot, setDoc, getDoc, getDocs, collection, query, orderBy, Timestamp } from "firebase/firestore"
import Firebase from "@/firebase/firebase"
const db = Firebase.db

export default {
  components: {
    Sidebar
  },
  async created() {
    this.roomId = this.$route.query.room_id;
    console.log(this.roomId);

    const roomRef = doc(db, "rooms", this.roomId)
    const roomDoc = await getDoc(roomRef);
    if (!roomDoc.exists()) {
      await this.$router.push('/')
    }
    this.room = roomDoc.data();
    console.log(this.room);

    const messageRef = collection(roomRef, 'messages')
    const snapshot = await getDocs(query(messageRef, orderBy("created_at", "asc")));

    snapshot.docs.map(doc => {
      console.log(doc.data());
      // this.messages.push(doc.data());
    });

  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem('user'))

    const roomRef = doc(db, "rooms", this.roomId)
    const messageRef = collection(roomRef, 'messages')
    const q = query(messageRef, orderBy("created_at", "asc"));
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log('new message', change.doc.data());
        if (change.type === "added") {
            console.log("New message: ", change.doc.data());
            this.messages.push(change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Modified message: ", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("Removed message: ", change.doc.data());
        }
      });
    });
  },
  data: () => ({
    messages: [],
    body: '',
    roomId: '',
    room: null,
    cards: ['Today'],
    user: null,
  }),
  computed: {
    invalid() {
      if (!this.body) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    clear() {
      console.log(this.body);
      this.body = '';
    },
    async submit() {
      const data = {
        message: this.body,
        name: this.user.displayName,
        photoURL: this.user.photoURL,
        created_at: Timestamp.now(),
      }

      console.log(this.user);
      const roomRef = doc(db, "rooms", this.roomId)
      const messageRef = collection(roomRef, 'messages')
      await setDoc(doc(messageRef), data)
        .then(result => {
          console.log("success to create room!", result);
          this.body = '';
        }).catch(error => {
          console.log("fail to create room!", error);          
        });
    }
  }
}
</script>

<style>
.message {
  text-align: left;
}
</style>