<template>
  <div id="app" :style="{ backgroundImage: `url('${backImg}')` }" :class="{blackTheme:isblack, whiteTheme:iswhite}">
    <div id="appContainer">
      <Before v-if="$store.state.page === 1"/>
      <After v-else-if="$store.state.page === 2"/>
      <Loading v-else-if="$store.state.page === 3"/>
      <Start v-else/>
      <BottomPanel/>
      <Sign/>
      <Read/>
      <Portfolio/>
        <div class="AppIconCt">
            <!-- <button v-on:click="pageSwitch" class="pageChange"><i class="fas fa-home"></i></button> -->
            <label for="themelightswitch" class="theme-light-switch__label" ></label>
            <input type="checkbox" id="themelightswitch" name="theme-light-switch" class="theme-light-switch" @click="themelight" />
            <div name="theme-image-switch" class="theme-image-switch" @click="listshow = !listshow"></div>
            <transition name="slide-fade">
            <div name="theme-image-list" class="theme-image-list" v-if="listshow">
                <div class="theme-image-list-header">
                  <span class="theme-image-search-icon"></span>
                  <input type="text" class="theme-image-search" v-model="imgQuery" @keyup.enter="themeSet" placeholder="Photos">
                </div>
                <div class="theme-image-list-div" v-for="unsplashImg in unsplashImgs" :key="unsplashImg.id">
                  <img :src="unsplashImg.urls.raw+'&w=2560&dpi=2'" alt="bgimage" @click="themeChange">
                </div>
                <div class="theme-image-scroll" v-if="nextPage || prevPage">
                  <i class="fas fa-long-arrow-alt-left" v-if="prevPage" @click="currPage -= 1; themeSet();"></i>
                  <i class="fas fa-long-arrow-alt-right" v-if="nextPage" @click="currPage += 1; themeSet();"></i>
                </div>
            </div>
            </transition>
        </div>
    </div>
  </div>
</template>

<script>
import BottomPanel from './components/pages/BottomPanel'
import Start from './components/pages/Start'
import Before from './components/pages/Before'
import After from './components/pages/After'
import Sign from './components/pages/Sign'
import Read from './components/pages/Read'
import Portfolio from './components/pages/Portfolio'
import Loading from './components/pages/Loading'
import jwtDecode from 'jwt-decode'
import animals from './data/animals.json'

