<template>
    <div class="noticeMain">
        <div class="compHead">
            <div class="notice-tab">
                <ul>
                    <li :class="{'notice-tab-clicked' : tab_main}" @click="clickTab(1)">OWL</li>
                    <li :class="{'notice-tab-clicked' : tab_skills}" @click="clickTab(3)">SKILLS</li>
                    <li :class="{'notice-tab-clicked' : tab_contact}" @click="clickTab(4)">ABOUT US</li>
                    <li :class="{'notice-tab-clicked' : tab_aboutUs}" @click="clickTab(2)">CREDITS</li>
                </ul>
            </div>
        </div>
        <div class="notice-wrap">
            <div class="notice-mapper" v-if="tab_main" @click="$EventBus.$emit('showPortfolio', 0)">
                <span class="notice-span notice-big">
                    OWL
                </span>
                <span class="notice-span notice-small">
                    PORTFOLIO
                </span>
            </div>
            <div class="notice-aboutus" v-if="tab_aboutUs" @click="$EventBus.$emit('showPortfolio', 3)">
                    <div class="notice-credits-main">
                        <div class="notice-credits-wrap">
                            <div class="notice-credits-noise-wrap">
                                <div class="notice-credits-noise"></div>
                                <div class="notice-credits-title">CREDITS</div>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="notice-skills" v-if="tab_skills" @click="$EventBus.$emit('showPortfolio', 2)">
                <div class="notice-contents">
                    <div class="notice-circle" v-for="(skill, index) in skills" :key="skill">
                        <img v-bind:src="skillImgs[index]" :alt="skill">
                        <span v-html="skill" class="notice-boxtitle">{{skill}}</span>
                    </div>
                    <div class="notice-circle">
                        <i class="fas fa-ellipsis-h"></i>
                        <span class="notice-boxtitle">More...</span>
                    </div>
                </div>
            </div>
            <div class="notice-contact notice-contents" v-if="tab_contact" @click="$EventBus.$emit('showPortfolio', 1)">
                <div class="notice-1 notice-box">
                    <img v-bind:src="img_kang" alt="kang">
                    <span class="notice-boxtitle">강수정</span>
                </div>
                <div class="notice-2 notice-box">
                    <img v-bind:src="img_kwon" alt="kwon">
                    <span class="notice-boxtitle">권용재</span>
                </div>
                <div class="notice-3 notice-box">
                    <img v-bind:src="img_lee" alt="lee">
                    <span class="notice-boxtitle">이양헌</span>
                </div>
                <div class="notice-4 notice-box">
                    <img v-bind:src="img_choi" alt="choi">
                    <span class="notice-boxtitle">최철웅</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tab_main: true,
            tab_aboutUs: false,
            tab_skills: false,
            tab_contact: false,
            img_kang: "https://image.flaticon.com/icons/svg/1538/1538412.svg",
            img_kwon: "https://image.flaticon.com/icons/svg/1538/1538414.svg",
            img_lee: "https://image.flaticon.com/icons/svg/1538/1538415.svg",
            img_choi: "https://image.flaticon.com/icons/svg/1538/1538416.svg",
            skills: ['java', 'eleastic<br/>Search', 'springboot', 'mongoDB', 'vue.js', 'node.js', 'mariaDB'],
            skillImgs: ['http://wiki.hash.kr/images/thumb/b/bb/%EC%9E%90%EB%B0%94_%EB%A1%9C%EA%B3%A0.png/200px-%EC%9E%90%EB%B0%94_%EB%A1%9C%EA%B3%A0.png',
            'https://cdn.freebiesupply.com/logos/large/2x/elastic-elasticsearch-logo-png-transparent.png',
            'https://mcgivrer.files.wordpress.com/2016/02/spring-boot-project-logo.png?w=300',
            'http://linux.systemv.pe.kr/wp-content/uploads/2016/06/mongodb.png',
            'https://vuejs.org/images/logo.png',
            'https://t1.daumcdn.net/cfile/tistory/9983CC475C9B21AD0E',
            'https://t1.daumcdn.net/cfile/tistory/99FB99345C91D6342D']
        }
    },
    methods:{
        clickTab(num){
            this.tab_main = false; this.tab_aboutUs = false; this.tab_skills = false, this.tab_contact = false;
             if(num === 4) this.tab_contact = true 
             else if(num === 3) this.tab_skills = true
             else if(num === 2) this.tab_aboutUs = true
             else this.tab_main = true
        }
    },
}
</script>
