const ProjectService = require(`../service/project.service`);

class ProjectController {

    async findByID(req, res) {
        const data = await ProjectService.findByID(req.params.organizationId, req.params.type, req.params.projectId)

        if(!data?.project_id) return res.status(404).json(`Not Found`)

        res.json(data)
    }

    async findAllByOrganizationId(req, res) {
        const data = await ProjectService.findAllByOrganizationId(req.params.organizationId)

        res.json(data)
    }

    async findAllByType(req, res) {
        const data = await ProjectService.findAllByType(req.params.organizationId, req.params.type)

        res.json(data)
    }

    async findAllByEmployeeId(req, res) {
        const data = await ProjectService.findAllByEmployeeId(req.params.organizationId, req.params.employeeId)

        res.json(data)
    }

    async create(req, res) {
        const data = await ProjectService.create(req.params.organizationId, req.body)

        res.status(201).json(data)
    }

    async update(req, res) {
        const data = await ProjectService.update(req.params.organizationId, req.params.type, req.params.projectId, req.body)

        res.json(data)
    }

    async deleteByID(req, res) {
        await ProjectService.deleteByID(req.params.organizationId, req.params.type, req.params.projectId)

        res.status(204).json()
    }

    async assignEmployee(req, res) {
        const data = await ProjectService.assignEmployee(req.params.organizationId, req.params.type, req.params.projectId, req.params.employeeId)

        if(!data?.project_id) return res.status(404).json(`Not Found`)

        res.status(201).json(data)
    }

    async findAllByName(req, res) {
        const { name } = req.body
        const data = await ProjectService.findAllByName(req.params.organizationId, name)

        res.json(data)
    }

}

module.exports = new ProjectController()