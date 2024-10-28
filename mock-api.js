const { KinopoiskDev } = require('@openmoviedb/kinopoiskdev_client');


const TOKEN = 'FC7DN76-PDS41TM-KDFFT9W-1CS9TS9';

const kp = new KinopoiskDev(TOKEN);

const jsonServer = require('json-server');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');
const bodyParser = require('body-parser');
const { request } = require('http');

const handlers = {
  // ['/favorites']: {
  //     GET: (request, response) => {
  //         setTimeout(() => response.json(response.locals.data), 20000);
  //     }
  // },
  ['/movies']: {
    POST: async (request, response) => {

      const res = await kp.movie.getByFilters(request.body);

      response.status(200).send(res);

    },
    GET: async (request, response) => {
      const { id } = request.query;
      // Фильтрация по id
      const res = await kp.movie.getById(id);
      response.status(200).send(res)
    },
  },
  ['/users']: {
    GET: async (request, response) => {
      const user = response.locals.data;
      response.status(200).send(user[0] || null)
    },
    // POST:async (request, response)=>{
    //   const {users}=response.query;
    //   const exisingUser = users.find(user=>user)
    // }
  },
  ['/possible-filter-values']: {
    GET: async (request, response) => {
      const { field } = request.query;
      const res = await kp.movie.getPossibleValuesByField(field);
      response.status(200).send(res);
    }
  }
}



router.render = (request, response) => {
  const { method, path } = request

  const handler = handlers[path]?.[method]

  if (handler) {
    handler(request, response)
  } else {
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

server.use(bodyParser.json());
server.use([...middlewares]);
server.use(router);

server.listen(port, () => {
  console.log(`mock api is stared on port ${port}`);
});

