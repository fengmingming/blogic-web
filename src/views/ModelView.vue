<script>
import { LogicFlow } from '@logicflow/core'
import "@logicflow/core/dist/style/index.css"

export default {
  mounted() {
    this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: true,
      height: 800
    });
    this.lf.render({
        nodes: [
            {
            id: "1",
            type: "rect",
            x: 100,
            y: 100,
            text: "节点1",
            },
            {
            id: "2",
            type: "circle",
            x: 300,
            y: 200,
            text: "节点2",
            },
        ],
        edges: [
            {
            sourceNodeId: "1",
            targetNodeId: "2",
            type: "polyline",
            text: "连线",
            },
        ],
    })
  }
}
</script>

<template>
    <MainContainer>
        <div class="container" ref="container"></div>
    </MainContainer>
</template>
<style scoped>
</style>