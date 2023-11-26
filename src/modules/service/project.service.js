const ProjectRepository = require(`../repository/project.repository`);
const EmployeeService = require(`./employee.service`);

class ProjectService {

    async findByID(organizationId, type, projectId) {
        const data = await ProjectRepository.findByID(organizationId, type, projectId);

        if (!data?.Item) return {};

        return this.getProject(data.Item);
    }

    async findAllByOrganizationId(organizationId) {
        const data = await ProjectRepository.findAllByOrganizationId(organizationId);

        if(!data?.Items) return [];
        
        const items = data.Items.map(item => this.getProject(item));
        return items;     
    }

    async findAllByType(organizationId, type) {
        const data = await ProjectRepository.findAllByType(organizationId, type);

        if(!data?.Items) return [];
        
        const items = data.Items.map(item => this.getProject(item));
        return items;     
    }


    async findAllByEmployeeId(organizationId, employeeId) {
        const data = await ProjectRepository.findAllByEmployeeId(organizationId, employeeId);

        if(!data?.Items) return [];
        
        const items = data.Items.map(item => this.getProjectAndEmployee(item));
        return items;
    }

    async create(organizationId, data) {
        const item = await ProjectRepository.create(organizationId, {
            name: data.name,
            type: data.type
        });

        return this.getProject(item);
    }

    async update(organizationId, type, projectId, data) {
        const item = await ProjectRepository.update(organizationId, type, projectId, {
            name: data.name
        });
        return {...item, Data: undefined};
    }

    async deleteByID(organizationId, type, projectId) {
        return await ProjectRepository.deleteByID(organizationId, type, projectId);
    }

    async assignEmployee(organizationId, type, projectId, employeeId) {
        const project = await this.findByID(organizationId, type, projectId);

        if(!project?.project_id) return {};

        const employee = await EmployeeService.findByID(organizationId, employeeId);

        if(!employee?.employee_id) return {};

        const item = await ProjectRepository.assignEmployee(organizationId, project.project_id, {
            employeeId: employee.employee_id,
            employeeName: employee.name,
            projectName: project.name,
            dateOf: new Date().toUTCString(),
        });

        return this.getProjectAndEmployee(item);
    }

    async findAllByName(organizationId, name) {
        const data = await ProjectRepository.findAllByName(organizationId, name);

        if(!data?.Items) return [];
        
        const items = data.Items.map(item => this.getProject(item));
        return items;     
    }

    getProject(project) {
        const {PK, SK} = project;

        const org_id = PK.split('#')[1];
        const type = SK.split('#')[1];

        return {...project, PK: undefined, SK: undefined, Data: undefined, org_id, type};
    }

    getProjectAndEmployee(item) {
        const {PK, SK} = item;
        const projectIds = PK.split('#');
        const org_id = projectIds[1];
        const project_id = projectIds[3];
        const employee_id = SK.split('#')[3];
        return {...item, PK: undefined, SK: undefined, org_id, employee_id, project_id};
    }

}

module.exports = new ProjectService()