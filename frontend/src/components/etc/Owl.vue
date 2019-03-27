<template>
<div class="modal-wrap">
    <div class="mapper-main">
        <div class="compHead"></div>
        <div class="Owl-contents">
            <AboutOwl v-if="AboutOwl"/>
            <AboutUs v-if="aboutus"/>
            <Skills v-if="skills"/>
            <Contact v-if="contact"/>
        </div>
        <div class="prev-next-container">
            <div class="mapper-prev" @mouseover="showPrev = true" @mouseleave="showPrev = false">
                <div class="mapper-prev-hidden" v-if="showPrev && prev">
                    <div class="mapper-prev-hidden-icon">
                        <i class="fas fa-angle-left" @click="movePage(-1)"></i>
                    </div>
                </div>
            </div>
            <div class="mapper-next" @mouseover="showNext = true" @mouseleave="showNext = false">
                <div class="mapper-next-hidden" v-if="showNext && next">
                    <div class="mapper-next-hidden-icon">
                        <i class="fas fa-angle-right" @click="movePage(1)"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import AboutOwl from './AboutOwl'
import AboutUs from './AboutUs'
import Skills from './Skills'
import Contact from './Contact'

export default {
    created(){
        if(this.code === 0) this.AboutOwl = true
        else if(this.code === 1) this.aboutus = true
        else if(this.code === 2) this.skills = true
        else this.contact = true
        this.pos = this.code
        setTimeout(() => {
            if(this.code > 0) this.prev = true
            if(this.code < 3) this.next = true
        }, 2000)
    },
    props: ['code'],
    components:{
        'AboutUs' : AboutUs,
        'Skills' : Skills,
        'Contact' : Contact,
        'AboutOwl' : AboutOwl
    },
    data(){
        return{
            AboutOwl: false,
            aboutus: false,
            skills: false,
            contact: false,
            showPrev: false,
            showNext: false,
            pos: 0,
            prev : false,
            next : false,
        }
    },
    methods: {
        movePage(num){
            this.pos += num
            if(this.pos > 0) this.prev = true
            else this.prev = false

            if(this.pos === 3) this.next = false
            else this.next = true

            this.AboutOwl = false
            this.aboutus = false
            this.skills = false
            this.contact = false
            if(this.pos === 0) this.AboutOwl = true
            else if(this.pos === 1) this.aboutus = true
            else if(this.pos === 2) this.skills = true
            else this.contact = true
        },
    },
}
</script>
