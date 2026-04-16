function setRoutes(fastify, routesList) {
  routesList.forEach(route => {
    const { path, method, cb, settings } = route
    fastify[method](path, settings ?? {}, cb)
  })
}

export default setRoutes