<template lang="html">
   <div class="page">
        <div class="page-body page-home">
        	here is home xxxxxxasdf
        </div>
   </div>
</template>
<script type="text/babel">
    import {mapActions, mapState, mapGetters} from 'vuex';
    import emitter from '../../../../common/mixins/emitter';
    import appConf from '../../../../config';
    import {format} from 'lib/date';
    export default {
        name: 'home',
        mixins: [emitter],
        data() {
            return {
                loaded: false
            };
        },
        components: {

        },
        methods: {

        },
        created () {

        },
        mounted() {

        }
    };
</script>
