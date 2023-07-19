import { storage } from "../firebaseConfig";

export async function getImages(
  anoSelecionado,
  monthSelected,
  daySelected,
  typeEvent
) {
  const refColection = storage.ref();
  const year = refColection.child(anoSelecionado);
  const mounth = year.child(monthSelected);
  const day = mounth.child(daySelected);
  const type = day.child(typeEvent);

  const listImages = await type.listAll();

  const links = await Promise.all(
    listImages.items.map(async (item) => {
      const downloadURL = await item.getDownloadURL();
      return downloadURL;
    })
  );
  return links;
}
