<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Create Room
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Room</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="RoomName*" required v-model="name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input label="File input" accept="image/*" v-model="file"></v-file-input>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="onSubmit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
  
<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, Timestamp } from "firebase/firestore"
import Firebase from "@/firebase/firebase"
const db = Firebase.db
const storage = Firebase.storage;

export default {
  data: () => ({
    dialog: false,
    name: "",
    file: null,
  }),
  methods: {
    async onSubmit() {
      console.log("onSubmit call", this.name, this.file);
      let thumbnailUrl = '';
      if (this.file) {
        // 画像をCloud Storageへアップロード
        const filePath = `/room/${this.file.name}`;
        console.log(filePath);
        const storageRef = ref(storage, filePath);
        uploadBytes(storageRef, this.file).then(async (snapshot) => {
          // ダウンロードURLを取得
          thumbnailUrl = await getDownloadURL(snapshot.ref).then((downloadURL) => {
            return downloadURL
          });
          console.log("thumbnailUrl", thumbnailUrl);

          const ref = collection(db, "rooms");
          await setDoc(doc(ref), {
            name: this.name,
            thumbnailUrl: thumbnailUrl,
            created_at: Timestamp.now()
          }).then(result => {
            console.log("success to create room!", result);
            this.dialog = false;
          });
        }).catch((error) => {
          console.log('Uploaded a blob or file fail!!!!!', error);
        });
      }
    }
  }
}
</script>