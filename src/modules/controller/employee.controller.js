const EmployeeService = require(`../service/employee.service`);

class EmployeeController {

    async findByID(req, res) {
        const data = await EmployeeService.findByID(req.params.organizationId, req.params.employeeId)

        if(!data?.employee_id) return res.status(404).json(`Not Found`)

        res.json(data)
    }

    async findAllByOrganizationId(req, res) {
        const data = await EmployeeService.findAllByOrganizationId(req.params.organizationId)

        res.json(data)
    }

    async findAllByProjectId(req, res) {
        const data = await EmployeeService.findAllByProjectId(req.params.organizationId, req.params.projectId)

        res.json(data)
    }

    async create(req, res) {
        const data = await EmployeeService.create(req.params.organizationId, req.body)

        res.status(201).json(data)
    }

    async update(req, res) {
        const data = await EmployeeService.update(req.params.organizationId, req.params.employeeId, req.body)

        res.json(data)
    }

    async deleteByID(req, res) {
        await EmployeeService.deleteByID(req.params.organizationId, req.params.employeeId)

        res.status(204).json()
    }

    async findAllByName(req, res) {
        const { name } = req.body
        const data = await EmployeeService.findAllByName(req.params.organizationId, name)

        res.json(data)
    }

}

module.exports = new EmployeeController()