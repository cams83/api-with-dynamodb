const OrganizationService = require(`../service/organization.service`);

class OrganizationController {

    async findByID(req, res) {
        const data = await OrganizationService.findByID(req.params.organizationId)

        if(!data?.org_id) return res.status(404).json(`Not Found`)

        res.json(data)
    }

    async create(req, res) {
        const data = await OrganizationService.create(req.body)

        res.status(201).json(data)
    }

    async update(req, res) {
        const data = await OrganizationService.update(req.params.organizationId, req.body)

        res.json(data)
    }

    async deleteByID(req, res) {
        await OrganizationService.deleteByID(req.params.organizationId)

        res.status(204).json()
    }

}

module.exports = new OrganizationController()