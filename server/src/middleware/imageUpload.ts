import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const uploadImage = upload.single('image');