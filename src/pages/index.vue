<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs , getFirestore, updateDoc,
  doc, addDoc , deleteDoc } from 'firebase/firestore'

const editing = ref(false)

const bookToEdit = ref({
  bookName: '',
  category: '',
  description: '',
  author: '',
  sold: '',
  id: null,
})

const dialog = ref(false) // Moved dialog inside setup
const deleteDialog = ref(false)
const seletedID = ref(null)
const db = getFirestore()

const books = ref([]) // Reactive reference to store user data

onMounted( () => {
  getBooks()
})

const addNewBook = async () => {
  try {
    if(!bookToEdit.value.bookName || !bookToEdit.value.author){
      console.log("Please enter name and author")
      
      return
    }
    const docRef = await addDoc(collection(db, 'Books'), bookToEdit.value)

    console.log('New book added with ID: ', docRef.id)
    closeDialog()
    getBooks()
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

const getBooks = async ()=>{
  try {
    const querySnapshot = await getDocs(collection(db, 'Books'))

    books.value = []
    querySnapshot.forEach(doc => {
      books.value.push({ id: doc.id, data: doc.data() })
    })
  } catch (error) {
    console.error('Error getting documents: ', error)
  }
}

const editBook = async id => {
  let foundObj = books.value.find(book => book.id === id)
  bookToEdit.value = foundObj.data
  bookToEdit.value.id = foundObj.id
  editing.value = true
  dialog.value = true
}

const openAddModal = async ()=>{
  dialog.value = true

}

const openDeleteDialog = id => {
  seletedID.value = id
  deleteDialog.value = true
}

const deleteBook = async () => {
  try {
    const bookRef = doc(db, 'Books', seletedID.value)

    await deleteDoc(bookRef)
    deleteDialog.value = false
    await getBooks()
  } catch (error) {
    console.error('Error deleting document: ', error)
  }
}

const saveBook = async () => {
  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  if (editing.value) {
    try {
      const bookRef = doc(db, 'Books', bookToEdit.value.id)

      await updateDoc(bookRef, bookToEdit.value)
      closeDialog() 
      await getBooks()
    } catch (error) {
      console.error('Error updating document: ', error)
    }
  } else {
    addNewBook()
  }
}

const closeDialog = () => {
  editing.value = false
  bookToEdit.value = {
    name: '',
    category: '',
    description: '',
    author: '',
    copiesSold: '',
  }
  dialog.value = false
}
</script>


<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div>
    <VBtn
      class="mb-5"
      variant="outlined"
      color="white"
      style="align-self: center;  background-color: green; "
      @click="openAddModal"
    >
      ADD BOOK
      <VIcon
        class="ml-2"
        icon="tabler-plus"
        size="25"
      />
    </VBtn>
    <div
      v-for="book in books"
      :key="book.id"
    >
      <!-- Existing Card Component -->
      <VCard
        class="mb-6"
      >
        <VRow class="d-flex mt-5 ml-2">
          <VCardTitle>{{ book.data.bookName }}</VCardTitle>
          <VCardActions class="ml-auto mr-5">
            <!-- Edit Button -->
            <a
              class="btn btn-icon btn-light btn-primary mr-2 cursor-pointer"
              title="Edit"
              @click="editBook(book.id)"
            >
              <VIcon
                icon="tabler-edit"
                size="28"
              />
            </a>
            <!-- Delete Button -->
            <a
              class="btn btn-icon btn-light btn-danger cursor-pointer"
              title="Delete"
              @click="openDeleteDialog(book.id)"
            >
              <VIcon
                icon="tabler-trash"
                size="28"
              />
            </a>
          </VCardActions>
        </VRow>
        <VCardText>
          <strong>Name:</strong> {{ book.data.bookName }}<br>
          <strong>Category:</strong> {{ book.data.category }}<br>
          <strong>Description:</strong> {{ book.data.description }}<br>
          <strong>Author:</strong> {{ book.data.author }}<br>
          <strong>Copies Sold:</strong> {{ book.data.sold }}<br>
        </VCardText>
      </VCard>
    </div>
    <!-- Modal for Add/Edit -->
    <div>
      <VDialog
        v-model="dialog"
        max-width="600"
      >
        <VCard>
          <VCardTitle>{{ editing ? 'Edit Book' : 'Add Book' }}</VCardTitle>
          <VCardText class="my-1">
            <VTextField
              v-model="bookToEdit.bookName"
              class="my-2"
              label="Name"
            />
            <VTextField
              v-model="bookToEdit.category"
              class="my-2"
              label="Category"
            />
            <VTextarea
              v-model="bookToEdit.description"
              class="my-2"
              label="Description"
            />
            <VTextField
              v-model="bookToEdit.author"
              class="my-2"
              label="Author"
            />
            <VTextField
              v-model="bookToEdit.sold"
              class="my-2"
              label="Copies Sold"
            />
          </VCardText>
          <VCardActions>
            <VBtn
              variant="outlined"
              color="primary"
              @click="saveBook"
            >
              {{ editing ? 'Save' : 'Add' }}
            </VBtn>
            <VBtn
              variant="outlined"
              color="error"
              @click="closeDialog"
            >
              Cancel
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>  
      <VDialog
        v-model="deleteDialog"
        max-width="400"
      >
        <VCard
          prepend-icon="mdi-trash"
          text="Are you sure to delete item ?"
          title="DELETE"
        >
          <template #actions>
            <VSpacer />

            <VBtn 
              @click="deleteDialog = false"
            >
              Cancel
            </VBtn>

            <VBtn
              style="color: red !important;"
              @click="deleteBook"
            >
              Delete
            </VBtn>
          </template>
        </VCard>
      </VDialog>
    </div>
  </div>
</template>
