const { Router } = require('express');

const routes = new Router();
const projects = [];

/**
 * Middleware
 * Log de requisições para contar quantas requisições foram feitas
 */
routes.use((req, res, next) => {
  console.count("Contagem de requisições");
  next();
})

/**
 * lista todos os projetos e suas tarefas
 */

routes.get('/projects', (req, res) => {
  return res.json(projects);
})

/**
 * Route - Cadstra projeto
 * Body: id - Código do projeto
 *       title - nome do projeto
 */

routes.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
})

/**
 * Route - Atualiza titulo do projeto 
 * Params: id - Código do projeto
 * Body: title - nome do projeto
 */
routes.put('/projects/:id', verificaProjeto, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(param => param.id == id);

  project.title = title;

  return res.json(projects);
})

/**
 * Route - Apaga projeto existente
 * Params: id - Id do projeto
 */

routes.delete('/projects/:id', verificaProjeto, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(param => param.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
})

/**
 * Route - Insere tarefas ao projeto já existente
 * Params: id - Id do projeto
 * Body: task - nome da tarefa do projeto
 */
routes.post('/projects/:id/tasks/', verificaProjeto, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(param => param.id == id);
  
  project.tasks.push(task);

  return res.json(projects);
})

/**
 * Middleware
 * Validação da existencia do projeto
 */
function verificaProjeto(req, res, next) {
  const { id } = req.params;
  const project = projects.find( param => param.id == id);

  if (!project) {
    return res.status(400).json({erro: 'Project not found'});
  }
  return next();
}

module.exports = routes;