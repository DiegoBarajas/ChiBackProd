const PreService =  require('../models/preDevices.model');
const ctr = {}

ctr.getAll = async(req, res) => {
    res.json(await PreService.find());
}

ctr.addOne = async(req, res) => {
    const {alias, name, keywords} = req.body;

    const newPreService = await new PreService({
        alias,
        name,
        keywords
    }).save();

    res.json(newPreService);
}

ctr.update = async(req, res) => {
    const {id} = req.params;
    const {alias, name, keywords} = req.body;

    res.json(
        await PreService.findByIdAndUpdate( id,
            {
                alias,
                name,
                keywords
            }
        )
    );
}

ctr.delete = async(req, res) => {
    const {id} = req.params;

    res.json(await PreService.findByIdAndDelete(id));
}

module.exports = ctr;