<template>
    <div class="sorted" v-if="ready">
        <div class="compHead">
            QUESTION
        </div>
        <!-- 초기 화면 -->
        <div class="sorted-questions-wrap">
            <div class="sorted-scroll">
                <i class="fas fa-angle-double-up" @click="moveCarousel(-10)"></i>
                <div class="sorted-up"><i class="fas fa-sort-up" @click="moveCarousel(-1)"></i></div>
                <div class="sorted-down"><i class="fas fa-sort-down" @click="moveCarousel(1)"></i></div>
                <i class="fas fa-angle-double-down" @click="moveCarousel(10)"></i>
            </div>
            <div class="sorted-main" :style="{ transform: 'translateY' + '(' + currentOffset + 'px' + ')'}">
                <div class="sorted-questions sorted-ask" @click="showWrite">
                    <p class="sorted-Q">
                        <i class="far fa-lightbulb sorted-i"></i>
                        <span>질문하기</span>
                    </p>
                </div>
                <div v-if="isNull" class="sorted-questions">검색 결과가 없습니다.</div>
                <div v-bind:key="question.id" v-for="question in questions" class="sorted-questions" @click="showQuestion(question)">
                    <div class="sorted-question-info">
                        <span class="sorted-question-title">{{question.title}}</span><br>
                        <span class="sorted-question-writer">{{question.writer}}</span>
                        <span class="sorted-question-date">{{question.date}}</span>
                    </div>
                    <div v-bind:id="'sorted-question-'+question.id">
                        <hr>
                        <span class='sorted-question-content'>{{question.content}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created(){
        this.setQuestionList()
    },
    data(){
        return {
        questions: [],
        ready: true,
        currentOffset: 0,
        windowSize: 1,
        columnCnt: 3,
        paginationFactor: 138.6,
        currentPage: 0,
        isNull: false,
    }
    },
    computed: {
        atEndOfList() {
            this.columnCnt = Math.floor(document.querySelector('.sorted-main').offsetWidth / 140)
            return this.currentOffset <= (this.paginationFactor * -1) * ((this.questions.length / this.columnCnt) - this.windowSize)
        },
        atHeadOfList() {
            return this.currentOffset === 0
        }
    },
    methods:{
        setQuestionList(){
        this.$http.get(`http://52.79.204.244/question/sorted/list`, { params: {keyword: this.$store.state.searchKeyword, page: this.currentPage }}) // axios 요청으로 질문 리스트 받아옴
        .then(res => {
            if(!res.data.length)
                this.isNull = true
            else 
                res.data.forEach(i => {i.content = i.content.split('<br/>').join('\n'); this.questions.push(i);})
            this.ready = true
        });
        },
        moveCarousel(direction) {
            this.columnCnt = Math.floor(document.querySelector('.sorted-main').offsetWidth / 140)
            if (direction === 1 && !this.atEndOfList) 
                this.currentOffset += (this.paginationFactor * -1) * this.windowSize
            else if (direction === -1 && !this.atHeadOfList) 
                this.currentOffset += (this.paginationFactor * 1) * this.windowSize
            
            if(direction === 10 && !this.atEndOfList)
                this.currentOffset = (this.paginationFactor * -1) * Math.floor(this.questions.length / this.columnCnt)
            else if (direction === -10 && !this.atHeadOfList) 
                this.currentOffset = 0

            if(this.atEndOfList){
                this.currentPage++
                this.getMoreQuestions()
            }
        },
        getMoreQuestions(){
            this.$http.get(`http://52.79.204.244/question/sorted/list`, { params: {keyword: this.$store.state.searchKeyword, page: this.currentPage }}) // axios 요청으로 질문 리스트 받아옴
            .then(res => { 
                res.data.forEach(i => {i.content = i.content.split('<br/>').join('\n'); this.questions.push(i);})
            })
        },
        showQuestion(question){
            this.logQuestion(question.id)
            this.$http.get(`http://52.79.204.244/question/sorted?id=${question.id}`)
            question.type = 1
            this.$EventBus.$emit('showQuestion', question)
        },
        logQuestion(questionId){
            let data = new FormData()
            data.append("questionId", questionId)
            data.append("user", this.$store.state.email)
            this.$http.post(`http://52.79.204.244/log/question/sorted/insert`, data)
        },
        showWrite(){
            if(this.$store.state.mem_idx === null){
                alert('로그인이 필요한 서비스 입니다.')
                return
            }
            this.$EventBus.$emit('showWrite');
        }
    },
}
</script>

