const tf = require('@tensorflow/tfjs');

function prepareData(historicalData) {
    const inputs = [];
    const outputs = [];

    historicalData.forEach((data, index) => {
        if (index > 0) {
            inputs.push([index]);
            outputs.push(data.totalExpense);
        }
    });

    return {
        inputs: tf.tensor2d(inputs, [inputs.length, 1]),
        outputs: tf.tensor2d(outputs, [outputs.length, 1]),
    };
}

async function trainModel(inputs, outputs) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    
    await model.fit(inputs, outputs, { epochs: 100 });
    return model;
}

async function predictExpenses(historicalData) {
    const { inputs, outputs } = prepareData(historicalData);
    const model = await trainModel(inputs, outputs);

    const nextMonthIndex = historicalData.length;
    const prediction = model.predict(tf.tensor2d([[nextMonthIndex]], [1, 1]));
    const result = await prediction.data();

    return result[0];
}

module.exports = { predictExpenses };
