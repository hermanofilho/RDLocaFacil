import { db, storage } from './config';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// CLIENTES
export const getClients = async () => {
  const snap = await getDocs(collection(db, 'clients'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// MOTOS
export const getMotorcycles = async () => {
  const snap = await getDocs(collection(db, 'motorcycles'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// VISTORIAS
export const getVistorias = async () => {
  const q = query(collection(db, 'vistorias'), orderBy('data_vistoria'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// UPLOAD DE ARQUIVO
export const uploadArquivo = async (pasta: string, file: File) => {
  const fileRef = ref(storage, `${pasta}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};

// SALVAR MULTA
export const salvarMulta = async (dados: any) => {
  return await addDoc(collection(db, 'multas'), dados);
};