<template>
    <div class="contact-wrap">
            <h2 class="contact-maintxt">CREDITS</h2>
            <hr class="contact-hr-grow">
            <Credits class="contact-credits"/>
            <br/>
            <div style="text-align:center">
            <h1>Source Code</h1>
            <a href="https://github.com/WickiesLee/owl-front-server" target="_blank"><h3>https://github.com/WickiesLee/owl-front-server</h3><br/></a>
            <a href="https://github.com/WickiesLee/owl-front-server" target="_blank"><h3>https://github.com/WickiesLee/owl-rest-server</h3><br/></a>
            </div>
        </div>
</template>

<script>
import Credits from './Credits'

export default {
    data(){
        return{
        }
    },
    components:{
        'Credits' : Credits
    }
}
</script>