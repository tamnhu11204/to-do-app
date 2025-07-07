const userRouter = require('./UserRouter')
const taskRouter = require('./TaskRouter')

const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/task', taskRouter)
}

module.exports = routes