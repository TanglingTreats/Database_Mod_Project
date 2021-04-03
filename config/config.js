module.exports = function() {
    switch(process.env.NODE_ENV) {
        case 'sql':
            break;
        case 'nosql':
            break;
        default:
            return "No settings found"

    }

}