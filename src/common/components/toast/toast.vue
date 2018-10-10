<template>
  <transition name="dd-toast-pop">
    <div class="dd-toast" v-show="visible" :class="customClass" >
      <i class="dd-toast-icon" :class="iconClass" v-if="iconClass !== ''"></i>
      <span class="dd-toast-text" >{{ message }}</span>
    </div>
  </transition>
</template>

<script type="text/babel">
export default {
    props: {
        message: String,
        className: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: 'middle'
        },
        iconClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            visible: false
        };
    },
    computed: {
        customClass() {
            var classes = [];
            switch (this.position) {
            case 'top':
                classes.push('is-placetop');
                break;
            case 'bottom':
                classes.push('is-placebottom');
                break;
            default:
                classes.push('is-placemiddle');
            }
            classes.push(this.className);

            if(this.iconClass == '') {
                classes.push('exclude-icon');
            }
            return classes.join(' ');
        }
    }
};
</script>