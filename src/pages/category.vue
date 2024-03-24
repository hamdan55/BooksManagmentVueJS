<script setup>
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs, getFirestore, updateDoc,
} from 'firebase/firestore'
import { onMounted, ref } from 'vue'

const editing = ref(false)

const categoryToEdit = ref({
  categoryName: '',
  categoryDescription: '',
  popularity: '',
  noOfBooks: null,
  id: null,
})

const dialog = ref(false) // Moved dialog inside setup
const deleteDialog = ref(false)
const seletedID = ref(null)
const db = getFirestore()

const categories = ref([]) // Reactive reference to store user data

onMounted( () => {
  getCategories()
})

const addNewCategory = async () => {
  try {
    if(!categoryToEdit.value.categoryName || !categoryToEdit.value.categoryDescription){
      console.log("Please enter name and descripton")
      
      return
    }
    const docRef = await addDoc(collection(db, 'category-books'), categoryToEdit.value)

    console.log('New book added with ID: ', docRef.id)
    closeDialog()
    getCategories()
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

const getCategories = async ()=>{
  try {
    const querySnapshot = await getDocs(collection(db, 'category-books'))

    categories.value = []
    querySnapshot.forEach(doc => {
      categories.value.push({ id: doc.id, data: doc.data() })
    })
  } catch (error) {
    console.error('Error getting documents: ', error)
  }
}

const editCategory = async id => {
  let foundObj = categories.value.find(category => category.id === id)
  categoryToEdit.value = foundObj.data
  categoryToEdit.value.id = foundObj.id
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

const deleteCategory = async () => {
  try {
    const bookRef = doc(db, 'category-books', seletedID.value)

    await deleteDoc(bookRef)
    deleteDialog.value = false
    await getCategories()
  } catch (error) {
    console.error('Error deleting document: ', error)
  }
}

const saveCategory = async () => {
  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  if (editing.value) {
    try {
      const bookRef = doc(db, 'category-books', categoryToEdit.value.id)

      await updateDoc(bookRef, categoryToEdit.value)
      closeDialog() 
      await getCategories()
    } catch (error) {
      console.error('Error updating document: ', error)
    }
  } else {
    addNewCategory()
  }
}

const closeDialog = () => {
  editing.value = false
  categoryToEdit.value = {
    categoryName: '',
    categoryDescription: '',
    popularity: '',
    noOfBooks: null,
    id: null,
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
      ADD Category
      <VIcon
        class="ml-2"
        icon="tabler-plus"
        size="25"
      />
    </VBtn>
    <div
      v-for="category in categories"
      :key="category.id"
      class="mb-1"
    >
      <!-- Existing Card Component -->
      <VCol
        cols="12"
        md="10"
        lg="10"
      >
        <VCard>
          <VRow class="d-flex mt-5 ml-2">
            <VCardTitle>{{ category.data.categoryName }}</VCardTitle>
            <VCardActions class="ml-auto mr-5">
              <!-- Edit Button -->
              <a
                class="btn btn-icon btn-light btn-primary mr-2 cursor-pointer"
                title="Edit"
                @click="editCategory(category.id)"
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
                @click="openDeleteDialog(category.id)"
              >
                <VIcon
                  icon="tabler-trash"
                  size="28"
                />
              </a>
            </VCardActions>
          </VRow>
          <VCardText>
            <strong>Name:</strong> {{ category.data.categoryName }}<br>
            <strong>No OF Books:</strong> {{ category.data.noOfBooks }}<br>
            <strong>Description:</strong> {{ category.data.categoryDescription }}<br>
            <strong>Popularity:</strong> {{ category.data.popularity }}<br>
          </VCardText>
        </VCard>
      </VCol>
    </div>
    <!-- Modal for Add/Edit -->
    <div>
      <VDialog
        v-model="dialog"
        max-width="600"
      >
        <VCard>
          <VCardTitle>{{ editing ? 'Edit Category' : 'Add Category' }}</VCardTitle>
          <VCardText class="my-1">
            <VTextField
              v-model="categoryToEdit.categoryName"
              class="my-2"
              label="Name"
            />
            <VTextField
              v-model="categoryToEdit.noOfBooks"
              class="my-2"
              label="No of books"
            />
            <VTextarea
              v-model="categoryToEdit.categoryDescription"
              class="my-2"
              label="Description"
            />
            <VTextField
              v-model="categoryToEdit.popularity"
              class="my-2"
              label="Popularity"
            />
          </VCardText>
          <VCardActions>
            <VBtn
              variant="outlined"
              color="primary"
              @click="saveCategory"
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
              @click="deleteCategory"
            >
              Delete
            </VBtn>
          </template>
        </VCard>
      </VDialog>
    </div>
  </div>
</template>
