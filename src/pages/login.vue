<script setup>
import { themeConfig } from '@themeConfig'
import {
  emailValidator,
  requiredValidator,
} from '@validators'

import {
  browserSessionPersistence, createUserWithEmailAndPassword,
  getAuth, setPersistence, signInWithEmailAndPassword,
} from "firebase/auth"
import { useRouter } from 'vue-router'

const isPasswordVisible = ref(false)
const email = ref('admin@demo.com')
const password = ref('admin123')
const rememberMe = ref(false)
const router = useRouter()

const createUser = ()=>{
  setPersistence(getAuth(), browserSessionPersistence)
    .then(() => {
      // The session state will be persisted in the browser's session storage
      return createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    })
    .then(userCredential => {
      console.log("USER CREATED", userCredential)
      router.push('/')
    })
    .catch(error => {
      console.error(error)
    })
}

const loginUser = () => {
  setPersistence(getAuth(), browserSessionPersistence)
    .then(() => {
      return signInWithEmailAndPassword(getAuth(), email.value, password.value)
    })
    .then(userCredential => {
      // Save user and token data in local storage
      const user = userCredential.user
      const accessToken = userCredential.accessToken

      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,

        // Add more user data as needed
      }))
      localStorage.setItem('accessToken', accessToken)

      console.log("USER LOGGED IN", userCredential)
      router.push('/')
    })
    .catch(error => {
      console.error(error)
    })
}
</script>

<template>
  <VRow
    class="d-flex align-center justify-center auth-wrapper"
  >
    <VCol
      cols="12"
      lg="12"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <h5 class="text-h5 font-weight-semibold mb-1">
            Welcome to {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin123</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="loginUser">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <a
                  class="text-primary ms-2"
                  href="#"
                >
                  Create an account
                </a>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
