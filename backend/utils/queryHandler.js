const queryHandler = (req) => {
    // copy requests
    let reqQuery = {...req.query}

    // Fields to exclude
    const removeFields = ['select', 'sort','page', 'limit']
    // loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    queryStr = JSON.parse(queryStr)
    // console.log(queryStr)
    return queryStr
}

module.exports = queryHandler