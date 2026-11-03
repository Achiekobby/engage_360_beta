import * as Yup from 'yup';

const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\s\-_'&()/]*$/;

export const createCategorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Category name is required')
    .min(2, 'Use at least 2 characters')
    .max(80, 'Keep the name under 80 characters')
    .matches(NAME_PATTERN, 'Use letters, numbers, spaces, or - _ \' & ( ) /'),
  description: Yup.string()
    .trim()
    .required('Description is required')
    .min(10, 'Add a short description of at least 10 characters')
    .max(500, 'Keep the description under 500 characters'),
});

export const createCollectionSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Collection name is required')
    .min(2, 'Use at least 2 characters')
    .max(80, 'Keep the name under 80 characters')
    .matches(NAME_PATTERN, 'Use letters, numbers, spaces, or - _ \' & ( ) /'),
});
