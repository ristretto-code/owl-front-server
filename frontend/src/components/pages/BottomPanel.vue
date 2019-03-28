<template>
    <div class="BottomPanel">
        <div class="searchInputCt">
            <input type="text" v-model="searchText" @focus="kshow = true" @keyup.enter="search" @keyup.exact="checkKeyword" @keyup.delete="clear"
             @keyup.up="selectKeyword" @keyup.down="selectKeyword" name="searchInput" class="searchInput" placeholder="" autocomplete="off">
            <span class="searchBtn" @click="search(); search();">
                <i class="addBtn fas fa-search" aria-hidden="true"></i>    
            </span>        
        </div>
        <div class="signBtnCt">
                <button v-on:click="signInAction" v-if="!login">Sign in</button>
                <button v-on:click="signUpAction" v-if="!login">Sign up</button>
                <button v-on:click="logoutAction" v-if="login">Logout</button>
        </div>
            <!-- 추천 검색 키워드 -->
            <div class="rec-keywords" v-if="kshow">
             <div v-bind:key="keyword.id" v-for="keyword in keywords">
            <a v-if="!!keyword" href="#" class="rec-keyword" @click.prevent="searchText=keyword; search();" @keyup.up="moveKeyword(-1)" @keyup.down="moveKeyword(1)">{{keyword}}</a>
            </div>
            </div>
    </div>
</template>

<script>
import store from '../../store'

