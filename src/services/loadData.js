const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();

const getAllHistories = async () => {
    const historiesCollection = db.collection('prediction');
    const snapshot = await historiesCollection.get();

    const histories = [];
    snapshot.forEach((doc) => {
        histories.push({ id: doc.id, ...doc.data() });
    });

    return histories;
}
module.exports = { getAllHistories };