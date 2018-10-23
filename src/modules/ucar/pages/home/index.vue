<template lang="html">
   <div class="page">
        <div class="page-body page-home">
        	welcome tohere !!!
            <div>{{name}}</div>
            <img src="~images/ucar/nx.png">
        </div>
   </div>
</template>
<script type="text/babel">
    import {mapActions, mapState, mapGetters} from 'vuex';
    import emitter from '../../../../common/mixins/emitter';
    import appConf from '../../../../config';
    import {format, isLeapYear} from 'lib/date';
    import {a} from 'lib/module';
    export default {
        name: 'home',
        mixins: [emitter],
        data() {
            return {
                loaded: false,
                now: format(new Date, 'yyyy-MM'),
                isLeapYear: isLeapYear(new Date),
                name:''
            };
        },
        components: {

        },
        methods: {

        },
        created () {

        },
        mounted() {
            this.name = a();
        }
    };
</script>
<style lang="scss">
    .fullscreen .page-home {
        color:red;
    }
</style>