export default{
    created(){
        this.$store.dispatch('INIT')
    },
    data(){
        return{
            searchText : "",
            keywords : {},
            kshow : false,
            korMainKeyword : null,
            etcMainKeyword : null,
            keyInputLength : null,
            keywordOnCall : [],
        }
    },
    computed:{
        login(){
            return this.$store.state.accessToken
    }
    },
    methods:{
        search(){ // 검색 함수 메소드
            if(!this.searchText||this.searchText=='') return
            this.$store.dispatch('SET_MAIN_KEYWORD', {mainKeyword:null, korMainKeyword: null, etcMainKeyword: null})
            this.searchText = this.searchText.replace(/[\{\}\[\]\/?,;:|\)*~`!^\-_<>@\#$%&\\\=\(\'\"]/gi, ' ')
            this.$store.dispatch('SET_SEARCH_KEYWORD', this.searchText)
            if(this.searchText.split(' ').length==1){ // 키워드가 1개일 시 메인키워드로 선정
                if(this.keywordOnCall)
                this.keywordOnCall.push(this.searchText)
                else{
                    this.keywordOnCall = []
                    this.keywordOnCall.push(this.searchText)
                }
                if(this.isKorean(this.searchText)) // 한글 키워드
                    this.$store.dispatch('SET_MAIN_KEYWORD', {korMainKeyword: {key: this.searchText, doc_count: 0}})
                else
                    this.$store.dispatch('SET_MAIN_KEYWORD', {etcMainKeyword: {key: this.searchText, doc_count: 0}})
            } else {
                /* 키워드 로그 수집 구간 */
                const query = 
                    {
                        "analyzer": "standard",
                        "text": this.searchText                       
                    }
                this.$http.get(`http://13.209.160.90:9200/_analyze`, {
                    params:{
                        source: JSON.stringify(query),
                        source_content_type: 'application/json',
                }, 
                }).then(res=>{
                        let keywords = [...this.keywordOnCall]
                        this.keywordOnCall = []
                        let koreanKeywordsForQuery = {"query": {"bool": {"should": [{ "term" : { "keyword": "" } }]}},"aggs": {"keyword_count": { "terms": {"field": "keyword"}}}}
                        let etcKeywordsForQuery = {"query": {"bool": {"should": [{ "term" : { "keyword": "" } }]}},"aggs": {"keyword_count": { "terms": {"field": "keyword"}}}}
                        keywords.push(this.searchText)
                        for(let i of res.data.tokens){
                            if(i.token.length < 2) continue
                            keywords.push(i.token)
                            if(this.isKorean(i.token)) // 한글 키워드
                            koreanKeywordsForQuery.query.bool.should.push({"term" : { "keyword": i.token }})
                            else // 그 외 키워드
                            etcKeywordsForQuery.query.bool.should.push({"term" : { "keyword": i.token }})
                        }
                        /* 키워드 로그 수집 구간 */
                        let data = new FormData();
                        data.append("keywords", keywords)
                        data.append("keyword", this.searchText)
                        data.append("user", this.$store.state.email)
                        this.$http.post(`http://52.79.204.244/log/keyword/insert`, data).then(()=>{
                            this.$EventBus.$emit('setSearchHistory', this.$store.state.email)
                            this.$EventBus.$emit('goLoadingPage')
                        })
                        this.$EventBus.$emit('insertYoutubeData', keywords)

                        /* 키워드별 메타데이터 수집 구간 */
                        this.$http({
                            method: 'POST',
                            url: `http://52.79.204.244/log/searchdata/insert`,
                            data: keywords,
                            headers: {'content-type': 'application/json'}
                            })

                        /* 메인 키워드 추출 구간 */
                        this.$http.get(`http://13.209.160.90:9200/koreankeyword/_search`, {
                            params:{
                            source: JSON.stringify(koreanKeywordsForQuery),
                            source_content_type: 'application/json',
                            }})
                            .then(res => {
                                if(res.data.aggregations.user_count.buckets[0])
                                    this.korMainKeyword = res.data.aggregations.keyword_count.buckets[0]
                                this.$http.get(`http://13.209.160.90:9200/etckeyword/_search`, {
                                    params:{
                                    source: JSON.stringify(etcKeywordsForQuery),
                                    source_content_type: 'application/json',
                                    }})
                                .then(res => {
                                        if(res.data.aggregations.user_count.buckets[0])
                                            this.etcMainKeyword = res.data.aggregations.keyword_count.buckets[0]
                                }).finally(()=>{
                                        this.$store.dispatch('SET_MAIN_KEYWORD', {korMainKeyword: this.korMainKeyword, etcMainKeyword: this.etcMainKeyword})
                            })
                            })
                })
            }
            this.kshow = false
            this.$EventBus.$emit('goLoadingPage')
        },
        clear(){
            if(!this.searchText||this.searchText=='') return
        },
        checkKeyword(){
            if(this.searchText.length<1) return
            const lastKeyword = this.searchText.substr(this.searchText.lastIndexOf(' ')+1)
            if(this.searchText==""||lastKeyword=="") {
                return
            }
                const korQuery = [
                        {"index":"koreankeyword"},
                        {"query":{"prefix":{"keyword": lastKeyword}},"from":0,"size":3},
                        {"index":"korwiki"},
                        {"query":{"match":{"title": lastKeyword}},"from":0,"size":3}]
                const engQuery =[                            
                        {"index":"etckeyword"},
                        {"query":{"prefix":{"keyword": lastKeyword}},"from":0,"size":3},
                        {"index":"engwiki"},
                        {"query":{"match":{"title": lastKeyword}},"from":0,"size":3}]

            if(this.isKorean(lastKeyword)){
                this.$ES.msearch({ body: korQuery })
                .then(res => {
                    const koreankeyword = res.responses[0].hits.hits
                    const wikiTitle = res.responses[1].hits.hits
                    let data = new Set()
                    for(let i of koreankeyword) data.add(i._source.keyword)
                    for(let i of wikiTitle) data.add(i._source.title)     
                    this.keywords = data
                })
            } else {
                this.$ES.msearch({ body: engQuery })
                .then(res => {
                    const etckeyword = res.responses[0].hits.hits
                    const wikiTitle = res.responses[1].hits.hits
                    let data = new Set()
                    for(let i of etckeyword) data.add(i._source.keyword)
                    for(let i of wikiTitle) data.add(i._source.title)   
                    this.keywords = data               
                })
            }
        },
        signUpAction(){
            this.$EventBus.$emit('showSignUp');
        },
        signInAction(){
            this.$EventBus.$emit('showSignIn');
        },
        logoutAction(){
            store.dispatch('LOGOUT').then(alert('로그아웃 완료'))
        },
        isKorean(keyword){
            return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(keyword)
        },
        selectKeyword(){
            document.querySelectorAll('.rec-keyword')[0].focus()
        },
        moveKeyword(direction){
            let focusdiv = document.querySelector('.rec-keyword:focus').parentElement
            if(direction === -1 && focusdiv.nextElementSibling != null){
                focusdiv.nextElementSibling.children[0].focus()
            } else if(direction === 1 && focusdiv.previousElementSibling != null){
                focusdiv.previousElementSibling.children[0].focus()
            }
        }
    },
}
</script>