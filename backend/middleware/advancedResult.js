const advancedResults = (Model, populate) => async (req, res, next) =>{
    let query

    // copy requests
    let reqQuery = {...req.query}

    // Fields to exclude
    const removeFields = ['select', 'sort','page', 'limit']
    // loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    query = Model.find(JSON.parse(queryStr))

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
    const total = await Model.countDocuments()

    query = query.skip(startIndex).limit(limit)

    if (populate) {
        query = query.populate(populate)
    }

    // exicuting query
    const results = await query

    // pagination result
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }
    res.advancedResults = {
        succues: true,
        count: results.length,
        pagination,
        data: results
    }

    next()
}

module.exports = advancedResults