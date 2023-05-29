import { storage } from "../firebaseConfig";

export async function getImages(subdirectory) {
  const refColection = storage.ref();
  const subdirectoryRef = refColection.child(subdirectory);
  const listImages = await subdirectoryRef.listAll();

  const links = await Promise.all(
    listImages.items.map(async (item) => {
      const downloadURL = await item.getDownloadURL();
      return downloadURL;
    })
  );
  return links;
}
