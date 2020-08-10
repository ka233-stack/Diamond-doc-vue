<template>
  <div>
    <h1>Hello,{{ msg }}!</h1>
  </div>
</template>

<script>
export default {
  name: 'HW',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
