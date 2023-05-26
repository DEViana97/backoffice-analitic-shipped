import { storage } from "../firebaseConfig";

export async function getImages() {
  // const imagesArr = [];

  const refColection = storage.ref();
  const day26 = refColection.child("02");
  const listImages = await day26.listAll();

  const links = await Promise.all(
    listImages.items.map(async (item) => {
      const downloadURL = await item.getDownloadURL();
      return downloadURL;
    })
  );
  return links;
}
