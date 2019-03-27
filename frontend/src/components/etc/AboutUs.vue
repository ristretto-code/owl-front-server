<template>
    <div class="aboutus-wrap">
            <h2 class="aboutus-maintxt">TEAM SPIDER</h2>
            <hr class="aboutus-hr-grow">
            <div class="aboutus-content">
                    <div class="aboutus-members">
                        <div class="aboutus-member" v-for="member in members_random" :key="member.name">
                            <img src="../../img/sue.jpg" alt="member-photo" v-if="member.name === '강수정'">
                            <img src="../../img/1.jpg" alt="member-photo" v-if="member.name === '권용재'">
                            <img src="../../img/2.jpg" alt="member-photo" v-if="member.name === '이양헌'">
                            <img src="../../img/3.jpg" alt="member-photo" v-if="member.name === '최철웅'">
                            <div class="aboutus-vr"></div>
                            <div class="aboutus-member-info">
                                <div class="aboutus-header">
                                    <span class="aboutus-name">{{member.name}}</span>
                                    <div class="aboutus-contact">
                                        <ul>
                                            <li v-if="member.email != null" @click="copy">
                                                <label for="emailCheckBox1" class="aboutus-contact-CheckBox__label" v-if="member.name === '강수정'"><i class="far fa-envelope"></i></label>
                                                <input type="checkbox" id="emailCheckBox1" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '강수정'">
                                                <label for="emailCheckBox2" class="aboutus-contact-CheckBox__label" v-if="member.name === '권용재'"><i class="far fa-envelope"></i></label>
                                                <input type="checkbox" id="emailCheckBox2" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '권용재'">
                                                <label for="emailCheckBox3" class="aboutus-contact-CheckBox__label" v-if="member.name === '이양헌'"><i class="far fa-envelope"></i></label>
                                                <input type="checkbox" id="emailCheckBox3" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '이양헌'">
                                                <label for="emailCheckBox4" class="aboutus-contact-CheckBox__label" v-if="member.name === '최철웅'"><i class="far fa-envelope"></i></label>
                                                <input type="checkbox" id="emailCheckBox4" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '최철웅'">
                                                <span class="member-email">{{member.email}}</span>
                                                <i style="color:red;font-size:9px;display:none"> copied!</i>
                                            </li>
                                            <li v-if="member.github != null" @click="go(member.github)">
                                                <label for="gitCheckBox1" class="aboutus-contact-CheckBox__label" v-if="member.name === '강수정'"><i class="fab fa-github"></i></label>
                                                <input type="checkbox" id="gitCheckBox1" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '강수정'">
                                                <label for="gitCheckBox2" class="aboutus-contact-CheckBox__label" v-if="member.name === '권용재'"><i class="fab fa-github"></i></label>
                                                <input type="checkbox" id="gitCheckBox2" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '권용재'">
                                                <label for="gitCheckBox3" class="aboutus-contact-CheckBox__label" v-if="member.name === '이양헌'"><i class="fab fa-github"></i></label>
                                                <input type="checkbox" id="gitCheckBox3" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '이양헌'">
                                                <label for="gitCheckBox4" class="aboutus-contact-CheckBox__label" v-if="member.name === '최철웅'"><i class="fab fa-github"></i></label>
                                                <input type="checkbox" id="gitCheckBox4" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '최철웅'">
                                                <span class="member-git">{{member.github}}</span>
                                            </li>
                                            <li v-if="member.blog != null" @click="go(member.blog)">
                                                <label for="blogCheckBox1" class="aboutus-contact-CheckBox__label" v-if="member.name === '이양헌'"><i class="fas fa-blog"></i></label>
                                                <input type="checkbox" id="blogCheckBox1" class="aboutus-contact-CheckBox" name="aboutus-contact-emailCheckBox" v-if="member.name === '이양헌'">
                                                <span class="member-blog">{{member.blog}}</span>
                                            </li>
                                        </ul>
                                        <input type="hidden" class="contact-hidden" v-model="mail">
                                    </div>
                                </div>
                                <hr>
                                <div class="aboutus-tagCt">
                                    <span class="aboutus-tag" v-for="(role, index) in member.role" :key="role + member.name + index">
                                        {{role}}
                                    </span>
                                    <span class="aboutus-tag aboutus-say">{{member.say}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
</template>

<script>
export default {
    data(){
        return{
            show: false,
            next: true,
            members: [{name:'강수정', role: ['백엔드/프론트엔드 개발', 'DB(MariaDB, JPA)', '게시판', '회원 관리'], say:'뽑아주세요', email:'luckiness0805@gmail.com', github: 'https://github.com/sue0805', blog: null}
                    , {name:'권용재', role: ['백엔드 개발', '이것저것', '테스트'], say:'열심히하겠습니다', email: 'rnjs1227@naver.com', github: 'https://github.com/yong1227', blog: null}
                    , {name:'이양헌', role: ['백엔드 개발', '검색엔진구현', '땡땡떙'], say: '화이팅', email: 'maaseik2292@gmail.com', github: 'https://github.com/WickiesLee', blog: 'https://wickies.tistory.com/'}
                    , {name:'최철웅', role: ['프론트엔드 개발', '디자인', '테마', '하드코딩'], say: '더 잘하고 싶다', email: 'endnd28@gmail.com', github: 'https://github.com/ristretto-code', blog: null}],
            mail: '',
        }
    },
    methods: {
        go(link){
            window.open(link, '_blank')
        },
        copy(e){
            // this.mail = e.target.innerText.split('copied!')[0].trim()
            // setTimeout(() => {
            //     document.querySelector('.contact-hidden').select()
            //     document.execCommand('copy')
            //     e.target.lastElementChild.style.display = "inline"
            //     setTimeout(() => {
            //         e.target.lastElementChild.style.display = "none"
            //     }, 300)
            // }, 1)
        }
    },
    computed: {
        members_random(){
            return this.members.sort((a, b) => Math.random() -0.5)
        }
    }
}
</script>