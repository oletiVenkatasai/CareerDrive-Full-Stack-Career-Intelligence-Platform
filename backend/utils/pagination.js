

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10)); 
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const paginationResponse = (data, total, page, limit) => ({
  data,
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1,
});

module.exports = { getPagination, paginationResponse };
