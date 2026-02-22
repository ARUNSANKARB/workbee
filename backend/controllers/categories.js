import { ServiceCategory } from '../models/index.js';
import { successResponse, errorResponse, getPaginationParams } from '../utils/helpers.js';

// @route   POST /api/categories
// @desc    Create service category
// @access  Private (admin)
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image } = req.body;

    const existingCategory = await ServiceCategory.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });

    if (existingCategory) {
      return errorResponse(res, 'Category exists', 'Category already exists', 409);
    }

    const category = await ServiceCategory.create({
      name,
      description,
      icon,
      image,
    });

    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    errorResponse(res, error, 'Failed to create category', 500);
  }
};

// @route   GET /api/categories
// @desc    Get all categories with filters
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { isActive = true, page = 1, limit = 10, search } = req.query;
    const { skip } = getPaginationParams({ page, limit });

    const query = {};

    if (isActive) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const categories = await ServiceCategory.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ServiceCategory.countDocuments(query);

    return successResponse(res, {
      categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch categories', 500);
  }
};

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ServiceCategory.findById(id);

    if (!category) {
      return errorResponse(res, 'Category not found', 'Category not found', 404);
    }

    return successResponse(res, category);
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch category', 500);
  }
};

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (admin)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, image, isActive } = req.body;

    const category = await ServiceCategory.findByIdAndUpdate(
      id,
      { name, description, icon, image, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return errorResponse(res, 'Category not found', 'Category not found', 404);
    }

    return successResponse(res, category, 'Category updated successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to update category', 500);
  }
};

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (admin)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ServiceCategory.findByIdAndDelete(id);

    if (!category) {
      return errorResponse(res, 'Category not found', 'Category not found', 404);
    }

    return successResponse(res, {}, 'Category deleted successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to delete category', 500);
  }
};
