<template>
    <div class='others' v-if="ready">
        <div class="compHead">
            SEARCH RESULT
        </div>
        <div class="others-wrap">
        <ul class="others-ul">
            <li v-for="gdata in combination" :key="gdata.id">
                <div v-on:click="logComp(gdata.link, gdata.title)">
                    <img src="https://www.naver.com/favicon.ico" v-if="gdata.source == 'nb' || gdata.source == 'nc'">
                    <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" v-if="gdata.source == 'g'">
                    <img src="../../img/owl.png" v-if="gdata.source == 'l'">
                    <u><span class="others-title" v-html="gdata.title"></span></u><br>
                    <p class="others-link">{{gdata.link}}</p>
                    <span class="others-subpost" v-html="gdata.description"></span>
                </div>
            </li>
        </ul>
        <!-- 구글 API 크롤링용 숨겨진 태그 -->
        <div class="others-right" style="display:none;">
            <gcse:searchresults-only v-pre class="others-google" gname="others-searchbox" autoSearchOnLoad=false></gcse:searchresults-only>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    created(){
        this.setSearchKeyword()
        this.setOthersData()
        this.setESData()
    },
    data(){
        return{
            searchText: '',
            ready: false,
            combination: [],
        }
    },
    methods: {
        setSearchKeyword(){
            if(this.$store.state.searchKeyword.length == 0 || this.$store.state.searchKeyword == ' ')
                this.searchText = 'none';
            else if(this.$store.state.searchKeyword.includes('#'))
                this.searchText = this.$store.state.searchKeyword.split('#').join('');
            else 
                this.searchText = this.$store.state.searchKeyword
        },
        setOthersData(){
            this.$http.get(`http://52.79.204.244/search/naver/blog/${this.searchText}/1/sim`)
            .then(res_blog => {
                this.setCombination(res_blog, 'nb')
                this.$http.get(`http://52.79.204.244/search/naver/cafearticle/${this.searchText}/1/sim`)
                .then(res_cafe => {
                     this.setCombination(res_cafe, 'nc')
            })
            setTimeout(this.setGoogleApi, 1);
            setTimeout(this.setGoogleApiData, 1000)     
        })
        },
        setESData(){
            const mQuery = [                            
                {"index":"data_google"},
                {"query":{"match":{"title": this.searchText}},"from":0,"size":2},
                {"index":"data_naver"},
                {"query":{"match":{"title": this.searchText}},"from":0,"size":2},
                {"index":"search_data"},
                {"query":{"match":{"title": this.searchText}},"from":0,"size":2},
                {"index":"crawling_metadata"},
                {"query":{"match":{"title": this.searchText}},"from":0,"size":20}
                ]
            this.$ES.msearch({ body: mQuery })
            .then(res => {
                let datas = []
                if(res.responses[0].hits.total != 0) 
                    datas.push(res.responses[0].hits.hits)
                if(res.responses[1].hits.total != 0)
                    datas.push(res.responses[1].hits.hits)
                if(res.responses[2].hits.total != 0)
                    datas.push(res.responses[2].hits.hits)
                if(res.responses[3].hits.total != 0)
                    datas.push(res.responses[3].hits.hits)
                for(let i of datas)
                    for(let j of i){
                        j._source.title.split(this.searchText).join('<b>'+this.searchText+'</b>')
                        j._source.snippet.split(this.searchText).join('<b>'+this.searchText+'</b>')
                        if(j._source.snippet.length>50)
                            j._source.snippet = j._source.snippet.substr(0, 50) + ' ...'
                        this.combination.push({title: `<a href="${j._source.link}" style="color:inherit;" target="_blank">${j._source.title}</a>`, link: j._source.link, description: j._source.snippet, source: 'l'})
                    }
            })
        }, 
        setCombination(res, div){
            if(!res.data.items) return
            res.data.items.forEach(ele => {ele.source=div})
            if(div=='nb'||div=='nc')
            res.data.items.forEach(ele => {ele.title=`<a href="${ele.link}" style="color:inherit;" target="_blank">${ele.title}</a>`})
            for(let i of res.data.items){
                this.combination.push(i)
            }
        },
        setGoogleApi(){
            google.search.cse.element.go()
            this.gcseSearch()
        },
        gcseSearch(){
            google.search.cse.element.getElement('others-searchbox').execute(this.searchText)
        },
        setGoogleApiData(){
            const googleComps = document.getElementsByClassName('gs-title')
            let check = []
            for(let i of googleComps){
                const title = i.outerHTML.replace('class="gs-title"', 'style="color:inherit;"')
                if(i.tagName == 'A' && i.outerHTML && i.href && i.innerHTML && check.indexOf(title) == -1) {
                    this.combination.push({title: title, link: i. href, description: i.innerHTML, source: 'g'})
                    check.push(title)
                }
            }
            this.sortCombination()
        },
        sortCombination(){
            let newCombination = []
            let comb = [[],[],[],[]]
            for(let i of this.combination){
                if(i.source == 'l') comb[0].push(i)
                if(i.source == 'g') comb[1].push(i)
                if(i.source == 'nb') comb[2].push(i)
                if(i.source == 'nc') comb[3].push(i)
            }
            let sort = []
            let change = []
            for(let i in comb[0]){
                const tmp = comb[0][i].title.replace(/(<([^>]+)>)/ig,"");
                if(sort.indexOf(tmp) == -1){
                    sort.push(tmp)
                    change.push(comb[0][i])
                }
            }
            comb[0] = change
            for (let i=0;i<30;i++){
                if(comb[0][0] && comb[0][0]!="") 
                    newCombination.push(comb[0].splice(0, 1)[0])
                let ran = Math.floor(Math.random()*4)
                if(comb[ran][0]) 
                    newCombination.push(comb[ran].splice(0, 1)[0])
            }
            this.combination = newCombination
            this.ready = true
        },
        logComp(link, title){
            let data = new FormData()
            data.append("link", link)
            data.append("title", title)
            data.append("div", 'log')
            data.append("user", this.$store.state.email)
            this.$http.post(`http://52.79.204.244/log/searchresult/insert`, data)
        }, 
    }
}
</script>