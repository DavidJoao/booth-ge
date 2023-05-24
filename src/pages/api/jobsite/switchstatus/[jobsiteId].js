const Jobsite = require('../../../../models/jobsite');

export default async function deactivateJobsite (req, res, next) {
    try {
        const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })

        if (!foundJobsite.status) {
            foundJobsite.status = 'active';
            await foundJobsite.save();
          } else {
            foundJobsite.status = foundJobsite.status === 'active' ? 'inactive' : 'active';
            await foundJobsite.save();
          }
        res.json(foundJobsite);

    } catch (err) {
        console.log('Error switching status', err)
    }

    
}