export default {
  name: 'App',
  created(){
    this.getAPIs()
    this.setState()
    this.$EventBus.$on('goBeforePage', this.goBeforePage)
    this.$EventBus.$on('goAfterPage', this.goAfterPage)
    this.$EventBus.$on('goLoadingPage', this.goLoadingPage)
    this.$EventBus.$on('setSearchHistory', this.setSearchHistory)
    this.$EventBus.$on('refreshMember', this.refreshMember)
    this.$EventBus.$on('search', this.search)
  },
  components: {
    'BottomPanel' : BottomPanel,
    'Start' : Start,
    'Before' : Before,
    'After' : After,
    'Sign' : Sign,
    'Loading' : Loading,
    'Read' : Read,
    'Portfolio' : Portfolio,
  },
  data() {
      return {
        stat: 0, // stat이 1이면 Before, 2면 After, 아니면 MainPanel 페이지를 보여줌
        unsplash: [],
        listshow : false,
        imgQuery : '',
        unsplashImgs: [],
        iswhite: true,
        isblack: false,
        backImg:'https://wpblink.com/sites/default/files/wallpaper/products/73428/ubuntu-wallpapers-hd-73428-1992472.png',
        nextPage : false,
        prevPage : false,
        currPage : 1
      }
  },
  render(component) { 
    return component(this.ViewComponent)
  },
  methods: {
    setState(){
      const token = this.getToken()
      this.backImg = localStorage.getItem("theme") != null ? localStorage.getItem("theme") : this.backImg
      if(token){
        this.$http.get(`http://52.79.204.244/member?email=${token.email}`).then(res => {
          this.$store.dispatch('SETMEMBER', res.data)
          this.setCustomKeywords(res.data.email)
          this.setSearchHistory(res.data.email)
        })
      } else {
        this.setMemberState('anonymous@NAM', '익명의 ' + animals[Math.floor(Math.random() * animals.length)] , null)
        this.setCustomKeywords(`anonymous@NAM`)
        this.setSearchHistory(`anonymous@NAM`)
        // TODO anonymous@NAM 대신 다른 걸로 바꾸기
      }
    },
    goBeforePage(){
      this.$store.dispatch('SET_PAGE', 1)
    },
    goAfterPage(){
      this.$store.dispatch('SET_PAGE', 2)
    },
    goLoadingPage(){
      this.$store.dispatch('SET_PAGE', 3)
    },
    setCustomKeywords(email){
      if(!email) return
      const query =
        {
            "query": {
              "match": {
                "user": email
              }
            },
              "aggs": {
              "user_count": {
                "terms": {"field": "user"},
                "aggs": {
                  "keyword_count": {
                    "terms" : {"field":"keyword"}
                  }
                }
            }
          }
        }
 
        this.$http.get(`http://13.209.160.90:9200/etckeyword/_search`, {
          params:{
              source: JSON.stringify(query),
              source_content_type: 'application/json',
      }, 
      }).then(res =>{
        let etcKeywords = []
        if(res.data.aggregations.user_count.buckets[0])
          for(let i of res.data.aggregations.user_count.buckets[0].keyword_count.buckets)
            etcKeywords.push(i.key)
      this.$store.dispatch('SETCUSTOMKEYWORD', {etcKeywords: etcKeywords})        
      })   

      this.$http.get(`http://13.209.160.90:9200/koreankeyword/_search`, {
          params:{
              source: JSON.stringify(query),
              source_content_type: 'application/json',
      }, 
      }).then(res=>{
        let koreanKeywords = []
        if(res.data.aggregations.user_count.buckets[0])
          for(let i of res.data.aggregations.user_count.buckets[0].keyword_count.buckets)
            koreanKeywords.push(i.key)
        this.$store.dispatch('SETCUSTOMKEYWORD', {koreanKeywords: koreanKeywords})
      })
    },
    setMemberState(email, nickName){
      const data = {_email: email, _nickName: nickName}
      this.$store.dispatch('SETMEMBER', data)
    },
    getToken(){
    const token = document.location.href.split('token=')[1]
    if(!!token){
      this.$store.dispatch('APILOGIN', token)
      window.location.href="http://13.209.213.138/"
    } else if(localStorage.getItem('accessToken')) 
    return jwtDecode(localStorage.getItem('accessToken'))
      else
    return null
    },
    setSearchHistory(email){
      const query = 
      {
        "query": {
          "match_phrase": {
            "user":email
          }
        }
        , "sort": [
          {
            "date": {
              "order": "desc"
            }
          }
        ]
      }
      this.$http.get(`http://13.209.160.90:9200/keyword/_search`, {
          params:{
              source: JSON.stringify(query),
              source_content_type: 'application/json',
      }, 
      }).then(res =>{
        let history = []
        for(let i of res.data.hits.hits)
          history.push(i._source.keyword)
      this.$store.dispatch('SETHISTORY', {searchHistory: history})     
      })   
    },
    themeChange(event){
      this.backImg = event.target.src;
      localStorage.setItem("theme", event.target.src);
    },
    themeSet(){
      let client_id = this.$store.getters.apis.unsplash[0]
      let query = this.imgQuery.length > 0? this.imgQuery : 'natures'
      let currPage = this.currPage
      var vthis = this

      if(this.imgQuery.length > 0) {
        query = this.imgQuery
        this.$http.get(`https://api.unsplash.com/search/photos?client_id=${client_id}&query=${query}&page=${currPage}`)
        .then(res=> {
            vthis.unsplashImgs = res.data.results
            this.prevPage = currPage > 1
            this.nextPage = currPage < res.data.total_pages
        })
      } else {
        this.$http.get(`https://api.unsplash.com/photos/random?client_id=${client_id}&count=10`)
        .then(res => {
          vthis.unsplashImgs = res.data
        })
      }
    },
    themelight(){
      this.isblack = !this.isblack
      this.iswhite = !this.iswhite
    },
    getAPIs(){
      this.$http.get('http://52.79.204.244/apis').then(res => {
        this.$store.dispatch('SET_APIS', res.data)
        this.gcse()
        this.themeSet()
      })
    },
    gcse(){
      let cx = this.$store.getters.apis.googleCustomSearch[0];
      let gcse = document.createElement('script');
      gcse.type = 'text/javascript';
      gcse.async = true;
      gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
      let s = document.getElementsByTagName('script')[0];
      s.parentNode.prepend(gcse);
    },
    refreshMember(){
      this.$http.get(`http://52.79.204.244/member/${this.$store.state.mem_idx}`).then(res => {
        this.$store.dispatch('SETMEMBER', res.data)
      })
    },
    search(keyword){
      this.$store.dispatch('SET_SEARCH_KEYWORD', keyword)
      document.querySelector('#appContainer > div.BottomPanel > div.searchInputCt > input').value = keyword
      console.log(this.$store.state.searchKeyword)
      this.goLoadingPage()
    }

  },
}
</script>

<style lang="scss">
@import "../static/animate.css";
@import "./style/white/main_white";

.whiteTheme{
  //main_white가 import될 자리.. for ver1.1
}
.blackTheme{
  @import "./style/black/main_black";
}

body{margin: 0; padding: 0}


</style>
