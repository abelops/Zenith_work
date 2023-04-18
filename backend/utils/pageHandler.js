const pageHandler = (total, page, limit) => {
    let pagination = {total: total}
    if (page < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (page > 1) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }
    return pagination
}

module.exports = pageHandler