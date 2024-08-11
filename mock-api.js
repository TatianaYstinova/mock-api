const jsonServer = require('json-server');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json')

const handlers = {
    // ['/favorites']: {
    //     GET: (request, response) => {
    //         setTimeout(() => response.json(response.locals.data), 20000);
    //     }
    // }
}

router.render=(request,response)=>{ 
    console.log(request);
    const {method, path} = request

    const handler = handlers[path]?.[method]

    if(handler){
        handler(request, response)
    }else{
        response.json(response.locals.data)
    }
}

const port = 777;


server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

server.use(router)
server.use([...middlewares]);

server.listen(port, () => {
    console.log(`mock api is stared on port ${port}`);
});

