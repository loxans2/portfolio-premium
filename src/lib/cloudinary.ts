import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadImage(
  buffer: Buffer,
  folder = "portfolio"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(buffer);
  });
}

/**
 * Génère une URL signée Cloudinary expirante (auth_token) pour un asset privé.
 * Si l'URL n'est pas Cloudinary, retourne null (le caller utilisera l'URL brute).
 */
export function signCloudinaryUrl(rawUrl: string, ttlSec = 900): string | null {
  if (!rawUrl?.includes("res.cloudinary.com")) return null;
  if (!process.env.CLOUDINARY_API_SECRET) return null;
  try {
    const match = rawUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;
    const publicId = match[1].replace(/\.[^.]+$/, "");
    return cloudinary.utils.private_download_url(publicId, "auto", {
      expires_at: Math.floor(Date.now() / 1000) + ttlSec,
    });
  } catch {
    return null;
  }
}
