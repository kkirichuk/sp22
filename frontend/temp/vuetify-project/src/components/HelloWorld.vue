<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row>
        <v-col>
          <v-card
            title="Available positions"
            subtitle="These are all the positions that have already been submitted!"
            variant="tonal"
          >
          <v-list lines="one">
          <v-list-item
            v-for="n in positions" ref="positions.value"
            :key="n"
          >
          <v-row justify="center" no-gutters>
            <v-col cols="auto" class="mr-2">
              Position {{ n._id }}
            </v-col>

            <v-col cols="auto">
              <v-icon @click="deletePosition(n._id)">mdi-trash-can</v-icon>
            </v-col>

            <v-col cols="auto">
              <v-icon @click="editPosition(n._id)">mdi-reload</v-icon>
            </v-col>
          </v-row>

          <v-list-item-content>
            Latitude: {{ n.latitude }}, Longitude: {{ n.longitude }}, Created At: {{ n.createdAt }}, Updated At: {{ n.updatedAt }}
          </v-list-item-content>
        </v-list-item>
        </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card
            title="Add position"
            subtitle="This is where you can submit your position!"
            variant="tonal"
          >
            <v-card-actions>
              <v-row justify="center">
                <v-col cols="auto">
                  <v-btn variant="outlined" @click="addPosition">Submit</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Position } from "@/types";
import axios from "axios";

const positions = ref<Position[]>([]);

async function getPositions(): Promise<Position[]> {
  const result = await axios.get('http://localhost:3000/')
  return result.data
}

async function editPosition(id: string) {
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => { 
          const location: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
          await axios.put(`http://localhost:3000/${id}`, location)
          window.location.reload()
         }, (err: unknown) => { console.log(err) });
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
}

async function deletePosition(id: string) {
    await axios.delete(`http://localhost:3000/${id}`)
    window.location.reload()
}

function addPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => { 
          const location: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
          await axios.post('http://localhost:3000/', location)
          window.location.reload()
         }, (err: unknown) => { console.log(err) });
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
}

onMounted(async () => {positions.value = await getPositions()})

</script>
