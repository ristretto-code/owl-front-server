<template>
    <div class='reply-main' v-if="ready">
        <div class="compHead">
            ANSWER
        </div>
        <div class="reply-comp">
            <i class="fas fa-dice" @click="setQuestion('re')"></i>
            <div class='reply-comp-info'>
                <span class='reply-comp-info-writer'>
                    {{question.writer}}
                </span>
                <span class='reply-comp-info-date'>
                    {{question.date}}
                </span>
            </div>
            <div class='reply-comp-id'>
                <span>
                    {{question.id}}
                </span>
            </div>
            <i :class="{'far fa-star' : !isScrap, 'fas fa-star' : isScrap}" @click="scrap(question)"></i>
            <div class='reply-comp-title'>
                <span>
                    {{question.title}}
                </span>
            </div>
            <div class='reply-comp-content'>
                <pre><code>{{question.content}}</code></pre>
            </div>
            <div class='reply-comp-tags'>
                <span class="reply-tag" v-for="(tag, index) in question.tags" :key="tag + '' + index">
                    <a v-if="tag.length > 0" @click="$EventBus.$emit('search', tag)">{{'#'+tag}}</a>
                </span>
            </div>
            <div class="reply-comp-reply" v-for="reply in unsolvedQuestions" :key="reply.reply_idx" >                
                    <span class="reply-comp-writer">{{reply.reply_writer}}</span>
                    <span class="reply-comp-date">{{new Date(reply.replyDate).toLocaleString()}}</span><br>
                    <span class="reply-comp-replycontent">{{reply.reply_content}}</span>
            </div>
        </div>
        <div class='reply-comp-send'>
            <textarea type="text" class='reply-comp-send-input' placeholder="답변하기 >>" v-model="reply" @keyup.enter="sendReply(unsolvedQuestion)"></textarea>
        </div>
    </div>
</template>

<script>
export default {
    created(){
        this.setQuestion(null)
    },
    data(){
        return {
            question: {},
            ready: false,
            isScrap: false,
            scraps: [],
            reply: '',
            reply_writer : [],
            reply_content : [],
            unsolvedQuestions:'',
            unsolvedQuestion:'',
        }
    },
    methods: {
        setQuestion(re){
        this.setScrap()
        this.$http.get(`http://52.79.204.244/question/unsolved/random`) 
        .then(response => { 
            this.$http({
                method: 'post',
                url: `http://52.79.204.244/question/unsolved/reply/list`,  
                data: { id : response.data.id}
            }).then(response => {
                this.unsolvedQuestions = response.data
            })
                const i = response.data
                i.date = new Date(i.date).toLocaleString()
                i.content = i.content.split('<br/>').join('\n')
                if(i.tags != null) i.tags = i.tags.split('#')
                this.question=i
                if(this.scraps.includes(this.question.id + '')) this.isScrap = true
                else this.isScrap = false
                this.ready = true
                if(re){
                    document.querySelector('.reply-main code').innerText = this.question.content
                    document.querySelector('.reply-main code').className =  ''
                }
                setTimeout(()=>{        
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block)
                })
                }, 100);  
            })
        },
        setScrap(){
        if(this.$store.state.memberScraps != null){
            this.$store.state.memberScraps.forEach(scrap => {
                this.scraps.push(scrap.link.replace("http://52.79.204.244/question/unsolved/find/", ''))
            })
        }
        },
        sendReply(unsolvedQuestion){
            if(this.$store.state.mem_idx != null){
                this.$http({
                    method:'post',
                    url:`http://52.79.204.244/question/unsolved/reply`,
                    data:{
                        reply_content : this.reply,
                        reply_writer : this.$store.state.nickname,
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx,
                        id : this.question.id           
                    }
                }).then(response => {
                    this.unsolvedQuestions.push(response.data)
                    this.reply = ''
                });
            }else{
                alert('비회원은 댓글을 달 수 없습니다.');
            }        
        },
        scrap(question){
            if(this.$store.state.memberScraps == null){
                alert('로그인이 필요한 서비스입니다.')
                return
            }
            if(this.isScrap){                
                this.$http({
                    method: 'delete',
                    url: `http://52.79.204.244/scrap`,
                    data: {
                        link: 'http://52.79.204.244/question/unsolved/find/' + question.id,
                        title: question.title
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx
                    }

                }).then(response => {}).finally(() => {
                    this.$EventBus.$emit('refreshMember')
                })
            } else {
                this.$http({
                    method: 'post',
                    url: `http://52.79.204.244/scrap`,
                    data: {
                        link: 'http://52.79.204.244/question/unsolved/find/' + question.id,
                        title: question.title
                    },
                    params:{
                        mem_idx : this.$store.state.mem_idx
                    }
                }).then(response => {}).finally(() => {
                    this.$EventBus.$emit('refreshMember')
                })            
            }
            this.isScrap = !this.isScrap
        }
    },
}
</script>
