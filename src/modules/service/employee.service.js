const EmployeeRepository = require(`../repository/employee.repository`);

class EmployeeService {

    async findByID(organizationId, employeeId) {
        const data = await EmployeeRepository.findByID(organizationId, employeeId);

        if (!data?.Item) return {};

        return this.getEmployee(data.Item);
    }

    async findAllByOrganizationId(organizationId) {
        const data = await EmployeeRepository.findAllByOrganizationId(organizationId);

        if(!data?.Items) return [];
        
        const items = data.Items.map(item => this.getEmployee(item));
        return items;        
    }

    async findAllByProjectId(organizationId, projectId) {
        const data = await EmployeeRepository.findAllByProjectId(organizationId, projectId);

        if(!data?.Items) return [];

        const items = data.Items.map(item => this.getProjectAndEmployee(item));

        return items;
    }

    async create(organizationId, data) {
        const item = await EmployeeRepository.create(organizationId, {
            name: data.name,
            email: data.email
        });

        return this.getEmployee(item);
    }

    async update(organizationId, employeeId, data) {
        const item = await EmployeeRepository.update(organizationId, employeeId, {
            name: data.name,
            email: data.email
        });
        return {...item, Data: undefined};
    }

    async deleteByID(organizationId, employeeId) {
        return await EmployeeRepository.deleteByID(organizationId, employeeId);
    }

    async findAllByName(organizationId, name) {
        const data = await EmployeeRepository.findAllByName(organizationId, name);

        if(!data?.Items) return [];
        
        const items = data.Items.map(item => this.getEmployee(item));
        return items;
    }

    getEmployee(employee) {
        const {PK, SK} = employee;

        const org_id = PK.split('#')[1];
        const employee_id = SK.split('#')[1];

        return {...employee, PK: undefined, SK: undefined, Data: undefined, org_id, employee_id};
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

module.exports = new EmployeeService()