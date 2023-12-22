export default class Graph {
  constructor(graph) {
    this.graph = graph || {}
    this.isVisited = {}
    this.pathList = []
    this.allPaths = []
  }

  addEdge(start, end) {
    if (!this.graph[start]) this.graph[start] = []
    this.graph[start].push(end)
  }

  traverse(node, end) {
    // Store node in local path
    this.pathList.push(node)

    // if match found no need to traverse more
    if (node === end) {
      // Add path to all paths
      if (
        !this.allPaths.find((path) => path.join('') === this.pathList.join(''))
      )
        this.allPaths.push(this.pathList.slice())
      return
    }

    // mark current node
    this.isVisited[node] = true

    // loop through all neighbours
    for (let i = 0; i < this.graph[node].length; i++) {
      const neighbor = this.graph[node][i]

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
