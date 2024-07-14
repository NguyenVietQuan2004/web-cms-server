import { storesModal } from '../Models/StoreModel.js';

//   [POST] /store
export const createStore = async (req, res) => {
    try {
        const newStoreFromClient = req.body;
        if (!req.body.name) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Missing name store.',
                ok: false,
                data: null,
            });
        }
        const nameExist = await storesModel.find({
            name: newStoreFromClient.name,
            userId: req.body.userId,
        });
        if (nameExist) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Name store is already exist.',
                ok: false,
                data: null,
            });
        }
        const store = await storesModel(newStoreFromClient);
        await store.save();
        res.status(200).json({
            data: store,
            message: 'Create success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(400).json({
            data: error,
            statusCode: 400,
            message: 'Something went wrong. Create store failed.',
            ok: false,
        });
    }
};
