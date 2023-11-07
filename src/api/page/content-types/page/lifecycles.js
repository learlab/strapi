const text = require("../../../text/controllers/text");

module.exports = {
    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        const existingData = await strapi
            .entityService.findOne("api::page.page", where.id, {
                populate: ["Content"],
            })
        for (let component of existingData.Content) {
            console.log(component)
            strapi
                .service('plugin::auto-content.cleanTextService')
                .cleanText(component.Text)
                .then((text) => {
                    strapi.query('page.chunk').update({
                        where: { id: component.id },
                        data: {
                            CleanText: String(text)
                        }
                    })
                })
            strapi
                .service('plugin::auto-content.mdxService')
                .mdx(component.Text)
                .then((mdx) => {
                    strapi.query('page.chunk').update({
                        where: { id: component.id },
                        data: {
                            MDX: mdx
                        }
                    })
                })
        }
    }
};
