const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()
    
        console.log("Tensor shape:", tensor.shape);
    
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;
    
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const classes = ['Cancer', 'Non-cancer'];
        let label = classes[classResult];
    
        // Apply threshold logic
        const threshold = 50; // Set your confidence threshold
        if (confidenceScore < threshold) {
            label = 'Non-cancer'; // Default to Non-cancer for low confidence
        }
    
        let suggestion;
    
        if (label === 'Cancer') {
            suggestion = 'Segera periksa ke dokter!'
        } 
        if (label === 'Non-cancer') {
            suggestion = 'Penyakit kanker tidak terdeteksi.'
        }
    
        return { label, suggestion, confidenceScore };
    } catch (eeror) {
        throw new InputError(`Terjadi kesalahan input: ${eeror.message}`)
    }
    
};

module.exports = predictClassification;