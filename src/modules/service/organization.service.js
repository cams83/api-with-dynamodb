const OrganizationRepository = require(`../repository/organization.repository`);

class OrganizationService {

    async findByID(organizationId) {
        const data = await OrganizationRepository.findByID(organizationId);

        if (!data?.Item) return {};
        
        return {...data.Item, PK: undefined, SK: undefined};
    }

    async create(data) {
        const item = await OrganizationRepository.create({
            name: data.name,
            tier: data.tier,
        });

        return {...item, PK: undefined, SK: undefined};
    }

    async update(organizationId, data) {
        return await OrganizationRepository.update(organizationId, {
            name: data.name,
            tier: data.tier,
        });
    }

    async deleteByID(organizationId) {
        return await OrganizationRepository.deleteByID(organizationId);
    }    

}

module.exports = new OrganizationService()