<template>
    <div class="official" v-if="ready">
        <div class="compHead">OFFICIAL DATA</div>
        <div class="official-wrap">
            <!-- 위키 데이터 출력 -->
            <div class="official-wiki">
                <p v-html="wiki" v-on:click="changeKeyword"></p>
            </div>         
            <ul class="review-ul">
                <!-- 리뷰 목록 출력 -->
                <li class="review-li" v-for="review in reviews" :key="review.id">
                    <span class="review-writer">{{review.writer}}</span>
                    <span class="review-sub"><a class="review-keyword">{{review.keyword}}</a> - {{new Date(review.date).toLocaleString()}}</span>
                    <span class="review-content">{{review.review}}</span>
                </li>
                <li class="review-li" v-if="reviews == null || reviews.length === 0">
                    <span class="review-none">
                        <a class="review-keyword" @click="$EventBus.$emit('search', tag)">{{keyword}}</a>
                        에 대한 리뷰가 없습니다.
                    </span>
                </li>
            </ul>
            <div class="review-scroll">
                <i v-if="!reviewPage.first" class="fas fa-angle-left review-move-prev" @click="prevPage"></i>
                <i v-if="!reviewPage.last" class="fas fa-angle-right review-move-next" @click="nextPage"></i>
            </div>
            <!-- 리뷰 작성 -->
            <div class="review-insert">
                <input type="text" placeholder="악성 댓글은 상처를 남깁니다." v-model="input_review" @keyup.enter="sendReview">
            </div>
        </div>

    </div>
</template>

<script>

export default {
    created(){
        this.setMainKeyword()
        this.setWikiData(this.$store.state.searchKeyword)
        this.$EventBus.$on('getRandomKeyword', this.getRandomKeyword) 
    },
    data(){
        return{
            reviews: [],
            info: [],
            wiki: '',
            input_review:'',
            reviewPage: [],
            ready: false,
            keyword: '',
            reload: 0,
        }
    },
    methods:{
        sendReview(){
            if(this.input_review.length > 0){                
                this.$http({
                    method: 'post',
                    url: `http://52.79.204.244/search/review`,
                    data: {
                        review: this.input_review,
                        writer: this.$store.state.nickname,
                        keyword: this.keyword
                    },
                    params : {
                        mem_idx : this.$store.state.mem_idx != null ? this.$store.state.mem_idx : 0
                    }
                }).then(response => {
                        this.setWikiData(this.keyword)
                });
            } else {
                alert('입력해!');
            }
        },
        nextPage(){
            const nextPage = this.reviewPage.number + 1
            this.$http.get(`http://52.79.204.244/search/review/${this.keyword}/${nextPage}`).then(response => {
                this.reviews = response.data.content
                this.reviewPage = response.data
            });
        },
        prevPage(){
            const prevPage = this.reviewPage.number - 1
            this.$http.get(`http://52.79.204.244/search/review/${this.keyword}/${prevPage}`).then(response => {
                this.reviews = response.data.content;
                this.reviewPage = response.data;
            });
        },
        changeKeyword(){
            this.keyword = localStorage.linkKeyword
            this.setWikiData(this.keyword)
        },
        setWikiData(keyword){
        this.$http.get(`http://52.79.204.244/search/review/${this.keyword}/0`).then(res => {
            this.reviews = res.data.content
            this.reviewPage = res.data;
        });

        const query = { "query": { "match": { "title": keyword } } }
        this.$http.get(`http://13.209.160.90:9200/korwiki/_search`, {
          params:{
              source: JSON.stringify(query),
              source_content_type: 'application/json',
      },
      }).then(res =>{
          if(res.data.hits.hits.length < 1) {
              this.reviews = null
              this.setWikiData('부엉이')
              return
          }
          let textData = res.data.hits.hits[0]._source.revision.text._
          if((textData.indexOf('#REDIRECT')!=-1 || textData.indexOf('#넘겨주기')!=-1) && this.reload < 3){
              this.keyword = (/\[\[(.*)\]\]/).exec(textData)[1]
              this.reviews = null
              this.reload++
              this.setWikiData(this.keyword)
              return
          }
          textData = textData.replace(/\n/g, '<br/>')
          textData = textData.replace(/\[\[([^|]+?)\]\]/ig, "<b style='color: skyblue;cursor: pointer;' onclick='localStorage.linkKeyword=`$1`'>$1</b>")
          textData = textData.replace(/\[\[파일:.*?\]\]/ig," ")
          textData = textData.replace(/\[\[.*?\|(.*?)\]\]/ig, "<b style='color:gray'>$1</b>")
          textData = textData.replace(/\(\{\{(.*?)\}\}\)/ig, " ")
          textData = textData.replace(/<ref(.*?)<\/ref>/ig, " ")
          textData = textData.replace(/\{\{(.*?)\}\}/ig, "<b>$1</b>")
          textData = textData.replace(/\[(http.*?) (.*?)\]/ig,"<a href=$1 target='_blank'>$2</a>")
          textData = textData.replace(/(언어|lang|링크|link)(\|en\|)|(\{\{|\}\})|(언어링크)/ig,"")
          textData = textData.replace(/\|/ig,"- ")
          textData = textData.replace(/\b(?:https?):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*/ig, "<a href=$& target='_blank'>$&</a>")
          textData = textData.replace(/'''(.*?)'''/ig, "<b>$1</b>")
          this.wiki = textData
          this.ready = true
          this.reload = 0
      })
        },
        getRandomKeyword(){
            return [...this.$store.state.koreanKeywords, ...this.$store.state.etcKeywords].sort(()=>{return 0.5-Math.random()})[0]
        },
        setMainKeyword(){
            if(this.$store.state.korMainKeyword && this.$store.state.etcMainKeyword) {
                this.keyword = this.$store.state.korMainKeyword.doc_count > this.$store.state.etcMainKeyword.doc_count ? 
                this.$store.state.korMainKeyword.key : this.$store.state.etcMainKeyword.key
            } else if (this.$store.state.korMainKeyword){
                this.keyword = this.$store.state.korMainKeyword.key
            } else if(this.$store.state.etcMainKeyword){
                this.keyword = this.$store.state.etcMainKeyword.key
            } else{
                this.keyword = this.$store.state.searchKeyword
                if(this.keyword.length === 0) this.keyword = 'none'
            }
            localStorage.linkKeyword = this.keyword
            this.$store.dispatch('SET_MAIN_KEYWORD', {mainKeyword: this.keyword})
        }
    }
}
</script>