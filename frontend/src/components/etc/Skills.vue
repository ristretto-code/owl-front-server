<template>
    <div class="skills-wrap">
            <h2 class="skills-maintxt">SKILLS</h2>
            <hr class="skills-hr-grow">
            <div class="skills-content" v-if="show">
                <div class="skills-contents">
                    <div class="skills-circle" v-for="(skill, index) in skills" :key="skill" @click="showClicked(skill)">
                        <img v-bind:src="skillImgs[index]" :alt="skill">
                        <span class="skills-boxtitle">{{skill}}</span>
                    </div>
                </div>
            </div>
            <div class="skills-info" v-if="click !== null">
                <h3>{{click}}</h3>
                <hr>
                <p>{{skillInfo[skills.indexOf(click)]}}</p>
            </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            show: true,
            skills: ['JAVA', 'JPA', 'SPRINGBOOT', 'GRADLE', 'MARIADB', 'MONGODB', 'NODE.JS', 'ELASTICSEARCH', 'PYTHON', 'ES6', 'VUE.JS', 'SASS', 'GITHUB', 'AWS'],
            skillImgs: ['http://wiki.hash.kr/images/thumb/b/bb/%EC%9E%90%EB%B0%94_%EB%A1%9C%EA%B3%A0.png/200px-%EC%9E%90%EB%B0%94_%EB%A1%9C%EA%B3%A0.png',
            'https://t1.daumcdn.net/cfile/tistory/991A86475C91BE1D40',
            'https://mcgivrer.files.wordpress.com/2016/02/spring-boot-project-logo.png?w=300',
            'https://t1.daumcdn.net/cfile/tistory/99237A475C9B21AD1B',
            'https://t1.daumcdn.net/cfile/tistory/99FB99345C91D6342D',
            'http://linux.systemv.pe.kr/wp-content/uploads/2016/06/mongodb.png',
            'https://t1.daumcdn.net/cfile/tistory/9983CC475C9B21AD0E',
            'https://cdn.freebiesupply.com/logos/large/2x/elastic-elasticsearch-logo-png-transparent.png',
            'https://t1.daumcdn.net/cfile/tistory/99D1D84D5C91FE420C',
            'https://t1.daumcdn.net/cfile/tistory/99C70F335C91D93331',
            'https://vuejs.org/images/logo.png',
            'https://sass-lang.com/assets/img/styleguide/color-1c4aab2b.png',
            'https://image.flaticon.com/icons/svg/25/25231.svg',
            'https://mindfieldconsulting.com/wp-content/uploads/2018/07/aws-logo.png',
            ],
            click: null,
            skillInfo: ['데이터 크롤링', 'DB 프레임워크로 사용', '백엔드 Rest Server 빌드', 'gradle 빌드', '회원 정보 저장 및 게시판', 'Data 수집', '검색 기능 구현', 'View 페이지 제작', '데이터 크롤링',
                        '컴포넌트 기능 구현', 'Front Server 빌드', 'STYLE 작성', '팀 작업 공유', '배포']
        }
    },
    methods: {
        showClicked(skill){
            this.click = skill
        }
    }
}
</script>
