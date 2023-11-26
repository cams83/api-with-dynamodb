const OrganizationController = require('../modules/controller/organization.controller');
const ProjectController = require('../modules/controller/project.controller');
const EmployeeController = require('../modules/controller/employee.controller');

module.exports = async (app) => {
    app.get('/api/v1/organizations/:organizationId', OrganizationController.findByID);
    app.post('/api/v1/organizations', OrganizationController.create);
    app.patch('/api/v1/organizations/:organizationId', OrganizationController.update);
    app.delete('/api/v1/organizations/:organizationId', OrganizationController.deleteByID);    
    //Find agile projects
    //Find fixed-bid projects
    //Find on-hold projects
    app.get('/api/v1/projects/:organizationId/type/:type', ProjectController.findAllByType);
    //Find all the projects an employee is part of
    app.get('/api/v1/projects/:organizationId/employee/:employeeId', ProjectController.findAllByEmployeeId);    
    app.get('/api/v1/projects/:organizationId/:type/:projectId', ProjectController.findByID);
    //Find all the projects of an organization
    app.get('/api/v1/projects/:organizationId', ProjectController.findAllByOrganizationId);    
    app.post('/api/v1/projects/:organizationId', ProjectController.create);
    app.patch('/api/v1/projects/:organizationId/:type/:projectId', ProjectController.update);
    app.delete('/api/v1/projects/:organizationId/:type/:projectId', ProjectController.deleteByID);
    //Assign an employee to a project
    app.put('/api/v1/projects/:organizationId/:type/:projectId/assign/:employeeId', ProjectController.assignEmployee);
    //Find projects by name
    app.post('/api/v1/projects/:organizationId/find', ProjectController.findAllByName);
    //Find the employees assigned to a project
    app.get('/api/v1/employees/:organizationId/project/:projectId', EmployeeController.findAllByProjectId);
    app.get('/api/v1/employees/:organizationId/:employeeId', EmployeeController.findByID);
    //Find all the employees of an organization
    app.get('/api/v1/employees/:organizationId', EmployeeController.findAllByOrganizationId);
    app.post('/api/v1/employees/:organizationId', EmployeeController.create);
    app.patch('/api/v1/employees/:organizationId/:employeeId', EmployeeController.update);
    app.delete('/api/v1/employees/:organizationId/:employeeId', EmployeeController.deleteByID);
    //Find employees by name
    app.post('/api/v1/employees/:organizationId/find', EmployeeController.findAllByName);
};