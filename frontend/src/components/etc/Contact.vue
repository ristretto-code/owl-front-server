<template>
    <div class="contact-wrap">
            <h2 class="contact-maintxt">CREDITS</h2>
            <hr class="contact-hr-grow">
            <Credits class="contact-credits"/>
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