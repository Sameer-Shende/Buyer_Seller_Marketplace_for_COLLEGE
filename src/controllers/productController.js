exports.getProducts = (req, res) => {
    res.render('index');
};

exports.createProduct = (req, res) => {
    res.render('create_product');
};

exports.createLostProduct = (req, res) => {
    res.render('create_lost_product');
};

exports.createNeededProduct = (req, res) => {
    res.render('create_needed_product');
};
