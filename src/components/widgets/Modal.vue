<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">Default Header</slot>
            <span class="modal-options" @click="$emit('close')">X</span>
          </div>
          <div class="modal-body">
            <slot name="body"
              ><img
                src="https://chartio.com/assets/b68ce8/tutorials/charts/grouped-bar-charts/bb383d431c043353205dbf8b632932ac305e4b8659ef46420890fed966653fb0/grouped-bar-bestpractices-2.png"
            /></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="header">
            <span>Title</span>
            <span class="options" @click="$emit('close')">X</span>
          </div>
        </div>
        <div class="modal-body">default body</div>
      </div>
    </div>
  </transition> -->
</template>

<script>
export default {};
</script>
<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  height: 85%;
  width: 85%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-options {
  cursor: pointer !important;
  float: right;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
