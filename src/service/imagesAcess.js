import { storage } from "../firebaseConfig";

export async function getImages(directory, subdirectory) {
  const refColection = storage.ref();
  const directoryRef = refColection.child(directory);
  const subdirectoryRed = directoryRef.child(subdirectory);
  const listImages = await subdirectoryRed.listAll();

  const links = await Promise.all(
    listImages.items.map(async (item) => {
      const downloadURL = await item.getDownloadURL();
      return downloadURL;
    })
  );
  return links;
}
