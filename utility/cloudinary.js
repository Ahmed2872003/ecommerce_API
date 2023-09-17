const cld = require("cloudinary").v2;

const streamifier = require("streamifier");

cld.config({
  cloud_name: process.env.CLD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_SECRET_KEY,
  secure: true,
});

cld.upload_stream = (file, folder, public_id) => {
  if (public_id) public_id = public_id.split("/")[1];

  return new Promise((res, rej) => {
    const upload_stream = cld.uploader.upload_stream(
      { folder, public_id },
      (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res(result.public_id);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(upload_stream);
  });
};

cld.upload_bulk_stream = async (files, folder, public_ids = []) => {
  const promises = [];
  files.forEach((file, index) => {
    promises.push(cld.upload_stream(file, folder, public_ids[index]));
  });

  return await Promise.all(promises);
};

cld.upload_destroy = (public_id) => {
  return new Promise((res, rej) => {
    cld.uploader.destroy(public_id, {}, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      res(result);
    });
  });
};

cld.upload_bulk_destroy = async (public_ids) => {
  const promises = [];

  public_ids.forEach((public_id) =>
    promises.push(cld.upload_destroy(public_id))
  );

  return await Promise.all(promises);
};

module.exports = cld;
