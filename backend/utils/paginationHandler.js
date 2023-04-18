const paginationHandler = (query, req) => {
    // Select fields
    if (req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else {
        query = query.sort('-createdAt')
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    query = query.skip(startIndex).limit(limit)
    return {result: query, startIndex: startIndex, endIndex: endIndex, page: page, limit: limit}
}

module.exports = paginationHandler