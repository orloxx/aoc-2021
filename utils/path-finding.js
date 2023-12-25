export default class Graph {
  constructor(tree) {
    this.tree = tree || {}
    this.isVisited = {}
    this.pathList = []
    this.allPaths = []
  }

  addEdge(start, end) {
    if (!this.tree[start]) this.tree[start] = []
    this.tree[start].push(end)
  }

  traverse(node, end) {
    // Store node in local path
    this.pathList.push(node)

    // if match found no need to traverse more
    if (node === end) {
      // Add path to all paths
      this.allPaths.push(this.pathList.slice())
      return
    }

    // mark current node
    this.isVisited[node] = true

    // loop through all neighbours
    for (let i = 0; i < this.tree[node].length; i++) {
      const neighbor = this.tree[node][i]

      if (!this.isVisited[neighbor]) {
        // recursively traverse all paths
        this.traverse(neighbor, end)

        // remove current node from local path
        this.pathList.splice(this.pathList.indexOf(neighbor), 1)
      }
    }

    // mark current node as unvisited
    this.isVisited[node] = false
  }
}
