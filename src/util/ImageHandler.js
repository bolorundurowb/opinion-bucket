import Config from '../config/Config';

/**
 * Holds shared logic
 */
class ImageHandler {
  /**
   * Uploads an image to cloudinary
   * @param {Object} file
   * @return {Promise<String>} the picture payload
   */
  static uploadImage(file) {
    /* istanbul ignore next */
    return new Promise((resolve) => {
      if (!file) {
        resolve('');
      } else {
        let payload = '';
        if (typeof file === 'string') {
          payload = file;
        } else {
          payload = file.path;
        }
        Config.cloudinary.uploader.upload(payload, (result) => {
          resolve(result.url);
        });
      }
    });
  }
}

export default ImageHandler;
