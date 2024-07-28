import { ordersModel } from '../Models/OrderModel.js';
import { accountsModel } from '../Models/AccountModel.js';

// {
//     _id:
//     storeId:
//      listProductOrder: [
//         {
//             _id: 'f465e34b-608b-4b1c-be55-0ae9603bbca5',
//             size: 'xxxxxl',
//             color: 'blue',
//         },
//      ]
//     phone
//     adress
//     createAt:
//     updateAt
// }

// [POST] /order
export const createOrder = async (req, res) => {
    try {
        const newOrderFromClient = req.body;
        if (
            !newOrderFromClient.phone ||
            !newOrderFromClient.address ||
            !newOrderFromClient.storeId ||
            !newOrderFromClient.listProductOrder
        ) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information order.',
                ok: false,
                data: null,
            });
        }
        const userExist = await accountsModel.findOne({
            id: req.user,
        });
        if (!userExist) {
            return res.status(403).json({
                statusCode: 403,
                message: 'You are not authenticate.',
                ok: false,
                data: null,
            });
        }
        const order = await ordersModel(newOrderFromClient);
        await order.save();
        res.status(200).json({
            data: order,
            message: 'Create order success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create order failed.',
            ok: false,
        });
    }
};
// [GET] /order/getall

export const getAllOrder = async (req, res) => {
    // const order = await ordersModel({
    //     storeId: '983cb675-2cc0-4c96-93a8-68e627f206bb',
    //     listProductOrder: [
    //         {
    //             _id: 'c4933319-91ba-4ac0-8411-305875a62a66',
    //             size: 'XS',
    //             colors: ['yellow'],
    //         },
    //         {
    //             _id: 'a39403e0-8baa-474a-a9a2-12a97eacf5df',
    //             size: 'XL',
    //             colors: ['yellow', 'blue'],
    //         },
    //     ],
    //     isPaid: false,
    //     phone: '0763948610',
    //     address: 'Thoi an o mon can tho',
    // });
    // await order.save();

    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listModel = await ordersModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 })
            .populate('listProductOrder._id');
        // cho nay tra ve mang product
        res.status(200).json({
            data: listModel,
            statusCode: 200,
            message: 'Get list order success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get listModel failed.',
            ok: false,
        });
    }
};
// [PUT] /order
export const updateOrder = async (req, res) => {
    // try {
    //     const orderId = req.body._id;
    //     const listProductOrder = req.body.listProductOrder;
    //     const phone = req.body.phone;
    //     const address = req.body.address;
    //     if (!orderId || !listProductOrder || !phone || !address) {
    //         return res.status(401).json({
    //             statusCode: 401,
    //             message: 'Missing information order .',
    //             ok: false,
    //             data: null,
    //         });
    //     }
    //     const userExist = await accountsModel.findOne({
    //         id: req.user,
    //     });
    //     if (!userExist) {
    //         return res.status(403).json({
    //             statusCode: 403,
    //             message: 'You are not authenticate.',
    //             ok: false,
    //             data: null,
    //         });
    //     }
    //     const existOrder = await ordersModel.findOne({
    //         _id: orderId,
    //         storeId,
    //     });
    //     if (!existOrder) {
    //         return res.status(401).json({
    //             statusCode: 401,
    //             message: 'Order id or store id is wrong.',
    //             ok: false,
    //             data: null,
    //         });
    //     }
    //     const newOrderUpdate = await ordersModel.findOneAndUpdate(
    //         {
    //             _id: orderId,
    //             storeId,
    //         },
    //         {
    //             phone,
    //             address,
    //             listProductOrder,
    //         },
    //         {
    //             new: true,
    //         },
    //     );
    //     res.status(200).json({
    //         data: newOrderUpdate,
    //         statusCode: 200,
    //         message: 'Update order success.',
    //         ok: true,
    //     });
    // } catch (error) {
    //     res.status(401).json({
    //         data: error,
    //         statusCode: 401,
    //         message: 'Something went wrong. Update order failed.',
    //         ok: false,
    //     });
    // }
};
// [DELETE] /order

export const deleteOrder = async (req, res) => {
    const orderId = req.body._id;
    const storeId = req.body.storeId;
    try {
        if (!orderId || !storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Order id or store id  is missing.',
                ok: false,
                data: null,
            });
        }
        const userExist = await accountsModel.findOne({
            id: req.user,
        });
        if (!userExist) {
            return res.status(403).json({
                statusCode: 403,
                message: 'You are not authenticate.',
                ok: false,
                data: null,
            });
        }

        const orderDeleted = await ordersModel.findOneAndDelete({
            _id: orderId,
            storeId,
        });
        res.status(200).json({
            data: orderDeleted,
            message: 'Delete order success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Delete order failed',
            ok: false,
            data: error,
        });
    }
};
