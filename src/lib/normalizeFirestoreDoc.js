export const normalizeFirestoreDoc = (docSnap) => {
    const data = docSnap.data();
    const normalized = {
        id: docSnap.id
    }

    Object.keys(data).forEach((key) => {
        const value = data[key];
        if(value?.toDate){
            normalized[key] = value.toDate().toISOString();
        }else{
            normalized[key] = value;
        }
    })
    return normalized;
}