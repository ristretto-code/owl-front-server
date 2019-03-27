<template>
    <div>
                <!-- 모달   -->
        <div class="modal" v-if="showModal" v-on:click="closeRead"></div>

                <!-- 질문, 수정 + 글쓰기 -->
        <div>
            <transition enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster">
                <Question :data="question" v-if="showQuestion"/>
            </transition>
            <transition enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster">
                <Write :data="question" v-if="showWrite"/>
            </transition>
        </div>
    </div>
</template>

<script>
import Question from '../etc/Question'
import Write from '../etc/Write'

export default {
  created(){
    this.$EventBus.$on('showQuestion', this.showQuestionAction);
    this.$EventBus.$on('showWrite', this.showWriteAction);
    this.$EventBus.$on('closeRead', this.closeRead);
  },
  components:{
    'Question' : Question,
    'Write' : Write
  },
  data(){
      return{
          showModal: false,
          showQuestion: false,
          showWrite: false,
          question: null,
      }
  },
  methods: {    
    showQuestionAction(question){
      this.question = question
      this.showModal = true;
      this.showQuestion = true;
    },
    showWriteAction(question){
      this.question = question
      if(this.question == null){
          this.question = {title : "", content: "", type : 0}
      }
      this.showModal = true;
      this.showWrite = true;
    },
    closeRead(){
      this.showModal = false;
      this.showQuestion = false;
      this.showWrite = false;
    },
   },
}
</script>
