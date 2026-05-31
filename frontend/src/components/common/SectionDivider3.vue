<template>
  <div class="blueprint-framework">
    <slot />
  </div>
</template>

<style scoped>
.blueprint-framework {
  position: relative;
  border-left: 1px solid #bbb;
  border-right: 1px solid #bbb;
  border-bottom: 1px solid #bbb;
  margin: 2rem;
}

.blueprint-framework::before {
  content: "+";
  position: absolute;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  color: #555;
  z-index: 2;
  background: #fff;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: -13px;
  left: -13px;
}

.blueprint-framework::after {
  content: "+";
  position: absolute;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  color: #555;
  z-index: 2;
  background: #fff;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: -13px;
  right: -13px;
}

@media (max-width: 768px) {
  .blueprint-framework {
    margin: 1rem;
  }
}
</style>
