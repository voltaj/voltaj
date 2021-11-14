function getAll(req, res){
    res.json([{id: 1 }, { id:2 }]);
}

function get(req, res){
    res.json({ id: 1 });
}

module.exports = {
    getAll,
    get
}