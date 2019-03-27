<template>
    <div>
                <!-- 모달   -->
        <div class="modal" v-if="showModal" v-on:click="allPopupDown"></div>
                <!-- 회원가입, 로그인 -->
        <div>
            <SignIn v-if="showSignIn"/>
            <SignUp v-if="showSignUp"/>
        </div>
    </div>
</template>

<script>
import SignIn from '../etc/SignIn'
import SignUp from '../etc/SignUp'
export default {
  created(){
    this.$EventBus.$on('showSignIn', this.showSignInAction);
    this.$EventBus.$on('showSignUp', this.showSignUpAction);
    this.$EventBus.$on('allPopupDown', this.allPopupDown);
  },
  components:{
        'SignIn' : SignIn,
        'SignUp' : SignUp,
  },
  data(){
      return{
          showModal: false,
          showSignIn: false,
          showSignUp: false,
      }
  },
  methods: {    
    showSignInAction(){
      this.showModal = true;
      this.showSignIn = true;
    },
    showSignUpAction(){
      this.showModal = true;
      this.showSignUp = true;
    },
    allPopupDown(){
      this.showModal = false;
      this.showSignIn = false;
      this.showSignUp = false;
    },
  },
}
</script>
