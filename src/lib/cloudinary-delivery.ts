export function getCloudinaryDeliveryUrl(
  url: string,
  transformation = "f_auto,q_auto",
) {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:" || parsed.hostname !== "res.cloudinary.com") {
      return url;
    }

    return url.replace("/image/upload/", `/image/upload/${transformation}/`);
  } catch {
    return url;
  }
}
